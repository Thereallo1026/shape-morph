"use client";

import { useEffect, useRef, useState } from "react";
import { easeInOutCubic } from "shape-morph";
import { useMorph } from "shape-morph/react";

const morphDuration = 2000;
const pauseDuration = 1200;

export function MorphBackground() {
  const [target, setTarget] = useState(0);
  const cycleRef = useRef(0);
  const pauseRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const { clipPath, progress } = useMorph("Clover8Leaf", "Clover4Leaf", {
    progress: target,
    duration: morphDuration,
    easing: easeInOutCubic,
    samples: 6,
  });

  const isForward = cycleRef.current % 2 === 0;
  const fraction = isForward ? progress : 1 - progress;
  const rotation = cycleRef.current * 90 + fraction * 90;

  useEffect(() => {
    pauseRef.current = setTimeout(() => {
      setTarget(1);
    }, pauseDuration);
    return () => clearTimeout(pauseRef.current);
  }, []);

  useEffect(() => {
    if (Math.abs(progress - target) > 0.01) {
      return;
    }
    if (target === 0 && cycleRef.current === 0) {
      return;
    }

    pauseRef.current = setTimeout(() => {
      cycleRef.current += 1;
      setTarget(target === 1 ? 0 : 1);
    }, pauseDuration);

    return () => clearTimeout(pauseRef.current);
  }, [progress, target]);

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
