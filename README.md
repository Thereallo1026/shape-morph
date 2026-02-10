# shape-morph

Material Design 3 shape morphing for the web. Port of Android's `androidx.graphics.shapes` to TypeScript.

35 preset shapes, feature-matched morphing, SVG paths, CSS `clip-path`, and React components.

## Documentation

Full docs, guides, and API reference at **[shape-morph.thereallo.dev](https://shape-morph.thereallo.dev)**.

## Quick start

```bash
bun install shape-morph
# or any other package manager
```

```tsx
import { useMorph } from "shape-morph/react";

const { clipPath } = useMorph("Circle", "Heart", {
  progress: hovered ? 1 : 0,
  duration: 300,
});
```

## Contributing

```bash
# Install dependencies
bun install

# Build
bun run build

# Run demo
bun run dev:demo

# Lint
bunx ultracite check

# Format
bunx ultracite fix
```

### Docs site

The documentation site lives in `docs/` and is a standalone Next.js app powered by [Fumadocs](https://fumadocs.dev).

```bash
cd docs
bun install
bun run dev
```

## License

MIT
