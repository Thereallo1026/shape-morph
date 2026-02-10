import { useMemo } from "react";
import { getShape, type ShapeName } from "../core/material-shapes";
import type { RoundedPolygon } from "../core/polygon";
import { toClipPathPolygon } from "../output/clip-path";
import { toPathD } from "../output/svg-path";

export interface ShapeOutput {
  /** SVG path `d` attribute string, scaled to `size` */
  pathD: string;
  /** CSS `clip-path: polygon(...)` value using percentages */
  clipPath: string;
  /** The underlying RoundedPolygon for advanced use */
  polygon: RoundedPolygon;
}

/**
 * React hook that returns a Material shape as both an SVG path
 * and a CSS clip-path polygon.
 *
 * ```tsx
 * const { clipPath, pathD } = useShape('Heart');
 * // Use clipPath on any element: style={{ clipPath }}
 * // Use pathD in an SVG: <path d={pathD} />
 * ```
 */
export function useShape(name: ShapeName, size = 100): ShapeOutput {
  return useMemo(() => {
    const polygon = getShape(name);
    return {
      pathD: toPathD(polygon.cubics, size),
      clipPath: toClipPathPolygon(polygon.cubics),
      polygon,
    };
  }, [name, size]);
}
