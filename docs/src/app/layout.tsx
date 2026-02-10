import { RootProvider } from "fumadocs-ui/provider/next";
import "./global.css";
import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import { Google_Sans } from "next/font/google";

const googleSans = Google_Sans({
  subsets: ["latin"],
  adjustFontFallback: false,
});

export const metadata: Metadata = {
  title: {
    default: "shape-morph",
    template: "%s | shape-morph",
  },
  description:
    "Android's shape morphing system, rebuilt in TypeScript. SVG paths, CSS clip-paths, and React components.",
  other: {
    "theme-color": "#7251A4",
  },
};

export default function Layout({ children }: LayoutProps<"/">) {
  return (
    <html className={googleSans.className} lang="en" suppressHydrationWarning>
      <body className="flex min-h-screen flex-col">
        <RootProvider>{children}</RootProvider>
        <Analytics />
      </body>
    </html>
  );
}
