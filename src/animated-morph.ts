import { getShape, type ShapeName } from "./core/material-shapes";
import { Morph } from "./core/morph";
import type { RoundedPolygon } from "./core/polygon";
import { easeInOut } from "./easing";
import { toClipPathPolygon } from "./output/clip-path";
import { toPathD } from "./output/svg-path";

export interface AnimatedMorphFrame {
  /** SVG path `d` attribute string */
  pathD: string;
  /** CSS `clip-path: polygon(...)` value */
  clipPath: string;
  /** Current animated progress (0-1) */
  progress: number;
}

export interface AnimatedMorphOptions {
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
  /** Called each animation frame with the current shape output. */
  onFrame: (frame: AnimatedMorphFrame) => void;
}

export class AnimatedMorph {
  private readonly morph: Morph;
  private readonly options: AnimatedMorphOptions;
  private _progress = 0;
  private currentProgress = 0;
  private animId = 0;

  constructor(
    start: ShapeName | RoundedPolygon,
    end: ShapeName | RoundedPolygon,
    options: AnimatedMorphOptions
  ) {
    if (options.lerp !== undefined && options.duration !== undefined) {
      throw new Error("Cannot use both 'lerp' and 'duration'");
    }
    if (options.lerp !== undefined && options.easing !== undefined) {
      throw new Error("Cannot use both 'lerp' and 'easing'");
    }

    const startPoly = typeof start === "string" ? getShape(start) : start;
    const endPoly = typeof end === "string" ? getShape(end) : end;

    this.morph = new Morph(startPoly, endPoly);
    this.options = options;

    this.emitFrame(0);
  }

  get progress(): number {
    return this._progress;
  }

  set progress(target: number) {
    this._progress = target;

    if (this.options.lerp !== undefined) {
      this.animateLerp(target, this.options.lerp);
    } else {
      this.animateDuration(
        this.currentProgress,
        target,
        this.options.duration ?? 300,
        this.options.easing ?? easeInOut
      );
    }
  }

  dispose(): void {
    cancelAnimationFrame(this.animId);
  }

  private emitFrame(progress: number): void {
    this.currentProgress = progress;
    const cubics = this.morph.asCubics(progress);
    const samples = this.options.samples ?? 4;
    const size = this.options.size ?? 100;
    this.options.onFrame({
      pathD: toPathD(cubics, size),
      clipPath: toClipPathPolygon(cubics, samples),
      progress,
    });
  }

  private animateDuration(
    from: number,
    to: number,
    duration: number,
    easingFn: (t: number) => number
  ): void {
    cancelAnimationFrame(this.animId);

    if (Math.abs(from - to) < 0.001) {
      this.emitFrame(to);
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
      this.emitFrame(from + (to - from) * eased);

      if (t < 1) {
        this.animId = requestAnimationFrame(step);
      }
    };

    this.animId = requestAnimationFrame(step);
  }

  private animateLerp(target: number, factor: number): void {
    cancelAnimationFrame(this.animId);

    const step = () => {
      if (Math.abs(target - this.currentProgress) < 0.001) {
        this.emitFrame(target);
        return;
      }
      this.emitFrame(
        this.currentProgress + (target - this.currentProgress) * factor
      );
      this.animId = requestAnimationFrame(step);
    };

    this.animId = requestAnimationFrame(step);
  }
}
