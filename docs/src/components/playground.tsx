"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  getShape,
  Morph,
  type ShapeName,
  shapeNames,
  toPathD,
} from "shape-morph";
import { Shape } from "shape-morph/react";

const previewSize = 240;

function ShapeGrid({
  label,
  selected,
  onSelect,
}: {
  label: string;
  selected: ShapeName;
  onSelect: (name: ShapeName) => void;
}) {
  return (
    <div>
      <h3 className="mb-3 font-semibold text-fd-foreground text-sm">{label}</h3>
      <div className="grid grid-cols-4 gap-2 sm:grid-cols-5 lg:grid-cols-6">
        {shapeNames.map((name) => (
          <button
            className={`flex flex-col items-center gap-1.5 rounded-xl p-2 transition-colors ${
              selected === name
                ? "bg-fd-primary/15 ring-2 ring-fd-primary"
                : "hover:bg-fd-accent"
            }`}
            key={name}
            onClick={() => onSelect(name)}
            title={name}
            type="button"
          >
            <Shape
              className={
                selected === name
                  ? "text-fd-primary"
                  : "text-fd-muted-foreground"
              }
              name={name}
              size={32}
            />
            <span className="text-center text-[11px] text-fd-muted-foreground leading-tight">
              {name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

export function Playground() {
  const [startShape, setStartShape] = useState<ShapeName>("Circle");
  const [endShape, setEndShape] = useState<ShapeName>("Heart");
  const [progress, setProgress] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [duration, setDuration] = useState(1500);
  const [loop, setLoop] = useState(true);
  const animRef = useRef(0);
  const loopRef = useRef(loop);

  const morph = useMemo(
    () => new Morph(getShape(startShape), getShape(endShape)),
    [startShape, endShape]
  );

  const pathD = useMemo(
    () => toPathD(morph.asCubics(progress), previewSize),
    [morph, progress]
  );

  useEffect(() => {
    loopRef.current = loop;
  }, [loop]);

  useEffect(() => {
    setMounted(true);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  const stopAnimation = useCallback(() => {
    cancelAnimationFrame(animRef.current);
    setAnimating(false);
  }, []);

  const startAnimation = useCallback(() => {
    setAnimating(true);
    let startTime: number | null = null;

    const step = (timestamp: number) => {
      if (!startTime) {
        startTime = timestamp;
      }
      const elapsed = timestamp - startTime;

      if (loopRef.current) {
        const cycle = (elapsed % (duration * 2)) / duration;
        const p = cycle <= 1 ? cycle : 2 - cycle;
        setProgress(p);
      } else {
        const p = Math.min(elapsed / duration, 1);
        setProgress(p);
        if (p >= 1) {
          setAnimating(false);
          return;
        }
      }

      animRef.current = requestAnimationFrame(step);
    };

    animRef.current = requestAnimationFrame(step);
  }, [duration]);

  const toggleAnimate = () => {
    if (animating) {
      stopAnimation();
    } else {
      startAnimation();
    }
  };

  const handleSwap = () => {
    const prev = startShape;
    setStartShape(endShape);
    setEndShape(prev);
    setProgress(1 - progress);
  };

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
      <div className="flex flex-col items-center gap-6 rounded-2xl border border-fd-border bg-fd-card p-6 sm:p-8">
        <div
          className="flex items-center justify-center"
          style={{ width: previewSize, height: previewSize }}
        >
          {mounted ? (
            <svg
              aria-label={`Morph from ${startShape} to ${endShape}`}
              height={previewSize}
              viewBox={`0 0 ${previewSize} ${previewSize}`}
              width={previewSize}
            >
              <title>
                Morph from {startShape} to {endShape}
              </title>
              <path className="text-fd-primary" d={pathD} fill="currentColor" />
            </svg>
          ) : (
            <div className="size-16 animate-pulse rounded-full bg-fd-muted" />
          )}
        </div>

        <div className="flex w-full max-w-sm flex-col gap-3">
          <label className="flex items-center gap-3">
            <span className="w-16 text-fd-muted-foreground text-xs">
              {Math.round(progress * 100)}%
            </span>
            <input
              className="h-2 flex-1 cursor-pointer appearance-none rounded-full bg-fd-muted accent-fd-primary"
              max={1}
              min={0}
              onChange={(e) => {
                if (animating) {
                  stopAnimation();
                }
                setProgress(Number(e.target.value));
              }}
              step={0.005}
              type="range"
              value={progress}
            />
          </label>

          <label className="flex items-center gap-3">
            <span className="w-16 text-fd-muted-foreground text-xs">
              {duration}ms
            </span>
            <input
              className="h-2 flex-1 cursor-pointer appearance-none rounded-full bg-fd-muted accent-fd-primary"
              max={5000}
              min={200}
              onChange={(e) => {
                const next = Number(e.target.value);
                setDuration(next);
                if (animating) {
                  stopAnimation();
                  setAnimating(false);
                }
              }}
              step={100}
              type="range"
              value={duration}
            />
          </label>

          <div className="flex justify-center gap-2">
            <button
              className="rounded-full bg-fd-primary px-5 py-2 font-medium text-fd-primary-foreground text-sm transition-colors hover:bg-fd-primary/90"
              onClick={toggleAnimate}
              type="button"
            >
              {animating ? "Stop" : "Animate"}
            </button>
            <button
              className="rounded-full border border-fd-border px-5 py-2 font-medium text-fd-foreground text-sm transition-colors hover:bg-fd-accent"
              onClick={handleSwap}
              type="button"
            >
              Swap
            </button>
            <button
              className={`rounded-full border px-5 py-2 font-medium text-sm transition-colors ${
                loop
                  ? "border-fd-primary bg-fd-primary/15 text-fd-primary hover:bg-fd-primary/25"
                  : "border-fd-border text-fd-foreground hover:bg-fd-accent"
              }`}
              onClick={() => setLoop((prev) => !prev)}
              type="button"
            >
              Loop
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="rounded-2xl border border-fd-border bg-fd-card px-4 sm:px-6">
          {mounted ? (
            <ShapeGrid
              label="Start Shape"
              onSelect={(name) => {
                setStartShape(name);
                if (animating) {
                  stopAnimation();
                }
              }}
              selected={startShape}
            />
          ) : (
            <div className="h-64 animate-pulse rounded-lg bg-fd-muted" />
          )}
        </div>
        <div className="rounded-2xl border border-fd-border bg-fd-card pb-4 sm:px-6">
          {mounted ? (
            <ShapeGrid
              label="End Shape"
              onSelect={(name) => {
                setEndShape(name);
                if (animating) {
                  stopAnimation();
                }
              }}
              selected={endShape}
            />
          ) : (
            <div className="h-64 animate-pulse rounded-lg bg-fd-muted" />
          )}
        </div>
      </div>
    </div>
  );
}
