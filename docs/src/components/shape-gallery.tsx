"use client";

import { useEffect, useState } from "react";
import { shapeNames } from "shape-morph";
import { Shape } from "shape-morph/react";

export function ShapeGallery() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
        {shapeNames.map((name) => (
          <div
            className="flex flex-col items-center gap-2 rounded-xl border border-fd-border bg-fd-card p-3"
            key={name}
          >
            <div className="size-12 animate-pulse rounded-lg bg-fd-muted" />
            <span className="text-fd-muted-foreground text-xs">{name}</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
      {shapeNames.map((name) => (
        <div
          className="flex flex-col items-center gap-2 rounded-xl border border-fd-border bg-fd-card p-3"
          key={name}
        >
          <Shape className="text-fd-primary" name={name} size={48} />
          <span className="text-fd-muted-foreground text-xs">{name}</span>
        </div>
      ))}
    </div>
  );
}
