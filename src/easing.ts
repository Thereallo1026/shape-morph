export const linear = (t: number): number => t;
export const easeIn = (t: number): number => t * t;
export const easeOut = (t: number): number => 1 - (1 - t) ** 2;
export const easeInOut = (t: number): number =>
  t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2;
export const easeInOutCubic = (t: number): number =>
  t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
