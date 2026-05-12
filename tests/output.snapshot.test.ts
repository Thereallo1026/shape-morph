import { describe, expect, test } from "bun:test";
import { getShape, shapeNames } from "../src/core/material-shapes";
import { Morph } from "../src/core/morph";
import { toClipPathPolygon } from "../src/output/clip-path";
import { toPathD, toSvgPath } from "../src/output/svg-path";

describe("snapshot: toSvgPath for every shape", () => {
  for (const name of shapeNames) {
    test(name, () => {
      expect(toSvgPath(getShape(name), 100)).toMatchSnapshot();
    });
  }
});

describe("snapshot: Morph Circle -> Heart toPathD", () => {
  const morph = new Morph(getShape("Circle"), getShape("Heart"));

  test("progress 0", () => {
    expect(toPathD(morph.asCubics(0), 100)).toMatchSnapshot();
  });

  test("progress 0.5", () => {
    expect(toPathD(morph.asCubics(0.5), 100)).toMatchSnapshot();
  });

  test("progress 1", () => {
    expect(toPathD(morph.asCubics(1), 100)).toMatchSnapshot();
  });
});

describe("snapshot: toClipPathPolygon", () => {
  test("Circle -> Heart at 0.5 with 4 samples", () => {
    const morph = new Morph(getShape("Circle"), getShape("Heart"));
    expect(toClipPathPolygon(morph.asCubics(0.5), 4)).toMatchSnapshot();
  });
});
