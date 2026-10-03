import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

import type { FuelType } from "../../../models/fuel";
import type { HeroCta, HeroFocus, HeroMarker, HeroStage, HeroTheme, HeroVariant } from "./heroSceneTypes";
import {
  ROAD_HALF_WIDTH,
  ROAD_START,
  centreDashes,
  createChannelGeometry,
  createNozzle,
  createRouteCurve,
  createStripGeometry,
  drawMarkerTexture,
  drawStationTexture,
  roadsidePoint,
  scenePalette,
  type ScenePalette,
} from "./heroGeometry";

/** Pulse hue per fuel: one amber family, shifted slightly so a fuel switch reads physically. */
const FUEL_HUE: Record<FuelType, string> = { gasoline95: "#ffb84d", diesel: "#ff9a3c", lpg: "#ffd56b" };

type VariantConfig = {
  /** Multiplies every intro timing (mobile runs at 0.6×, ~1.4 s). */
  pace: number;
  segments: number;
  /** Allowed camera elevation above the ground, degrees. */
  elevation: [number, number];
  /** Allowed camera azimuth range around the destination, degrees from +Z. */
  azimuth: [number, number];
  /** Where the nozzle spout should land, as canvas fractions. The destination lands on the focus point. */
  nozzleAt: [number, number];
  fov: number;
  contextAt: number[];
  contextOffset: number;
  nozzleScale: number;
  fogFar: number;
};

const VARIANTS: Record<HeroVariant, VariantConfig> = {
  desktop: { pace: 1, segments: 240, elevation: [18, 32], azimuth: [-10, 70], nozzleAt: [0.31, 0.9], fov: 30, contextAt: [0.46, 0.7], contextOffset: 1.9, nozzleScale: 1.3, fogFar: 48 },
  tablet: { pace: 0.85, segments: 200, elevation: [12, 34], azimuth: [30, 85], nozzleAt: [0.17, 0.32], fov: 32, contextAt: [0.55], contextOffset: -1.8, nozzleScale: 1.7, fogFar: 48 },
  mobile: { pace: 0.6, segments: 150, elevation: [12, 34], azimuth: [30, 85], nozzleAt: [0.19, 0.34], fov: 34, contextAt: [], contextOffset: -2, nozzleScale: 1.7, fogFar: 48 },
};

/** Intro beats in seconds at desktop pace (mobile runs at 0.6×, ~1.4 s). */
const T = {
  pulseForm: [0.12, 0.45],
  travel: [0.42, 1.6],
  destRise: [1.35, 1.75],
  road: 0.42,
  markets: 0.95,
  board: 1.7,
  settled: 2.35,
  dolly: 1.9,
} as const;

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const progress = (t: number, a: number, b: number) => clamp01((t - a) / (b - a));
const easeOut = (x: number) => 1 - Math.pow(1 - x, 3);
const easeInOut = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
const damp = THREE.MathUtils.damp;
const now = () => performance.now() / 1000;

export type HeroWorldState = {
  theme: HeroTheme;
  reducedMotion: boolean;
  skipIntro: boolean;
  active: boolean;
  fuelType: FuelType;
  destination: HeroMarker;
  context: HeroMarker[];
  cta: HeroCta;
  focus: HeroFocus;
  fontFamily: string;
};

export type HeroWorldCallbacks = {
  onStage: (stage: HeroStage) => void;
  onHandoff: (point: { x: number; y: number }) => void;
};

type Marker = { group: THREE.Group; panel: THREE.Mesh; material: THREE.MeshBasicMaterial; key: string; riseAt: number };

/**
 * The hero's 3D world: plain three.js, rendered on demand. Frames are only
 * drawn while something is moving (intro, CTA response, market run, pointer
 * parallax); a settled hero costs nothing.
 */
export class HeroWorld {
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera: THREE.PerspectiveCamera;
  private config: VariantConfig;
  private curve = createRouteCurve();
  private palette: ScenePalette;
  private state: HeroWorldState;
  private callbacks: HeroWorldCallbacks;

