import { Icon } from "@iconify/react";
import type { Metadata } from "next";
import Link from "next/link";
import { MorphBackground } from "@/components/morph-background";
import { ScatteredShapes } from "@/components/scattered-shapes";
import packageJson from "../../../../package.json";

export const metadata: Metadata = {
  openGraph: {
    title: "shape-morph",
    description:
      "Android's shape morphing system, rebuilt in TypeScript. SVG paths, CSS clip-paths, and React components.",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "shape-morph",
    description:
      "Android's shape morphing system, rebuilt in TypeScript. SVG paths, CSS clip-paths, and React components.",
    images: ["/og.png"],
  },
};

export default function HomePage() {
  const version = packageJson.version;
  return (
    <main className="absolute inset-0 flex flex-1 flex-col items-center justify-center px-6 py-24">
      <MorphBackground />
      <ScatteredShapes />
      <div className="relative flex max-w-2xl flex-col items-center text-center">
        <div className="mb-6 rounded-full bg-fd-primary/10 px-4 py-1.5 font-medium text-fd-primary text-sm backdrop-blur-sm">
          Release {version}
        </div>

        <h1 className="mb-4 font-bold text-5xl text-fd-foreground tracking-tight sm:text-6xl">
          shape-morph
        </h1>

        <p className="mb-8 max-w-lg text-fd-muted-foreground text-lg">
          Android&apos;s shape morphing system, rebuilt in TypeScript. 35
          shapes, feature-matched morphing, SVG paths, CSS clip-paths, and React
          components.
        </p>

        <div className="flex gap-3">
          <Link
            className="rounded-full bg-fd-primary px-6 py-2.5 font-medium text-fd-primary-foreground text-sm transition-colors hover:bg-fd-primary/90"
            href="/docs"
          >
            Documentation
          </Link>
          <a
            className="flex items-center gap-2 rounded-full border border-fd-border px-6 py-2.5 font-medium text-fd-foreground text-sm transition-colors hover:bg-fd-accent"
            href="https://github.com/Thereallo1026/shape-morph"
            rel="noopener noreferrer"
            target="_blank"
          >
            <Icon className="size-4" icon="mdi:github" />
            GitHub
          </a>
        </div>
      </div>
    </main>
  );
}
