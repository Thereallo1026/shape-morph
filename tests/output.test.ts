import { describe, expect, test } from "bun:test";
import { getShape } from "../src/core/material-shapes";
import { Morph } from "../src/core/morph";
import {
  toClipPathPath,
  toClipPathPolygon,
  toMorphPair,
} from "../src/output/clip-path";
import { toPathD, toSvgPath } from "../src/output/svg-path";

const circle = getShape("Circle");
const heart = getShape("Heart");
const morph = new Morph(circle, heart);
const cubics = morph.asCubics(0.5);

describe("toPathD", () => {
  test("returns a valid SVG path string", () => {
    const d = toPathD(cubics, 100);
    expect(d).toStartWith("M");
    expect(d).toEndWith("Z");
    expect(d).toContain("C");
  });

  test("scales with size parameter", () => {
    const d100 = toPathD(cubics, 100);
    const d200 = toPathD(cubics, 200);
    expect(d100).not.toBe(d200);
    expect(d100).toStartWith("M");
    expect(d200).toStartWith("M");
  });

  test("returns empty string for empty cubics", () => {
    expect(toPathD([], 100)).toBe("");
  });

  test("default size is 100", () => {
    const dDefault = toPathD(cubics);
    const d100 = toPathD(cubics, 100);
    expect(dDefault).toBe(d100);
  });
});

describe("toSvgPath", () => {
  test("returns a valid SVG path for a polygon", () => {
    const d = toSvgPath(circle, 100);
    expect(d).toStartWith("M");
    expect(d).toEndWith("Z");
  });
});

describe("toClipPathPolygon", () => {
  test("returns a polygon() string", () => {
    const clip = toClipPathPolygon(cubics);
    expect(clip).toStartWith("polygon(");
    expect(clip).toEndWith(")");
  });

  test("contains percentage values", () => {
    const clip = toClipPathPolygon(cubics);
    expect(clip).toContain("%");
  });

  test("vertex count matches cubics * samples", () => {
    const samples = 4;
    const clip = toClipPathPolygon(cubics, samples);
    // count commas between points (points separated by commas)
    const points = clip.slice(8, -1).split(",");
    expect(points.length).toBe(cubics.length * samples);
  });

  test("returns fallback for empty cubics", () => {
    expect(toClipPathPolygon([])).toBe("polygon(0% 0%)");
  });
});

describe("toClipPathPath", () => {
  test("returns a path() string", () => {
    const clip = toClipPathPath(cubics, 100);
    expect(clip).toStartWith('path("M');
    expect(clip).toEndWith('Z")');
  });

  test("returns empty path for empty cubics", () => {
    expect(toClipPathPath([])).toBe('path("")');
  });
});

describe("toMorphPair", () => {
  test("returns a tuple of two polygon strings", () => {
    const [from, to] = toMorphPair(circle, heart);
    expect(from).toStartWith("polygon(");
    expect(to).toStartWith("polygon(");
  });

  test("both strings have the same vertex count", () => {
    const [from, to] = toMorphPair(circle, heart);
    const fromPoints = from.slice(8, -1).split(",").length;
    const toPoints = to.slice(8, -1).split(",").length;
    expect(fromPoints).toBe(toPoints);
  });

  test("start and end are different", () => {
    const [from, to] = toMorphPair(circle, heart);
    expect(from).not.toBe(to);
  });
});
