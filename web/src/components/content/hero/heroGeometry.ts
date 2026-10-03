import * as THREE from "three";
import type { HeroTheme } from "./heroSceneTypes";

/**
 * One continuous route: it leaves the nozzle spout in the air, drops to the
 * ground and runs into depth. The same curve carries the hose and the road,
 * so the channel can physically flatten into the carriageway.
 */
export function createRouteCurve() {
  return new THREE.CatmullRomCurve3(
    [
      new THREE.Vector3(-2.6, 1.6, 2.4),
      new THREE.Vector3(-2.3, 0.95, 2.2),
      new THREE.Vector3(-1.8, 0.3, 1.7),
      new THREE.Vector3(-1.1, 0.03, 0.8),
      new THREE.Vector3(-0.3, 0.02, -1.4),
      new THREE.Vector3(0.4, 0.02, -4.4),
      new THREE.Vector3(0.3, 0.02, -7.6),
      new THREE.Vector3(-0.1, 0.02, -10.4),
      new THREE.Vector3(-0.2, 0.02, -12.5),
    ],
    false,
    "centripetal",
    0.5
  );
}

/** Route parameter where the round hose has fully become flat road. */
export const HOSE_END = 0.07;
export const ROAD_START = 0.2;
export const ROAD_HALF_WIDTH = 0.85;

const UP = new THREE.Vector3(0, 1, 0);

type Frame = { p: THREE.Vector3; side: THREE.Vector3; up: THREE.Vector3 };

function frameAt(curve: THREE.Curve<THREE.Vector3>, u: number): Frame {
  const p = curve.getPointAt(u);
  const tangent = curve.getTangentAt(u).normalize();
  const side = new THREE.Vector3().crossVectors(tangent, UP);
  if (side.lengthSq() < 1e-6) side.set(1, 0, 0);
  side.normalize();
  const up = new THREE.Vector3().crossVectors(side, tangent).normalize();
  return { p, side, up };
}

const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

/**
 * Channel → road ribbon. Each ring is a superellipse whose width, thickness
 * and squareness blend from a round hose to a flat carriageway.
 * Rings are written in route order so `setDrawRange` reveals the route as the
 * fuel pulse travels.
 */
