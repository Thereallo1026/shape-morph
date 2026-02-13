import { describe, expect, test } from "bun:test";
import {
  cornerRounding,
  createCircle,
  createPolygon,
  createRectangle,
  createStar,
  unrounded,
} from "../src/core/polygon";

describe("cornerRounding", () => {
  test("creates a rounding with radius and smoothing", () => {
    const r = cornerRounding(0.5, 0.3);
    expect(r.radius).toBe(0.5);
    expect(r.smoothing).toBe(0.3);
  });

  test("defaults smoothing to 0", () => {
    const r = cornerRounding(0.5);
    expect(r.radius).toBe(0.5);
    expect(r.smoothing).toBe(0);
  });
});

describe("unrounded", () => {
  test("has radius 0", () => {
    expect(unrounded.radius).toBe(0);
  });

  test("has smoothing 0", () => {
    expect(unrounded.smoothing).toBe(0);
  });
});

describe("createPolygon", () => {
  test("creates a triangle", () => {
    const poly = createPolygon(3);
    expect(poly.cubics.length).toBeGreaterThan(0);
    expect(poly.features.length).toBeGreaterThan(0);
  });

  test("creates a hexagon", () => {
    const poly = createPolygon(6);
    expect(poly.cubics.length).toBeGreaterThan(0);
  });

  test("creates a polygon with rounding", () => {
    const poly = createPolygon(4, 1, 0, 0, cornerRounding(0.2, 0.5));
    expect(poly.cubics.length).toBeGreaterThan(0);
  });
});

describe("createCircle", () => {
  test("creates a circle", () => {
    const circle = createCircle();
    expect(circle.cubics.length).toBeGreaterThan(0);
  });

  test("has a valid center", () => {
    const circle = createCircle(8, 1, 0, 0);
    expect(circle.centerX).toBeCloseTo(0, 5);
    expect(circle.centerY).toBeCloseTo(0, 5);
  });
});

describe("createRectangle", () => {
  test("creates a rectangle", () => {
    const rect = createRectangle();
    expect(rect.cubics.length).toBeGreaterThan(0);
  });

  test("creates a rectangle with rounding", () => {
    const rect = createRectangle(2, 1, cornerRounding(0.3));
    expect(rect.cubics.length).toBeGreaterThan(0);
  });
});

describe("createStar", () => {
  test("creates a 5-pointed star", () => {
    const star = createStar(5);
    expect(star.cubics.length).toBeGreaterThan(0);
  });

  test("creates a star with inner rounding", () => {
    const star = createStar(
      5,
      1,
      0.5,
      cornerRounding(0.1),
      cornerRounding(0.05)
    );
    expect(star.cubics.length).toBeGreaterThan(0);
  });
});
