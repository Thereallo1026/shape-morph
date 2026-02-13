import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getShape, type ShapeName } from "../core/material-shapes";
import { Morph } from "../core/morph";
import { easeInOut } from "../easing";
import { toClipPathPolygon } from "../output/clip-path";
import { toPathD } from "../output/svg-path";

export interface MorphOptions {
  /** Target progress (0-1). Changes trigger animation. */
  progress: number;
  /** Animation duration in ms (default 300). Cannot use with `lerp`. */
  duration?: number;
  /** Easing function for duration-based animation (default easeInOut). Cannot use with `lerp`. */
  easing?: (t: number) => number;
  /** Lerp factor (0-1). Each frame moves this fraction toward the target. Cannot use with `duration` or `easing`. */
  lerp?: number;
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
  if (options.lerp !== undefined && options.duration !== undefined) {
    throw new Error("Cannot use both 'lerp' and 'duration'");
  }
  if (options.lerp !== undefined && options.easing !== undefined) {
    throw new Error("Cannot use both 'lerp' and 'easing'");
  }

  const morph = useMemo(
    () => new Morph(getShape(startShape), getShape(endShape)),
    [startShape, endShape]
  );

  const [currentProgress, setCurrentProgress] = useState(options.progress);
  const animRef = useRef(0);
  const progressRef = useRef(currentProgress);
  progressRef.current = currentProgress;

  const targetRef = useRef(options.progress);

  const animate = useCallback(
    (
      from: number,
      to: number,
      duration: number,
      easingFn: (t: number) => number
    ) => {
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
        const eased = easingFn(t);
        setCurrentProgress(from + (to - from) * eased);

        if (t < 1) {
          animRef.current = requestAnimationFrame(step);
        }
      };

      animRef.current = requestAnimationFrame(step);
    },
    []
  );

  const lerpAnimate = useCallback((target: number, factor: number) => {
    cancelAnimationFrame(animRef.current);

    const step = () => {
      const current = progressRef.current;
      if (Math.abs(target - current) < 0.001) {
        setCurrentProgress(target);
        return;
      }
      setCurrentProgress(current + (target - current) * factor);
      animRef.current = requestAnimationFrame(step);
    };

    animRef.current = requestAnimationFrame(step);
  }, []);

  useEffect(() => {
    const prev = targetRef.current;
    targetRef.current = options.progress;

    if (Math.abs(prev - options.progress) > 0.001) {
      if (options.lerp !== undefined) {
        lerpAnimate(options.progress, options.lerp);
      } else {
        animate(
          progressRef.current,
          options.progress,
          options.duration ?? 300,
          options.easing ?? easeInOut
        );
      }
    }
  }, [
    options.progress,
    options.duration,
    options.easing,
    options.lerp,
    animate,
    lerpAnimate,
  ]);

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
