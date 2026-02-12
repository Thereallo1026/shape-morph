"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef } from "react";

export function LerpIcon() {
  const hoveredRef = useRef(false);
  const rotationRef = useRef(0);
  const frameRef = useRef<number>(0);
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLSpanElement>(null);

  const animate = useCallback(() => {
    const target = hoveredRef.current ? 90 : 0;
    const current = rotationRef.current;
    const next = current + (target - current) * 0.1;

    if (Math.abs(target - next) < 0.1) {
      rotationRef.current = target;
      if (imgRef.current) {
        imgRef.current.style.transform = `rotate(${target}deg)`;
      }
      return;
    }

    rotationRef.current = next;
    if (imgRef.current) {
      imgRef.current.style.transform = `rotate(${next}deg)`;
    }
    frameRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) {
      return;
    }

    const onEnter = () => {
      hoveredRef.current = true;
      frameRef.current = requestAnimationFrame(animate);
    };
    const onLeave = () => {
      hoveredRef.current = false;
      frameRef.current = requestAnimationFrame(animate);
    };

    el.addEventListener("mouseenter", onEnter);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mouseenter", onEnter);
      el.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(frameRef.current);
    };
  }, [animate]);

  return (
    <span className="inline-flex items-center gap-2" ref={containerRef}>
      <Image alt="" height={20} ref={imgRef} src="/icon.svg" width={20} />
      shape-morph
    </span>
  );
}
