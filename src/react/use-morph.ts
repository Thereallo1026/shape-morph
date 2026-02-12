import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getShape, type ShapeName } from "../core/material-shapes";
import { Morph } from "../core/morph";
import { toClipPathPolygon } from "../output/clip-path";
import { toPathD } from "../output/svg-path";

export interface MorphOptions {
  /** Target progress (0-1). Changes trigger animation. */
  progress: number;
  /** Animation duration in ms (default 300) */
  duration?: number;
  /** Samples per cubic for polygon output (default 4) */
  samples?: number;
  /** SVG path size (default 100) */
  size?: number;
}

export interface MorphOutput {
  /** SVG path `d` attribute string */
  pathD: string;
  /** CSS `clip-path: polygon(...)` value */
  clipPath: string;
  /** Current animated progress (0-1) */
  progress: number;
}

/**
 * React hook for JS-driven shape morphing with animation.
 *
 * Changes to `options.progress` animate smoothly from the current
 * position to the target. Useful for hover effects, scroll-driven
 * morphs, or any interactive shape transitions.
 *
 * ```tsx
 * const [hovered, setHovered] = useState(false);
 * const { clipPath } = useMorph('Circle', 'Heart', {
 *   progress: hovered ? 1 : 0,
 *   duration: 500,
 * });
 *
 * <img
 *   style={{ clipPath }}
 *   onMouseEnter={() => setHovered(true)}
 *   onMouseLeave={() => setHovered(false)}
 * />
 * ```
 */
export function useMorph(
  startShape: ShapeName,
  endShape: ShapeName,
  options: MorphOptions
): MorphOutput {
  const morph = useMemo(
    () => new Morph(getShape(startShape), getShape(endShape)),
    [startShape, endShape]
  );

  const [currentProgress, setCurrentProgress] = useState(options.progress);
  const animRef = useRef(0);
  const progressRef = useRef(currentProgress);
  progressRef.current = currentProgress;

  const targetRef = useRef(options.progress);

  const animate = useCallback((from: number, to: number, duration: number) => {
    cancelAnimationFrame(animRef.current);

    if (Math.abs(from - to) < 0.001) {
      setCurrentProgress(to);
      return;
    }

    let startTime: number | null = null;

    const step = (timestamp: number) => {
      if (!startTime) {
        startTime = timestamp;
      }
      const elapsed = timestamp - startTime;
      const t = Math.min(elapsed / duration, 1);
      const eased = t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2;
      setCurrentProgress(from + (to - from) * eased);

      if (t < 1) {
        animRef.current = requestAnimationFrame(step);
      }
    };

    animRef.current = requestAnimationFrame(step);
  }, []);

  useEffect(() => {
    const prev = targetRef.current;
    targetRef.current = options.progress;

    if (Math.abs(prev - options.progress) > 0.001) {
      animate(progressRef.current, options.progress, options.duration ?? 300);
    }
  }, [options.progress, options.duration, animate]);

  useEffect(() => {
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  const samples = options.samples ?? 4;
  const size = options.size ?? 100;

  return useMemo(() => {
    const cubics = morph.asCubics(currentProgress);
    return {
      pathD: toPathD(cubics, size),
      clipPath: toClipPathPolygon(cubics, samples),
      progress: currentProgress,
    };
  }, [morph, currentProgress, samples, size]);
}
