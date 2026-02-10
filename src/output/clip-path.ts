import type { Cubic } from "../core/cubic";
import { Morph } from "../core/morph";
import type { RoundedPolygon } from "../core/polygon";

/**
 * Convert cubics to a CSS `clip-path: path("...")` value.
 *
 * Uses SVG path syntax inside clip-path. Note that CSS cannot
 * transition between different `path()` values - use `toClipPathPolygon`
 * for animatable shapes.
 */
export function toClipPathPath(cubics: Cubic[], size = 100): string {
  if (cubics.length === 0) {
    return 'path("")';
  }

  const s = size;
  let d = `M${(cubics[0].anchor0X * s).toFixed(2)},${(cubics[0].anchor0Y * s).toFixed(2)}`;

  for (const c of cubics) {
    d += `C${(c.control0X * s).toFixed(2)},${(c.control0Y * s).toFixed(2)} ${(c.control1X * s).toFixed(2)},${(c.control1Y * s).toFixed(2)} ${(c.anchor1X * s).toFixed(2)},${(c.anchor1Y * s).toFixed(2)}`;
  }

  d += "Z";
  return `path("${d}")`;
}

/**
 * Sample points along cubic bezier curves to produce a
 * CSS `clip-path: polygon(...)` value using percentage coordinates.
 *
 * This is the key function for CSS transitions with Tailwind.
 * CSS can transition between `polygon()` values that have the same
 * number of vertices. By using a fixed `samplesPerCubic`, all shapes
 * from the same `Morph` produce polygons with identical vertex counts,
 * enabling pure-CSS morphing:
 *
 * ```
 * const morph = new Morph(getShape('Circle'), getShape('Heart'));
 * const start = toClipPathPolygon(morph.asCubics(0));
 * const end   = toClipPathPolygon(morph.asCubics(1));
 * // Both have the same vertex count → CSS can transition between them
 * ```
 *
 * @param cubics - Array of Cubic bezier curves (normalized 0–1)
 * @param samplesPerCubic - Points to sample per cubic segment (default 4)
 * @returns CSS `polygon(...)` string with percentage coordinates
 */
export function toClipPathPolygon(
  cubics: Cubic[],
  samplesPerCubic = 4
): string {
  if (cubics.length === 0) {
    return "polygon(0% 0%)";
  }

  const points: string[] = [];

  for (const cubic of cubics) {
    for (let i = 0; i < samplesPerCubic; i++) {
      const t = i / samplesPerCubic;
      const point = cubic.pointOnCurve(t);
      points.push(
        `${(point.x * 100).toFixed(2)}% ${(point.y * 100).toFixed(2)}%`
      );
    }
  }

  return `polygon(${points.join(",")})`;
}

/**
 * Pre-compute a pair of `polygon()` strings from two shapes that are
 * guaranteed to have the same vertex count. This enables pure-CSS
 * transitions between the two shapes.
 *
 * The `Morph` class internally aligns both shapes so they have the same
 * number of cubic segments. Evaluating at progress 0 and 1 gives two
 * cubic arrays with identical segment counts, which produce polygon
 * strings with identical vertex counts when sampled.
 *
 * ```tsx
 * const [from, to] = toMorphPair(getShape('Circle'), getShape('Heart'));
 * // Use as: style={{ clipPath: from }}
 * // Hover:  style={{ clipPath: to }}
 * // With:   transition: clip-path 500ms ease
 * ```
 *
 * @param start - The starting shape
 * @param end - The ending shape
 * @param samplesPerCubic - Points to sample per cubic segment (default 4)
 * @returns A tuple of [startPolygon, endPolygon] CSS `polygon()` strings
 */
export function toMorphPair(
  start: RoundedPolygon,
  end: RoundedPolygon,
  samplesPerCubic = 4
): [string, string] {
  const morph = new Morph(start, end);
  return [
    toClipPathPolygon(morph.asCubics(0), samplesPerCubic),
    toClipPathPolygon(morph.asCubics(1), samplesPerCubic),
  ];
}