  private channel: { geometry: THREE.BufferGeometry; indicesPerSegment: number };
  private channelMesh: THREE.Mesh;
  private edgeMeshes: THREE.Mesh[] = [];
  private dashes = centreDashes(this.curve, ROAD_START + 0.02, 0.985, 28);
  private dashMesh: THREE.InstancedMesh;
  private nozzle: THREE.Group;
  private pulse: THREE.Mesh;
  private pulseLight: THREE.PointLight;
  private destination: Marker;
  private destinationPoint = this.curve.getPointAt(1);
  private contextMarkers: Marker[] = [];
  private contextSpots: { u: number; position: THREE.Vector3 }[];
  private station: THREE.Group;
  private stationSpot = { u: 0.3, position: roadsidePoint(this.curve, 0.3, 1.85) };
  private lights: { hemi: THREE.HemisphereLight; key: THREE.DirectionalLight; rim: THREE.DirectionalLight };
  private envTarget: THREE.WebGLRenderTarget | null = null;

  private width = 1;
  private height = 1;
  private frame = 0;
  private lastTime = 0;
  private start = -1;
  private lastStage: HeroStage = "boot";
  private handedOff = false;
  private pointer = new THREE.Vector2();
  private parallax = new THREE.Vector2();
  private restU = 0.012;
  private glow = 0;
  private flash = 0;
  private stationWake = 0;
  private run = { from: 0, at: -1 };
  private hue = new THREE.Color();
  private materials: THREE.Material[] = [];
  private disposed = false;

