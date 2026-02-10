"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getShape, Morph, toClipPathPolygon } from "shape-morph";

const morphDuration = 2000;
const pauseDuration = 1200;
const samplesPerCubic = 6;

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
}

export function MorphBackground() {
  const morph = useMemo(
    () => new Morph(getShape("Clover8Leaf"), getShape("Clover4Leaf")),
    []
  );

  const [clipPath, setClipPath] = useState(() =>
    toClipPathPolygon(morph.asCubics(0), samplesPerCubic)
  );
  const [rotation, setRotation] = useState(0);

  const progressRef = useRef(0);
  const rotationRef = useRef(0);
  const directionRef = useRef<1 | -1>(1);
  const animRef = useRef(0);

  const animateCycle = useCallback(() => {
    const fromProgress = directionRef.current === 1 ? 0 : 1;
    const toProgress = directionRef.current === 1 ? 1 : 0;
    const fromRotation = rotationRef.current;
    const toRotation = fromRotation + 90;

    let startTime: number | null = null;

    const step = (timestamp: number) => {
      if (!startTime) {
        startTime = timestamp;
      }
      const elapsed = timestamp - startTime;
      const rawT = Math.min(elapsed / morphDuration, 1);
      const t = easeInOutCubic(rawT);

      const currentProgress = fromProgress + (toProgress - fromProgress) * t;
      const currentRotation = fromRotation + (toRotation - fromRotation) * t;

      progressRef.current = currentProgress;
      rotationRef.current = currentRotation;

      setClipPath(
        toClipPathPolygon(morph.asCubics(currentProgress), samplesPerCubic)
      );
      setRotation(currentRotation);

      if (rawT < 1) {
        animRef.current = requestAnimationFrame(step);
      } else {
        directionRef.current = directionRef.current === 1 ? -1 : 1;
        setTimeout(() => {
          animRef.current = requestAnimationFrame(() => animateCycle());
        }, pauseDuration);
      }
    };

    animRef.current = requestAnimationFrame(step);
  }, [morph]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      animateCycle();
    }, pauseDuration);

    return () => {
      clearTimeout(timeout);
      cancelAnimationFrame(animRef.current);
    };
  }, [animateCycle]);

  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
      <div
        className="h-[min(80vw,80vh)] w-[min(80vw,80vh)] bg-fd-primary/10"
        style={{
          clipPath,
          transform: `rotate(${rotation}deg)`,
          willChange: "clip-path, transform",
        }}
      />
    </div>
  );
}
