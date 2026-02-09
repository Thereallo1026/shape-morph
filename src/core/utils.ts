// Ported from AOSP androidx.graphics.shapes

export const distanceEpsilon = 1e-4;
export const angleEpsilon = 1e-6;
export const relaxedDistanceEpsilon = 5e-3;
export const floatPi = Math.PI;
export const twoPi = 2 * Math.PI;

export interface Point {
  x: number;
  y: number;
}

export function pt(x: number, y: number): Point {
  return { x, y };
}

export function ptDistance(p: Point): number {
  return Math.sqrt(p.x * p.x + p.y * p.y);
}

export function ptDistanceSquared(p: Point): number {
  return p.x * p.x + p.y * p.y;
}

export function ptDirection(p: Point): Point {
  const d = ptDistance(p);
  return { x: p.x / d, y: p.y / d };
}

export function ptDot(a: Point, b: Point): number {
  return a.x * b.x + a.y * b.y;
}

export function ptClockwise(a: Point, b: Point): boolean {
  return a.x * b.y - a.y * b.x > 0;
}

export function ptRotate90(p: Point): Point {
  return { x: -p.y, y: p.x };
}

export function ptSub(a: Point, b: Point): Point {
  return { x: a.x - b.x, y: a.y - b.y };
}

export function ptAdd(a: Point, b: Point): Point {
  return { x: a.x + b.x, y: a.y + b.y };
}

export function ptMul(p: Point, s: number): Point {
  return { x: p.x * s, y: p.y * s };
}

export function ptDiv(p: Point, s: number): Point {
  return { x: p.x / s, y: p.y / s };
}

export function distance(x: number, y: number): number {
  return Math.sqrt(x * x + y * y);
}

export function distanceSquared(x: number, y: number): number {
  return x * x + y * y;
}

export function directionVector(x: number, y: number): Point {
  const d = distance(x, y);
  return { x: x / d, y: y / d };
}

export function directionVectorAngle(angleRadians: number): Point {
  return { x: Math.cos(angleRadians), y: Math.sin(angleRadians) };
}

export function radialToCartesian(
  radius: number,
  angleRadians: number,
  center: Point = { x: 0, y: 0 }
): Point {
  const d = directionVectorAngle(angleRadians);
  return { x: d.x * radius + center.x, y: d.y * radius + center.y };
}

export function interpolate(
  start: number,
  stop: number,
  fraction: number
): number {
  return (1 - fraction) * start + fraction * stop;
}

export function interpolatePoint(
  start: Point,
  stop: Point,
  fraction: number
): Point {
  return {
    x: interpolate(start.x, stop.x, fraction),
    y: interpolate(start.y, stop.y, fraction),
  };
}

export function positiveModulo(num: number, mod: number): number {
  return ((num % mod) + mod) % mod;
}

export function collinearIsh(
  aX: number,
  aY: number,
  bX: number,
  bY: number,
  cX: number,
  cY: number,
  tolerance: number = distanceEpsilon
): boolean {
  const ab = ptRotate90({ x: bX - aX, y: bY - aY });
  const ac: Point = { x: cX - aX, y: cY - aY };
  const dotProduct = Math.abs(ptDot(ab, ac));
  const relativeTolerance = tolerance * ptDistance(ab) * ptDistance(ac);
  return dotProduct < tolerance || dotProduct < relativeTolerance;
}

export function convex(previous: Point, current: Point, next: Point): boolean {
  return ptClockwise(ptSub(current, previous), ptSub(next, current));
}

export function square(x: number): number {
  return x * x;
}

export function findMinimum(
  v0: number,
  v1: number,
  tolerance: number,
  f: (value: number) => number
): number {
  let a = v0;
  let b = v1;
  while (b - a > tolerance) {
    const c1 = (2 * a + b) / 3;
    const c2 = (2 * b + a) / 3;
    if (f(c1) < f(c2)) {
      b = c2;
    } else {
      a = c1;
    }
  }
  return (a + b) / 2;
}
