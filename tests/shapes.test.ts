import { describe, expect, test } from "bun:test";
import { getShape, shapeNames } from "../src/core/material-shapes";

describe("shapeNames", () => {
  test("contains 35 shapes", () => {
    expect(shapeNames).toHaveLength(35);
  });

  test("includes known shapes", () => {
    expect(shapeNames).toContain("Circle");
    expect(shapeNames).toContain("Heart");
    expect(shapeNames).toContain("Square");
  });

  test("contains no duplicates", () => {
    const unique = new Set(shapeNames);
    expect(unique.size).toBe(shapeNames.length);
  });
});

describe("getShape", () => {
  test("returns a RoundedPolygon for every shape name", () => {
    for (const name of shapeNames) {
      const shape = getShape(name);
      expect(shape).toBeDefined();
      expect(shape.cubics).toBeDefined();
      expect(shape.cubics.length).toBeGreaterThan(0);
    }
  });

  test("shapes have valid center coordinates", () => {
    for (const name of shapeNames) {
      const shape = getShape(name);
      expect(typeof shape.centerX).toBe("number");
      expect(typeof shape.centerY).toBe("number");
      expect(Number.isFinite(shape.centerX)).toBe(true);
      expect(Number.isFinite(shape.centerY)).toBe(true);
    }
  });

  test("shapes have features", () => {
    for (const name of shapeNames) {
      const shape = getShape(name);
      expect(shape.features.length).toBeGreaterThan(0);
    }
  });
});
