import { useEffect, useLayoutEffect, useRef } from "react";
import type { HeroSceneProps } from "./heroSceneTypes";
import { HeroWorld, type HeroWorldState } from "./heroWorld";

/**
 * React shell for the hero's three.js world. Owns the canvas, resize,
 * fine-pointer parallax and visibility; everything else lives in HeroWorld.
 */
export default function HeroScene(props: HeroSceneProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const worldRef = useRef<HeroWorld | null>(null);
  const callbacks = useRef({ onStage: props.onStage, onHandoff: props.onHandoff });

  const state: HeroWorldState = {
    theme: props.theme,
    reducedMotion: props.reducedMotion,
    skipIntro: props.skipIntro,
    active: props.active,
    fuelType: props.fuelType,
    destination: props.destination,
    context: props.context,
    cta: props.cta,
    focus: props.focus,
    fontFamily: props.fontFamily,
  };
  const latest = useRef(state);

  useLayoutEffect(() => {
    callbacks.current = { onStage: props.onStage, onHandoff: props.onHandoff };
    latest.current = state;
  });

  // One world per layout variant; it is rebuilt only when the variant changes.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const world = new HeroWorld(canvas, props.variant, latest.current, {
      onStage: (stage) => callbacks.current.onStage(stage),
      onHandoff: (point) => callbacks.current.onHandoff(point),
    });
    worldRef.current = world;

    const parent = canvas.parentElement ?? canvas;
    const resize = () => world.resize(parent.clientWidth, parent.clientHeight);
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(parent);

    let onMove: ((e: PointerEvent) => void) | null = null;
    if (window.matchMedia("(pointer: fine)").matches) {
      onMove = (e) => {
        const rect = canvas.getBoundingClientRect();
        if (!rect.width) return;
        world.setPointer(
          Math.min(1, Math.max(-1, ((e.clientX - rect.left) / rect.width) * 2 - 1)),
          Math.min(1, Math.max(-1, ((e.clientY - rect.top) / rect.height) * 2 - 1))
        );
      };
      window.addEventListener("pointermove", onMove, { passive: true });
    }

    world.invalidate();
    props.onReady();

    return () => {
      observer.disconnect();
      if (onMove) window.removeEventListener("pointermove", onMove);
      world.dispose();
      worldRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.variant]);

  useEffect(() => {
    worldRef.current?.update(latest.current);
  }, [
    props.theme,
    props.reducedMotion,
    props.skipIntro,
    props.active,
    props.fuelType,
    props.destination,
    props.context,
    props.cta,
    props.focus,
    props.fontFamily,
  ]);

  return <canvas ref={canvasRef} className="homeHeroCanvas" aria-hidden="true" tabIndex={-1} />;
}