  constructor(canvas: HTMLCanvasElement, variant: HeroVariant, state: HeroWorldState, callbacks: HeroWorldCallbacks) {
    this.config = VARIANTS[variant];
    this.state = state;
    this.callbacks = callbacks;
    this.palette = scenePalette(state.theme);
    this.hue.set(FUEL_HUE[state.fuelType]);

    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "low-power" });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.NoToneMapping;
    this.renderer.setClearColor(0x000000, 0);

    this.camera = new THREE.PerspectiveCamera(this.config.fov, 1, 0.1, 80);

    const hemi = new THREE.HemisphereLight();
    const key = new THREE.DirectionalLight();
    key.position.set(5, 8, 6);
    const rim = new THREE.DirectionalLight();
    rim.position.set(-6, 3, -8);
    this.lights = { hemi, key, rim };
    this.scene.add(hemi, key, rim);

    // One mesh from spout to horizon: the hose flattens into the road.
    this.channel = createChannelGeometry(this.curve, this.config.segments);
    this.channelMesh = new THREE.Mesh(this.channel.geometry, this.track(new THREE.MeshStandardMaterial({ roughness: 0.82, metalness: 0.08 })));
    this.scene.add(this.channelMesh);

    for (const side of [-1, 1]) {
      const strip = createStripGeometry(this.curve, ROAD_START, 1, side * (ROAD_HALF_WIDTH - 0.1), 0.07, 120);
      const mesh = new THREE.Mesh(strip.geometry, this.track(new THREE.MeshStandardMaterial({ roughness: 0.6 })));
      this.edgeMeshes.push(mesh);
      this.scene.add(mesh);
    }

    this.dashMesh = new THREE.InstancedMesh(
      new THREE.BoxGeometry(0.07, 0.006, 0.42),
      this.track(new THREE.MeshStandardMaterial({ roughness: 0.5, emissiveIntensity: 0.35 })),
      this.dashes.length
    );
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const one = new THREE.Vector3(1, 1, 1);
    this.dashes.forEach((d, i) => {
      q.setFromAxisAngle(new THREE.Vector3(0, 1, 0), d.heading);
      m.compose(d.position, q, one);
      this.dashMesh.setMatrixAt(i, m);
    });
    this.scene.add(this.dashMesh);

    this.nozzle = createNozzle(this.palette);
    this.placeNozzle();
    this.scene.add(this.nozzle);

    this.pulse = new THREE.Mesh(
      new THREE.CapsuleGeometry(0.15, 0.34, 8, 16),
      this.track(new THREE.MeshStandardMaterial({ roughness: 0.15, metalness: 0, emissiveIntensity: 1.6 }))
    );
    this.pulseLight = new THREE.PointLight(0xffffff, 0, 4.5, 2);
    this.pulse.add(this.pulseLight);
    this.scene.add(this.pulse);

    this.destination = this.createMarker(1.6, 1.3, state.destination, true);
    this.contextSpots = this.config.contextAt.map((u) => ({ u, position: roadsidePoint(this.curve, u, this.config.contextOffset) }));
    this.contextMarkers = this.contextSpots.map((_, i) => this.createMarker(1.05, 0.7, state.context[i] ?? { key: "", code: "", price: "" }, false));

    this.station = this.createStation();
    this.scene.add(this.station);

    this.applyTheme();
  }

  private track<M extends THREE.Material>(material: M): M {
    this.materials.push(material);
    return material;
  }

  private placeNozzle() {
    const start = this.curve.getPointAt(0);
    const dir = this.curve.getTangentAt(0).normalize();
    this.nozzle.position.copy(start);
    this.nozzle.quaternion.setFromUnitVectors(new THREE.Vector3(1, 0, 0), dir);
    this.nozzle.scale.setScalar(this.config.nozzleScale);
  }

  private createMarker(width: number, postHeight: number, data: HeroMarker, emphasis: boolean): Marker {
    const group = new THREE.Group();
    const post = new THREE.Mesh(new THREE.CylinderGeometry(emphasis ? 0.035 : 0.025, emphasis ? 0.035 : 0.025, postHeight, 10), this.track(new THREE.MeshStandardMaterial({ metalness: 0.5, roughness: 0.4 })));
    post.position.y = postHeight / 2;
    post.name = "post";
    const material = this.track(new THREE.MeshBasicMaterial({ transparent: true, alphaTest: 0.02, fog: false, side: THREE.DoubleSide, toneMapped: false }));
    const panel = new THREE.Mesh(new THREE.PlaneGeometry(width, width / 2), material);
    panel.position.y = postHeight + width * 0.25;
    group.add(post, panel);
    group.visible = false;
    this.scene.add(group);
    const marker: Marker = { group, panel, material, key: "", riseAt: 0 };
    this.paintMarker(marker, data, emphasis);
    return marker;
  }

  private paintMarker(marker: Marker, data: HeroMarker, emphasis: boolean) {
    marker.key = data.key;
    if (!data.code) return;
    const canvas = document.createElement("canvas");
    drawMarkerTexture(canvas, this.palette, this.state.fontFamily, data.code, data.price, emphasis);
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 4;
    marker.material.map?.dispose();
    marker.material.map = texture;
    marker.material.needsUpdate = true;
  }

  private createStation() {
    const group = new THREE.Group();
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.6, 8), this.track(new THREE.MeshStandardMaterial({ metalness: 0.5, roughness: 0.4 })));
    post.position.y = 0.3;
    post.name = "post";
    const panel = new THREE.Mesh(new THREE.PlaneGeometry(0.55, 0.55), this.track(new THREE.MeshBasicMaterial({ transparent: true, alphaTest: 0.02, fog: false, side: THREE.DoubleSide, toneMapped: false })));
    panel.position.y = 0.85;
    panel.name = "stationPanel";
    group.add(post, panel);
    group.visible = false;
    return group;
  }

  /** Colours, lights, fog, environment and sign textures for the current theme. */
  private applyTheme() {
    const p = this.palette;
    const light = this.state.theme === "light";
    this.lights.hemi.color.set(p.ambient);
    this.lights.hemi.groundColor.set(p.ground);
    this.lights.hemi.intensity = light ? 0.95 : 0.45;
    this.lights.key.color.set(p.keyLight);
    this.lights.key.intensity = light ? 1.35 : 1.25;
    this.lights.rim.color.set(p.rimLight);
    this.lights.rim.intensity = light ? 0.35 : 0.8;
    this.scene.fog = new THREE.Fog(p.fog, 12, this.config.fogFar);

    (this.channelMesh.material as THREE.MeshStandardMaterial).color.set(p.asphalt);
    for (const mesh of this.edgeMeshes) {
      const mat = mesh.material as THREE.MeshStandardMaterial;
      mat.color.set(p.edge);
      mat.emissive.set(p.edge);
      mat.emissiveIntensity = light ? 0 : 0.22;
    }
    const dashMat = this.dashMesh.material as THREE.MeshStandardMaterial;
    dashMat.color.set(p.centre);
    dashMat.emissive.set(p.centreEmissive);

    // Nozzle materials are baked per palette; rebuild it in place.
    this.scene.remove(this.nozzle);
    this.disposeObject(this.nozzle);
    this.nozzle = createNozzle(p);
    this.placeNozzle();
    this.scene.add(this.nozzle);

    for (const marker of [this.destination, ...this.contextMarkers]) {
      ((marker.group.getObjectByName("post") as THREE.Mesh).material as THREE.MeshStandardMaterial).color.set(p.post);
    }
    ((this.station.getObjectByName("post") as THREE.Mesh).material as THREE.MeshStandardMaterial).color.set(p.post);
    const stationCanvas = document.createElement("canvas");
    drawStationTexture(stationCanvas, p);
    const stationTex = new THREE.CanvasTexture(stationCanvas);
    stationTex.colorSpace = THREE.SRGBColorSpace;
    const stationMat = (this.station.getObjectByName("stationPanel") as THREE.Mesh).material as THREE.MeshBasicMaterial;
    stationMat.map?.dispose();
    stationMat.map = stationTex;
    stationMat.needsUpdate = true;

    this.paintMarker(this.destination, this.state.destination, true);
    this.contextMarkers.forEach((marker, i) => this.paintMarker(marker, this.state.context[i] ?? { key: "", code: "", price: "" }, false));

    // Physically based reflections on the nozzle without shipping an HDR file.
    const pmrem = new THREE.PMREMGenerator(this.renderer);
    this.envTarget?.dispose();
    this.envTarget = pmrem.fromScene(new RoomEnvironment(), 0.04);
    this.scene.environment = this.envTarget.texture;
    this.scene.environmentIntensity = light ? 0.45 : 0.22;
    pmrem.dispose();
  }

  private solved: { key: string; dir: THREE.Vector3; distance: number } | null = null;

  /** Look at the destination and shift the frustum so it lands on the focus point. */
  private aimCamera() {
    const f = this.state.focus;
    this.camera.lookAt(this.destinationPoint.x, 0.55, this.destinationPoint.z);
    this.camera.setViewOffset(this.width, this.height, (0.5 - f.x) * this.width, (0.5 - f.y) * this.height, this.width, this.height);
    this.camera.updateProjectionMatrix();
    this.camera.updateMatrixWorld();
  }

  /**
   * Finds the camera angle and distance that put the nozzle spout at the
   * layout's free spot while the destination stays on the board. Re-solved
   * only when the canvas size or focus changes.
   */
  private solveCamera() {
    const f = this.state.focus;
    const key = `${this.width}x${this.height}:${f.x.toFixed(3)},${f.y.toFixed(3)}`;
    if (this.solved?.key === key) return this.solved;
    const c = this.config;
    const nozzle = this.curve.getPointAt(0);
    const mid = this.curve.getPointAt(0.5);
    const v = new THREE.Vector3();
    let best = { error: Infinity, dir: new THREE.Vector3(0, 0.4, 0.9).normalize(), distance: 18 };
    for (let elDeg = c.elevation[0]; elDeg <= c.elevation[1]; elDeg += 3) {
      const el = THREE.MathUtils.degToRad(elDeg);
      for (let az = c.azimuth[0]; az <= c.azimuth[1]; az += 3) {
        const a = THREE.MathUtils.degToRad(az);
        const dir = new THREE.Vector3(Math.cos(el) * Math.sin(a), Math.sin(el), Math.cos(el) * Math.cos(a));
        for (let distance = 4; distance <= 60; distance *= 1.05) {
          this.camera.position.set(this.destinationPoint.x + dir.x * distance, 0.55 + dir.y * distance, this.destinationPoint.z + dir.z * distance);
          this.aimCamera();
          v.copy(nozzle).project(this.camera);
          const nx = (v.x + 1) / 2;
          const ny = (1 - v.y) / 2;
          let error = Math.hypot(nx - c.nozzleAt[0], ny - c.nozzleAt[1]);
          // Spout and the route's midpoint must both stay in frame.
          if (nx < 0.02 || nx > 0.98 || ny < 0.03 || ny > 0.97 || v.z > 1) error += 2;
          v.copy(mid).project(this.camera);
          if (Math.abs(v.x) > 0.95 || Math.abs(v.y) > 0.95 || v.z > 1) error += 1;
          if (error < best.error) best = { error, dir: dir.clone(), distance };
        }
      }
    }
    this.solved = { key, dir: best.dir, distance: best.distance };
    return this.solved;
  }

  update(next: HeroWorldState) {
    const prev = this.state;
    this.state = next;
    if (next.theme !== prev.theme || next.fontFamily !== prev.fontFamily) {
      this.palette = scenePalette(next.theme);
      this.applyTheme();
    } else {
      if (next.destination.key !== prev.destination.key) {
        this.paintMarker(this.destination, next.destination, true);
        // A market change after the intro: the pulse makes a short run to the new destination.
        if (this.lastStage === "settled") this.run = { from: 0.28, at: now() };
      }
      this.contextMarkers.forEach((marker, i) => {
        const data = next.context[i] ?? { key: "", code: "", price: "" };
        if (data.key === marker.key) return;
        this.paintMarker(marker, data, false);
        if (this.lastStage === "settled") marker.riseAt = now();
      });
    }
    if (next.fuelType !== prev.fuelType) this.flash = 1;
    this.invalidate();
  }

  setPointer(x: number, y: number) {
    this.pointer.set(x, y);
    this.invalidate();
  }

  resize(width: number, height: number) {
    this.width = Math.max(1, width);
    this.height = Math.max(1, height);
    this.renderer.setSize(this.width, this.height, false);
    this.camera.aspect = this.width / this.height;
    this.invalidate();
  }

  /** Request a frame; frames keep coming only while something animates. */
  invalidate() {
    if (this.disposed || this.frame || !this.state.active) return;
    this.frame = requestAnimationFrame(this.tick);
  }

  private tick = (time: number) => {
    this.frame = 0;
    if (this.disposed) return;
    const seconds = time / 1000;
    const dt = this.lastTime ? Math.min(seconds - this.lastTime, 0.05) : 1 / 60;
    this.lastTime = seconds;
    const animating = this.step(seconds, dt);
    this.renderer.render(this.scene, this.camera);
    if (animating) this.invalidate();
    else this.lastTime = 0;
  };

  private step(seconds: number, dt: number) {
    const s = this.state;
    const c = this.config;
    const t = (x: number) => x * c.pace;
    const introEnd = t(T.settled);
    if (this.start < 0) this.start = seconds;
    const ti = s.skipIntro || s.reducedMotion ? introEnd + 1 : seconds - this.start;
    let animating = ti < introEnd + 0.2;

    // ── Stage beats, mirrored to the DOM ─────────────────────────────────
    const stage: HeroStage = ti >= t(T.settled) ? "settled" : ti >= t(T.board) ? "board" : ti >= t(T.markets) ? "markets" : ti >= t(T.road) ? "road" : "source";

    // ── Camera: short dolly in, then a small pointer-led parallax ────────
    const dolly = s.reducedMotion ? 1 : easeOut(progress(ti, 0, t(T.dolly)));
    const settled = stage === "settled";
    const px = settled && !s.reducedMotion ? this.pointer.x : 0;
    const py = settled && !s.reducedMotion ? this.pointer.y : 0;
    this.parallax.x = damp(this.parallax.x, px, 3, dt);
    this.parallax.y = damp(this.parallax.y, py, 3, dt);
    if (Math.abs(this.parallax.x - px) > 0.002 || Math.abs(this.parallax.y - py) > 0.002) animating = true;
    const base = this.solveCamera();
    const pull = 1 + 0.2 * (1 - dolly);
    this.camera.position.set(
      this.destinationPoint.x + base.dir.x * base.distance * pull + this.parallax.x * 0.25,
      0.55 + base.dir.y * base.distance * pull - this.parallax.y * 0.14,
      this.destinationPoint.z + base.dir.z * base.distance * pull
    );
    this.aimCamera();

    if (stage !== this.lastStage) {
      if ((stage === "markets" || stage === "board") && !this.handedOff) {
        // Report where the destination sign stands before the board needs it.
        this.handedOff = true;
        const v = new THREE.Vector3(this.destinationPoint.x, 0.95, this.destinationPoint.z).project(this.camera);
        this.callbacks.onHandoff({ x: ((v.x + 1) / 2) * this.width, y: ((1 - v.y) / 2) * this.height });
      }
      this.lastStage = stage;
      this.callbacks.onStage(stage);
    }

    // ── Fuel pulse ───────────────────────────────────────────────────────
    const travel = easeInOut(progress(ti, t(T.travel[0]), t(T.travel[1])));
    const formed = easeOut(progress(ti, t(T.pulseForm[0]), t(T.pulseForm[1])));
    let pulseU = travel;
    let pulseScale = formed * (1 - progress(ti, t(T.travel[1]), t(T.travel[1]) + 0.18));

    // After arrival a resting droplet re-forms at the spout; the trip CTA nudges it forward.
    const restTarget = s.cta === "trip" && !s.reducedMotion ? 0.11 : 0.012;
    this.restU = damp(this.restU, restTarget, 4, dt);
    if (Math.abs(this.restU - restTarget) > 0.0005) animating = true;
    if (ti >= t(T.travel[1]) + 0.18) {
      pulseU = this.restU;
      // The resting droplet is smaller than the travelling pulse.
      pulseScale = 0.62 * (s.reducedMotion ? 1 : easeOut(progress(ti, t(T.travel[1]) + 0.25, introEnd)));
    }

    if (this.run.at > 0) {
      const r = progress(now(), this.run.at, this.run.at + 0.6);
      if (r < 1 && !s.reducedMotion) {
        pulseU = THREE.MathUtils.lerp(this.run.from, 1, easeInOut(r));
        pulseScale = 1 - progress(r, 0.85, 1);
        animating = true;
      } else {
        this.run.at = -1;
      }
    }

    const u = clamp01(pulseU);
    const p = this.curve.getPointAt(u);
    this.pulse.position.set(p.x, Math.max(p.y, 0.16), p.z);
    this.pulse.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), this.curve.getTangentAt(u).normalize());
    this.pulse.scale.setScalar(Math.max(0.0001, pulseScale));
    this.pulse.visible = pulseScale > 0.01;
    const targetHue = new THREE.Color(FUEL_HUE[s.fuelType]);
    this.hue.lerp(targetHue, 1 - Math.exp(-6 * dt));
    if (Math.abs(this.hue.r - targetHue.r) + Math.abs(this.hue.g - targetHue.g) + Math.abs(this.hue.b - targetHue.b) > 0.004) animating = true;
    const pulseMat = this.pulse.material as THREE.MeshStandardMaterial;
    pulseMat.color.copy(this.hue);
    pulseMat.emissive.copy(this.hue);
    this.pulseLight.color.copy(this.hue);
    this.pulseLight.intensity = 5 * pulseScale;

    // ── Route reveal: the channel extrudes just ahead of the pulse ───────
    const reveal = Math.max(0.02, Math.min(1, travel + 0.07));
    this.channel.geometry.setDrawRange(0, Math.ceil(reveal * c.segments) * this.channel.indicesPerSegment);
    const markingReveal = clamp01((travel - ROAD_START) / (1 - ROAD_START));
    for (const mesh of this.edgeMeshes) mesh.geometry.setDrawRange(0, Math.ceil(markingReveal * 120) * 6);
    this.dashMesh.count = this.dashes.filter((d) => d.u <= travel - 0.01).length;

    const glowTarget = s.cta === "trip" ? 1 : 0;
    this.glow = s.reducedMotion ? glowTarget : damp(this.glow, glowTarget, 6, dt);
    this.flash = s.reducedMotion ? 0 : damp(this.flash, 0, 4, dt);
    if (Math.abs(this.glow - glowTarget) > 0.005 || this.flash > 0.01) animating = true;
    (this.dashMesh.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.35 + this.glow * 1.1 + this.flash * 0.8;

    // ── Markers ──────────────────────────────────────────────────────────
    const destRise = easeOut(progress(ti, t(T.destRise[0]), t(T.destRise[1])));
    const handoff = progress(ti, t(T.board), t(T.board) + 0.5);
    const dest = this.destination.group;
    dest.position.set(this.destinationPoint.x, -1.6 * (1 - destRise), this.destinationPoint.z);
    dest.scale.setScalar(Math.max(0.0001, destRise * (1 + handoff * 0.35)));
    dest.visible = handoff < 0.98 && destRise > 0.01;
    this.destination.material.opacity = 1 - handoff;
    dest.quaternion.copy(this.camera.quaternion);

    this.contextMarkers.forEach((marker, i) => {
      const spot = this.contextSpots[i];
      if (!marker.key) {
        marker.group.visible = false;
        return;
      }
      const reachAt = t(THREE.MathUtils.lerp(T.travel[0], T.travel[1], spot.u));
      let rise = easeOut(progress(ti, reachAt - 0.05, reachAt + 0.3));
      if (marker.riseAt && !s.reducedMotion) {
        const r = progress(now(), marker.riseAt, marker.riseAt + 0.35);
        rise = easeOut(r);
        if (r < 1) animating = true;
      }
      marker.group.position.set(spot.position.x, -1.4 * (1 - rise), spot.position.z);
      marker.group.scale.setScalar(Math.max(0.0001, rise));
      marker.group.visible = rise > 0.01;
      marker.group.quaternion.copy(this.camera.quaternion);
    });

    // The station marker wakes only while the stations CTA is engaged.
    const wakeTarget = s.cta === "stations" ? 1 : 0;
    this.stationWake = s.reducedMotion ? wakeTarget : damp(this.stationWake, wakeTarget, 7, dt);
    if (Math.abs(this.stationWake - wakeTarget) > 0.005) animating = true;
    this.station.position.set(this.stationSpot.position.x, -0.9 * (1 - this.stationWake), this.stationSpot.position.z);
    this.station.scale.setScalar(Math.max(0.0001, 0.6 + 0.4 * this.stationWake));
    this.station.visible = this.stationWake > 0.02;
    this.station.quaternion.copy(this.camera.quaternion);

    const nozzleIn = s.reducedMotion ? 1 : easeOut(progress(ti, 0, t(0.45)));
    this.nozzle.scale.setScalar(c.nozzleScale * (0.94 + 0.06 * nozzleIn));

    return animating;
  }

  private disposeObject(object: THREE.Object3D) {
    object.traverse((child) => {
      const mesh = child as THREE.Mesh;
      mesh.geometry?.dispose();
      const material = mesh.material as THREE.Material | THREE.Material[] | undefined;
      if (Array.isArray(material)) material.forEach((m) => m.dispose());
      else material?.dispose();
    });
  }

  dispose() {
    this.disposed = true;
    if (this.frame) cancelAnimationFrame(this.frame);
    this.scene.traverse((child) => {
      const mesh = child as THREE.Mesh;
      mesh.geometry?.dispose();
      const material = mesh.material as THREE.MeshBasicMaterial | undefined;
      material?.map?.dispose();
    });
    this.materials.forEach((m) => m.dispose());
    this.disposeObject(this.nozzle);
    this.envTarget?.dispose();
    this.renderer.dispose();
  }
}
