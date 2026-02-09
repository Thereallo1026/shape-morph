export type { Feature } from "./core/cubic";
export { Cubic } from "./core/cubic";
export type { ShapeName } from "./core/material-shapes";
export { getShape, shapeNames } from "./core/material-shapes";
export { Morph } from "./core/morph";
export type { CornerRounding } from "./core/polygon";
export {
  cornerRounding,
  createCircle,
  createPolygon,
  createPolygonFromVertices,
  createRectangle,
  createStar,
  RoundedPolygon,
  unrounded,
} from "./core/polygon";
export type { Point } from "./core/utils";
export {
  angleEpsilon,
  distanceEpsilon,
  floatPi,
  relaxedDistanceEpsilon,
  twoPi,
} from "./core/utils";
export {
  toClipPathPath,
  toClipPathPolygon,
  toMorphPair,
} from "./output/clip-path";
export { toPathD, toSvgPath } from "./output/svg-path";