export function createChannelGeometry(curve: THREE.Curve<THREE.Vector3>, segments: number, ring = 28) {
  const positions: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];

  for (let i = 0; i <= segments; i++) {
    const u = i / segments;
    const { p, side, up } = frameAt(curve, u);
    const f = smooth(HOSE_END, ROAD_START, u);
    const halfW = THREE.MathUtils.lerp(0.13, ROAD_HALF_WIDTH, f);
    const halfH = THREE.MathUtils.lerp(0.13, 0.018, f);
    const exponent = THREE.MathUtils.lerp(2, 10, f);
    // Once flat, the road's top surface sits on the ground plane.
    const lift = THREE.MathUtils.lerp(0, halfH * 0.6, f);

    for (let j = 0; j < ring; j++) {
      const theta = (j / ring) * Math.PI * 2;
      const c = Math.cos(theta);
      const s = Math.sin(theta);
      const x = Math.sign(c) * Math.pow(Math.abs(c), 2 / exponent) * halfW;
      const y = Math.sign(s) * Math.pow(Math.abs(s), 2 / exponent) * halfH;
      positions.push(p.x + side.x * x + up.x * (y + lift), p.y + side.y * x + up.y * (y + lift), p.z + side.z * x + up.z * (y + lift));
      uvs.push(u, j / ring);
    }
  }

  for (let i = 0; i < segments; i++) {
    for (let j = 0; j < ring; j++) {
      const a = i * ring + j;
      const b = i * ring + ((j + 1) % ring);
      const c = (i + 1) * ring + j;
      const d = (i + 1) * ring + ((j + 1) % ring);
      indices.push(a, c, b, b, c, d);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return { geometry, indicesPerSegment: ring * 6 };
}

/** A painted strip on the road surface, `offset` metres from the centre line. */
export function createStripGeometry(curve: THREE.Curve<THREE.Vector3>, from: number, to: number, offset: number, width: number, segments: number) {
  const positions: number[] = [];
  const indices: number[] = [];
  for (let i = 0; i <= segments; i++) {
    const u = THREE.MathUtils.lerp(from, to, i / segments);
    const { p, side } = frameAt(curve, u);
    for (const edge of [-0.5, 0.5]) {
      const o = offset + edge * width;
      positions.push(p.x + side.x * o, 0.032, p.z + side.z * o);
    }
  }
  for (let i = 0; i < segments; i++) {
    const a = i * 2;
    indices.push(a, a + 2, a + 1, a + 1, a + 2, a + 3);
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return { geometry, indicesPerSegment: 6 };
}

/** Centre-line dash placements (position + heading) along the flat road. */
export function centreDashes(curve: THREE.Curve<THREE.Vector3>, from: number, to: number, count: number) {
  return Array.from({ length: count }, (_, i) => {
    const u = THREE.MathUtils.lerp(from, to, (i + 0.5) / count);
    const p = curve.getPointAt(u);
    const tangent = curve.getTangentAt(u);
    return { u, position: new THREE.Vector3(p.x, 0.034, p.z), heading: Math.atan2(tangent.x, tangent.z) };
  });
}

/** Point beside the road at route parameter `u`, `offset` metres to the side. */
export function roadsidePoint(curve: THREE.Curve<THREE.Vector3>, u: number, offset: number) {
  const { p, side } = frameAt(curve, u);
  return new THREE.Vector3(p.x + side.x * offset, 0, p.z + side.z * offset);
}

export type ScenePalette = {
  fog: string;
  asphalt: string;
  hose: string;
  edge: string;
  centre: string;
  centreEmissive: string;
  metal: string;
  metalAccent: string;
  rubber: string;
  post: string;
  panel: string;
  panelBorder: string;
  panelInk: string;
  panelSoft: string;
  keyLight: string;
  rimLight: string;
  ambient: string;
  ground: string;
};

export function scenePalette(theme: HeroTheme): ScenePalette {
  if (theme === "light") {
    return {
      fog: "#f2f0e8",
      asphalt: "#8f8d84",
      hose: "#2b3a35",
      edge: "#fbfaf5",
      centre: "#0b7a56",
      centreEmissive: "#0b7a56",
      metal: "#3a4744",
      metalAccent: "#0a7d58",
      rubber: "#1f2a27",
      post: "#5d6a65",
      panel: "#fbfaf4",
      panelBorder: "#0a7a56",
      panelInk: "#10231d",
      panelSoft: "#4c5f58",
      keyLight: "#fff4e2",
      rimLight: "#bfe8d6",
      ambient: "#f4efe4",
      ground: "#e4e1d6",
    };
  }
  return {
    fog: "#07110f",
    asphalt: "#18201f",
    hose: "#1d2826",
    edge: "#dfe9e3",
    centre: "#5ff2bd",
    centreEmissive: "#38c995",
    metal: "#2b3634",
    metalAccent: "#2fd59d",
    rubber: "#111816",
    post: "#46524e",
    panel: "#0f2620",
    panelBorder: "#4fe3ad",
    panelInk: "#f5f1e8",
    panelSoft: "#9fc1b4",
    keyLight: "#ffe9c9",
    rimLight: "#5ff2bd",
    ambient: "#1b2a27",
    ground: "#0b1513",
  };
}

/** Sign-panel texture: ISO code over the real price, drawn once per value change. */
export function drawMarkerTexture(
  canvas: HTMLCanvasElement,
  palette: ScenePalette,
  fontFamily: string,
  code: string,
  price: string,
  emphasis: boolean
) {
  const w = 512;
  const h = 256;
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.clearRect(0, 0, w, h);
  const r = 26;
  const inset = 8;
  ctx.beginPath();
  ctx.roundRect(inset, inset, w - inset * 2, h - inset * 2, r);
  ctx.fillStyle = palette.panel;
  ctx.fill();
  ctx.lineWidth = emphasis ? 10 : 6;
  ctx.strokeStyle = palette.panelBorder;
  ctx.stroke();

  ctx.fillStyle = palette.panelInk;
  ctx.textBaseline = "alphabetic";
  ctx.font = `800 ${emphasis ? 92 : 86}px ${fontFamily}`;
  ctx.fillText(code, 40, 112);
  ctx.fillStyle = emphasis ? palette.panelBorder : palette.panelInk;
  ctx.font = `700 ${emphasis ? 70 : 64}px ${fontFamily}`;
  ctx.fillText(price, 40, 206);
}

/** Pump pictogram for the roadside station marker. */
export function drawStationTexture(canvas: HTMLCanvasElement, palette: ScenePalette) {
  const s = 256;
  canvas.width = s;
  canvas.height = s;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.clearRect(0, 0, s, s);
  ctx.beginPath();
  ctx.roundRect(8, 8, s - 16, s - 16, 34);
  ctx.fillStyle = palette.panel;
  ctx.fill();
  ctx.lineWidth = 8;
  ctx.strokeStyle = palette.panelBorder;
  ctx.stroke();
  ctx.strokeStyle = palette.panelInk;
  ctx.lineWidth = 14;
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  ctx.strokeRect(72, 64, 70, 128);
  ctx.beginPath();
  ctx.moveTo(72, 112);
  ctx.lineTo(142, 112);
  ctx.moveTo(142, 92);
  ctx.lineTo(176, 92);
  ctx.lineTo(186, 112);
  ctx.lineTo(186, 168);
  ctx.quadraticCurveTo(186, 188, 168, 188);
  ctx.stroke();
}

/**
 * Stylised fuel nozzle in local space: spout tip at the origin pointing +X,
 * body and grip behind it. Built from primitives so it ships as code, not an asset.
 */
export function createNozzle(palette: ScenePalette) {
  const group = new THREE.Group();
  const metal = new THREE.MeshStandardMaterial({ color: palette.metal, metalness: 0.75, roughness: 0.32 });
  const rubber = new THREE.MeshStandardMaterial({ color: palette.rubber, metalness: 0.1, roughness: 0.72 });
  const accent = new THREE.MeshStandardMaterial({ color: palette.metalAccent, metalness: 0.4, roughness: 0.38 });

  const add = (geometry: THREE.BufferGeometry, material: THREE.Material, position: [number, number, number], rotationZ = 0) => {
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(...position);
    mesh.rotation.z = rotationZ;
    group.add(mesh);
    return mesh;
  };

  // Spout: slim tube ending at the origin, with a short collar.
  add(new THREE.CylinderGeometry(0.045, 0.055, 0.78, 20), metal, [-0.39, 0.06, 0], Math.PI / 2 - 0.15);
  add(new THREE.CylinderGeometry(0.075, 0.075, 0.09, 20), accent, [-0.78, 0.12, 0], Math.PI / 2 - 0.15);
  // Body: the valve housing.
  add(new THREE.CapsuleGeometry(0.15, 0.62, 8, 20), metal, [-1.18, 0.2, 0], Math.PI / 2 - 0.08);
  // Accent band on the body — the brand green, as a painted ring rather than a glow.
  add(new THREE.CylinderGeometry(0.158, 0.158, 0.07, 24), accent, [-1.0, 0.185, 0], Math.PI / 2 - 0.08);
  // Grip and lever.
  add(new THREE.CapsuleGeometry(0.095, 0.62, 8, 16), rubber, [-1.52, -0.18, 0], 0.42);
  add(new THREE.BoxGeometry(0.5, 0.05, 0.08), metal, [-1.2, -0.12, 0], -0.12);
  const guard = add(new THREE.TorusGeometry(0.27, 0.025, 10, 28, Math.PI), metal, [-1.24, -0.06, 0], Math.PI);
  guard.scale.set(1.15, 0.85, 1);

  return group;
}
