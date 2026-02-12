import type { Cubic } from "../core/cubic";
import type { RoundedPolygon } from "../core/polygon";

/**
 * Convert an array of Cubics to an SVG path `d` attribute string.
 *
 * Each Cubic stores four points: anchor0 (start), control0, control1,
 * anchor1 (end). These map to the SVG cubic bezier command:
 *   C control0X,control0Y control1X,control1Y anchor1X,anchor1Y
 *
 * Shapes from `getShape()` are normalized to 0-1 coordinates.
 * The `size` parameter scales them to pixel/viewBox space.
 */
export function toPathD(cubics: Cubic[], size = 100): string {
  if (cubics.length === 0) {
    return "";
  }

  const s = size;
  const parts: string[] = [
    `M${(cubics[0].anchor0X * s).toFixed(2)},${(cubics[0].anchor0Y * s).toFixed(2)}`,
  ];

  for (const c of cubics) {
    parts.push(
      `C${(c.control0X * s).toFixed(2)},${(c.control0Y * s).toFixed(2)} ${(c.control1X * s).toFixed(2)},${(c.control1Y * s).toFixed(2)} ${(c.anchor1X * s).toFixed(2)},${(c.anchor1Y * s).toFixed(2)}`
    );
  }

  parts.push("Z");
  return parts.join("");
}

/**
 * Convert a RoundedPolygon to an SVG path `d` attribute string.
 */
export function toSvgPath(polygon: RoundedPolygon, size = 100): string {
  return toPathD(polygon.cubics, size);
}
