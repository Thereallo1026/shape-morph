"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useMorph } from "shape-morph/react";

export function LerpIcon() {
  const [hovered, setHovered] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const { progress } = useMorph("Circle", "Circle", {
    progress: hovered ? 1 : 0,
    lerp: 0.1,
  });

  useEffect(() => {
    const el = ref.current;
    if (!el) {
      return;
    }
    const onEnter = () => setHovered(true);
    const onLeave = () => setHovered(false);
    el.addEventListener("mouseenter", onEnter);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mouseenter", onEnter);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <span className="inline-flex items-center gap-2" ref={ref}>
      <Image
        alt=""
        height={20}
        src="/icon.svg"
        style={{ transform: `rotate(${progress * 90}deg)` }}
        width={20}
      />
      shape-morph
    </span>
  );
}
