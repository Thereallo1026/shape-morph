import type { ShapeName } from "shape-morph";
import { Shape } from "shape-morph/react";

interface ScatteredShape {
  left: string;
  name: ShapeName;
  opacity: number;
  rotation: number;
  size: number;
  top: string;
}

const shapes: ScatteredShape[] = [
  {
    name: "Flower",
    size: 160,
    top: "-3%",
    left: "85%",
    rotation: 20,
    opacity: 0.08,
  },
  {
    name: "Cookie4Sided",
    size: 140,
    top: "68%",
    left: "10%",
    rotation: 30,
    opacity: 0.08,
  },
  {
    name: "Sunny",
    size: 120,
    top: "4%",
    left: "-3%",
    rotation: -12,
    opacity: 0.07,
  },
  {
    name: "Diamond",
    size: 100,
    top: "72%",
    left: "88%",
    rotation: 15,
    opacity: 0.09,
  },
];

export function ScatteredShapes() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {shapes.map((shape) => (
        <div
          className="absolute text-fd-primary"
          key={`${shape.name}-${shape.top}-${shape.left}`}
          style={{
            top: shape.top,
            left: shape.left,
            opacity: shape.opacity,
            transform: `rotate(${shape.rotation}deg)`,
          }}
        >
          <Shape name={shape.name} size={shape.size} />
        </div>
      ))}
    </div>
  );
}
