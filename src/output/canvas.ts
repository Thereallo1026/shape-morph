import type { Cubic } from "../core/cubic";
import type { RoundedPolygon } from "../core/polygon";

/**
 * Convert an array of Cubics to a browser `Path2D` object for canvas rendering.
 *
 * Shapes from `getShape()` are normalized to 0-1 coordinates.
 * The `size` parameter scales them to pixel space.
 */
export function toPath2D(cubics: Cubic[], size = 100): Path2D {
  const path = new Path2D();

  if (cubics.length === 0) {
    return path;
  }

  const s = size;
  path.moveTo(cubics[0].anchor0X * s, cubics[0].anchor0Y * s);

  for (const c of cubics) {
    path.bezierCurveTo(
      c.control0X * s,
      c.control0Y * s,
      c.control1X * s,
      c.control1Y * s,
      c.anchor1X * s,
      c.anchor1Y * s
    );
  }

  path.closePath();
  return path;
}

/**
 * Convert a RoundedPolygon to a browser `Path2D` object for canvas rendering.
 */
export function toCanvasPath(polygon: RoundedPolygon, size = 100): Path2D {
  return toPath2D(polygon.cubics, size);
}
