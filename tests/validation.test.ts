import { describe, expect, test } from "bun:test";
import type { AnimatedMorphFrame } from "../src/animated-morph";

// can't test useMorph directly (React hook), but we can test
// AnimatedMorph validation since it uses the same logic

// AnimatedMorph requires requestAnimationFrame (browser API),
// so we mock it for validation-only tests

const originalRAF = globalThis.requestAnimationFrame;
const originalCAF = globalThis.cancelAnimationFrame;

globalThis.requestAnimationFrame = (_cb: FrameRequestCallback) => 0;
globalThis.cancelAnimationFrame = (_id: number) => {
  // no-op
};

const { AnimatedMorph } = await import("../src/animated-morph");

describe("AnimatedMorph validation", () => {
  const noop = () => {
    // no-op
  };

  test("accepts duration mode", () => {
    expect(() => {
      new AnimatedMorph("Circle", "Heart", {
        duration: 300,
        onFrame: noop,
      });
    }).not.toThrow();
  });

  test("accepts lerp mode", () => {
    expect(() => {
      new AnimatedMorph("Circle", "Heart", {
        lerp: 0.1,
        onFrame: noop,
      });
    }).not.toThrow();
  });

  test("accepts spring mode", () => {
    expect(() => {
      new AnimatedMorph("Circle", "Heart", {
        spring: { stiffness: 180, damping: 12 },
        onFrame: noop,
      });
    }).not.toThrow();
  });

  test("accepts no mode (defaults to duration)", () => {
    expect(() => {
      new AnimatedMorph("Circle", "Heart", {
        onFrame: noop,
      });
    }).not.toThrow();
  });

  test("throws when combining duration and lerp", () => {
    expect(() => {
      new AnimatedMorph("Circle", "Heart", {
        duration: 300,
        lerp: 0.1,
        onFrame: noop,
      });
    }).toThrow("Cannot combine animation modes");
  });

  test("throws when combining easing and lerp", () => {
    expect(() => {
      new AnimatedMorph("Circle", "Heart", {
        easing: (t) => t,
        lerp: 0.1,
        onFrame: noop,
      });
    }).toThrow("Cannot combine animation modes");
  });

  test("throws when combining duration and spring", () => {
    expect(() => {
      new AnimatedMorph("Circle", "Heart", {
        duration: 300,
        spring: { stiffness: 180, damping: 12 },
        onFrame: noop,
      });
    }).toThrow("Cannot combine animation modes");
  });

  test("throws when combining lerp and spring", () => {
    expect(() => {
      new AnimatedMorph("Circle", "Heart", {
        lerp: 0.1,
        spring: { stiffness: 180, damping: 12 },
        onFrame: noop,
      });
    }).toThrow("Cannot combine animation modes");
  });

  test("throws when combining easing and spring", () => {
    expect(() => {
      new AnimatedMorph("Circle", "Heart", {
        easing: (t) => t,
        spring: { stiffness: 180, damping: 12 },
        onFrame: noop,
      });
    }).toThrow("Cannot combine animation modes");
  });
});

describe("AnimatedMorph initial frame", () => {
  test("emits initial frame at progress 0", () => {
    let frame: AnimatedMorphFrame | null = null;
    new AnimatedMorph("Circle", "Heart", {
      onFrame(f) {
        frame = f;
      },
    });
    expect(frame).not.toBeNull();
    const f = frame as unknown as AnimatedMorphFrame;
    expect(f.progress).toBe(0);
    expect(f.clipPath).toStartWith("polygon(");
    expect(f.pathD).toStartWith("M");
  });
});

describe("AnimatedMorph accepts RoundedPolygon", () => {
  test("works with polygon objects", async () => {
    const { getShape } = await import("../src/core/material-shapes");
    let called = false;
    new AnimatedMorph(getShape("Circle"), getShape("Heart"), {
      onFrame() {
        called = true;
      },
    });
    expect(called).toBe(true);
  });
});

// Restore globals
globalThis.requestAnimationFrame = originalRAF;
globalThis.cancelAnimationFrame = originalCAF;
