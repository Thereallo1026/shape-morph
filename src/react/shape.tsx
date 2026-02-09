import { useMemo } from "react";
import { getShape, type ShapeName } from "../core/material-shapes";
import { toPathD } from "../output/svg-path";

interface ShapeProps {
  /** Material shape name, e.g. "Heart", "Circle" */
  name: ShapeName;
  /** Size in px (width & height). Default 48 */
  size?: number;
  /** Fill color. Default "currentColor" */
  fill?: string;
  /** Stroke color */
  stroke?: string;
  /** Stroke width */
  strokeWidth?: number;
  /** Additional className for the SVG element */
  className?: string;
  /** Additional inline styles for the SVG element */
  style?: React.CSSProperties;
}

/**
 * Renders a Material shape as an inline SVG element.
 *
 * The SVG inherits `currentColor` by default, so it responds to
 * the parent's `color` CSS property — including Tailwind utilities.
 *
 * ```tsx
 * <Shape name="Heart" size={32} className="text-red-500" />
 * ```
 */
export function Shape({
  name,
  size = 48,
  fill = "currentColor",
  stroke,
  strokeWidth,
  className,
  style,
}: ShapeProps) {
  const viewBoxSize = 100;
  const d = useMemo(() => {
    const shape = getShape(name);
    return toPathD(shape.cubics, viewBoxSize);
  }, [name]);

  return (
    <svg
      aria-hidden="true"
      className={className}
      height={size}
      style={style}
      viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
      width={size}
    >
      <path d={d} fill={fill} stroke={stroke} strokeWidth={strokeWidth} />
    </svg>
  );
}
