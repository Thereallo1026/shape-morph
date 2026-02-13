import { describe, expect, test } from "bun:test";
import {
  easeIn,
  easeInOut,
  easeInOutCubic,
  easeOut,
  linear,
} from "../src/easing";

describe("linear", () => {
  test("returns 0 at start", () => {
    expect(linear(0)).toBe(0);
  });

  test("returns 1 at end", () => {
    expect(linear(1)).toBe(1);
  });

  test("returns input unchanged", () => {
    expect(linear(0.25)).toBe(0.25);
    expect(linear(0.5)).toBe(0.5);
    expect(linear(0.75)).toBe(0.75);
  });
});

describe("easeIn", () => {
  test("returns 0 at start", () => {
    expect(easeIn(0)).toBe(0);
  });

  test("returns 1 at end", () => {
    expect(easeIn(1)).toBe(1);
  });

  test("is slower at the start (below linear)", () => {
    expect(easeIn(0.5)).toBeLessThan(0.5);
  });
});

describe("easeOut", () => {
  test("returns 0 at start", () => {
    expect(easeOut(0)).toBe(0);
  });

  test("returns 1 at end", () => {
    expect(easeOut(1)).toBe(1);
  });

  test("is faster at the start (above linear)", () => {
    expect(easeOut(0.5)).toBeGreaterThan(0.5);
  });
});

describe("easeInOut", () => {
  test("returns 0 at start", () => {
    expect(easeInOut(0)).toBe(0);
  });

  test("returns 1 at end", () => {
    expect(easeInOut(1)).toBe(1);
  });

  test("returns 0.5 at midpoint", () => {
    expect(easeInOut(0.5)).toBe(0.5);
  });

  test("is symmetric around midpoint", () => {
    expect(easeInOut(0.25) + easeInOut(0.75)).toBeCloseTo(1, 10);
  });

  test("is below linear in first half", () => {
    expect(easeInOut(0.25)).toBeLessThan(0.25);
  });

  test("is above linear in second half", () => {
    expect(easeInOut(0.75)).toBeGreaterThan(0.75);
  });
});

describe("easeInOutCubic", () => {
  test("returns 0 at start", () => {
    expect(easeInOutCubic(0)).toBe(0);
  });

  test("returns 1 at end", () => {
    expect(easeInOutCubic(1)).toBe(1);
  });

  test("returns 0.5 at midpoint", () => {
    expect(easeInOutCubic(0.5)).toBe(0.5);
  });

  test("is symmetric around midpoint", () => {
    expect(easeInOutCubic(0.25) + easeInOutCubic(0.75)).toBeCloseTo(1, 10);
  });

  test("is more pronounced than quadratic easeInOut", () => {
    // cubic should be further from 0.5 at quarter points
    expect(easeInOutCubic(0.25)).toBeLessThan(easeInOut(0.25));
    expect(easeInOutCubic(0.75)).toBeGreaterThan(easeInOut(0.75));
  });
});

describe("all easing functions are monotonic", () => {
  const fns = [
    ["linear", linear],
    ["easeIn", easeIn],
    ["easeOut", easeOut],
    ["easeInOut", easeInOut],
    ["easeInOutCubic", easeInOutCubic],
  ] as const;

  for (const [name, fn] of fns) {
    test(`${name} is monotonically increasing`, () => {
      let prev = fn(0);
      for (let i = 1; i <= 100; i++) {
        const current = fn(i / 100);
        expect(current).toBeGreaterThanOrEqual(prev);
        prev = current;
      }
    });
  }
});
