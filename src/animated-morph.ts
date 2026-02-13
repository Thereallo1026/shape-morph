import { getShape, type ShapeName } from "./core/material-shapes";
import { Morph } from "./core/morph";
import type { RoundedPolygon } from "./core/polygon";
import { easeInOut } from "./easing";
import { toClipPathPolygon } from "./output/clip-path";
import { toPathD } from "./output/svg-path";
import type { SpringConfig } from "./spring";

export interface AnimatedMorphFrame {
  /** SVG path `d` attribute string */
  pathD: string;
  /** CSS `clip-path: polygon(...)` value */
  clipPath: string;
  /** Current animated progress. May overshoot 0-1 in spring mode. */
  progress: number;
}

export interface AnimatedMorphOptions {
  /** Animation duration in ms (default 300). Cannot use with `lerp` or `spring`. */
  duration?: number;
  /** Easing function for duration-based animation (default easeInOut). Cannot use with `lerp` or `spring`. */
  easing?: (t: number) => number;
  /** Lerp factor (0-1). Each frame moves this fraction toward the target. Cannot use with `duration`, `easing`, or `spring`. */
  lerp?: number;
  /** Spring physics config. Cannot use with `duration`, `easing`, or `lerp`. */
  spring?: SpringConfig;
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
  private velocity = 0;
  private animId = 0;

  constructor(
    start: ShapeName | RoundedPolygon,
    end: ShapeName | RoundedPolygon,
    options: AnimatedMorphOptions
  ) {
    validateOptions(options);

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

    if (this.options.spring !== undefined) {
      this.animateSpring(target, this.options.spring);
    } else if (this.options.lerp !== undefined) {
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
    const clamped = Math.max(0, Math.min(1, progress));
    const cubics = this.morph.asCubics(clamped);
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

  private animateSpring(target: number, config: SpringConfig): void {
    cancelAnimationFrame(this.animId);

    const stiffness = config.stiffness ?? 180;
    const damping = config.damping ?? 12;
    let lastTime: number | null = null;

    const step = (timestamp: number) => {
      if (!lastTime) {
        lastTime = timestamp;
        this.animId = requestAnimationFrame(step);
        return;
      }

      const dt = Math.min((timestamp - lastTime) / 1000, 1 / 30);
      lastTime = timestamp;

      const force = stiffness * (target - this.currentProgress);
      const friction = damping * this.velocity;
      this.velocity += (force - friction) * dt;
      this.currentProgress += this.velocity * dt;

      if (
        Math.abs(target - this.currentProgress) < 0.0005 &&
        Math.abs(this.velocity) < 0.0005
      ) {
        this.velocity = 0;
        this.emitFrame(target);
        return;
      }

      this.emitFrame(this.currentProgress);
      this.animId = requestAnimationFrame(step);
    };

    this.animId = requestAnimationFrame(step);
  }
}

function validateOptions(options: AnimatedMorphOptions): void {
  const modes: string[] = [];
  if (options.duration !== undefined || options.easing !== undefined) {
    modes.push("duration/easing");
  }
  if (options.lerp !== undefined) {
    modes.push("lerp");
  }
  if (options.spring !== undefined) {
    modes.push("spring");
  }
  if (modes.length > 1) {
    throw new Error(`Cannot combine animation modes: ${modes.join(" and ")}`);
  }
}
