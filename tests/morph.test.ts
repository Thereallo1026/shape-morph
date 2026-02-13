import { describe, expect, test } from "bun:test";
import { getShape, shapeNames } from "../src/core/material-shapes";
import { Morph } from "../src/core/morph";

describe("Morph", () => {
  test("creates a morph between two shapes", () => {
    const morph = new Morph(getShape("Circle"), getShape("Heart"));
    expect(morph).toBeDefined();
  });

  test("asCubics returns cubics at progress 0", () => {
    const morph = new Morph(getShape("Circle"), getShape("Heart"));
    const cubics = morph.asCubics(0);
    expect(cubics.length).toBeGreaterThan(0);
  });

  test("asCubics returns cubics at progress 1", () => {
    const morph = new Morph(getShape("Circle"), getShape("Heart"));
    const cubics = morph.asCubics(1);
    expect(cubics.length).toBeGreaterThan(0);
  });

  test("asCubics returns cubics at progress 0.5", () => {
    const morph = new Morph(getShape("Circle"), getShape("Heart"));
    const cubics = morph.asCubics(0.5);
    expect(cubics.length).toBeGreaterThan(0);
  });

  test("progress 0 and 1 produce different cubics", () => {
    const morph = new Morph(getShape("Circle"), getShape("Heart"));
    const start = morph.asCubics(0);
    const end = morph.asCubics(1);

    // At least one point should differ
    let hasDifference = false;
    for (let i = 0; i < start.length; i++) {
      if (
        Math.abs(start[i].anchor0X - end[i].anchor0X) > 0.001 ||
        Math.abs(start[i].anchor0Y - end[i].anchor0Y) > 0.001
      ) {
        hasDifference = true;
        break;
      }
    }
    expect(hasDifference).toBe(true);
  });

  test("same shape at 0 and 1 produces identical cubics", () => {
    const morph = new Morph(getShape("Circle"), getShape("Circle"));
    const start = morph.asCubics(0);
    const end = morph.asCubics(1);

    for (let i = 0; i < start.length; i++) {
      expect(start[i].anchor0X).toBeCloseTo(end[i].anchor0X, 5);
      expect(start[i].anchor0Y).toBeCloseTo(end[i].anchor0Y, 5);
    }
  });

  test("cubics count is consistent across progress values", () => {
    const morph = new Morph(getShape("Circle"), getShape("Heart"));
    const count0 = morph.asCubics(0).length;
    const count05 = morph.asCubics(0.5).length;
    const count1 = morph.asCubics(1).length;

    expect(count0).toBe(count05);
    expect(count05).toBe(count1);
  });

  test("works with all shape pairs", () => {
    // just a sample pair
    // should be able to confirm there's no crashes
    const sample = shapeNames.slice(0, 5);
    for (const a of sample) {
      for (const b of sample) {
        const morph = new Morph(getShape(a), getShape(b));
        const cubics = morph.asCubics(0.5);
        expect(cubics.length).toBeGreaterThan(0);
      }
    }
  });
});
