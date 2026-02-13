import { describe, expect, test } from "bun:test";

describe("shape-morph main exports", () => {
  test("exports all expected values", async () => {
    const mod = await import("../src/index");

    // core
    expect(mod.Morph).toBeDefined();
    expect(mod.Cubic).toBeDefined();
    expect(mod.RoundedPolygon).toBeDefined();
    expect(mod.getShape).toBeDefined();
    expect(mod.shapeNames).toBeDefined();

    // builders
    expect(mod.createPolygon).toBeDefined();
    expect(mod.createCircle).toBeDefined();
    expect(mod.createRectangle).toBeDefined();
    expect(mod.createStar).toBeDefined();
    expect(mod.createPolygonFromVertices).toBeDefined();
    expect(mod.cornerRounding).toBeDefined();
    expect(mod.unrounded).toBeDefined();

    // output
    expect(mod.toPathD).toBeDefined();
    expect(mod.toSvgPath).toBeDefined();
    expect(mod.toClipPathPolygon).toBeDefined();
    expect(mod.toClipPathPath).toBeDefined();
    expect(mod.toMorphPair).toBeDefined();
    expect(mod.toCanvasPath).toBeDefined();
    expect(mod.toPath2D).toBeDefined();

    // easing
    expect(mod.linear).toBeDefined();
    expect(mod.easeIn).toBeDefined();
    expect(mod.easeOut).toBeDefined();
    expect(mod.easeInOut).toBeDefined();
    expect(mod.easeInOutCubic).toBeDefined();

    // animated-morph
    expect(mod.AnimatedMorph).toBeDefined();
  });
});

describe("shape-morph/react exports", () => {
  test("exports all expected values", async () => {
    const mod = await import("../src/react/index");

    expect(mod.Shape).toBeDefined();
    expect(mod.useMorph).toBeDefined();
    expect(mod.useShape).toBeDefined();
  });
});
