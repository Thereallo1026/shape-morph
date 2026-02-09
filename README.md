# shape-morph

Material Design 3 shape morphing for the web. Port of Android's `androidx.graphics.shapes` and `MaterialShapes` to TypeScript.

Shapes are defined as cubic Bezier curves and morphed via feature-matched interpolation. Outputs to SVG paths, CSS `clip-path`, or React components.

## Install

```bash
bun add shape-morph
```

### Local Testing

To test locally in another project before publishing:

```bash
# In this repo
bun link

# In your other project
bun link shape-morph
```

## Usage

### SVG Path

```ts
import { getShape, Morph, toPathD } from "shape-morph";

const start = getShape("Circle");
const end = getShape("Heart");
const morph = new Morph(start, end);

// progress: 0 = start shape, 1 = end shape
const d = toPathD(morph.asCubics(0.5), 100);
```

### CSS Clip-Path

```ts
import { toMorphPair } from "shape-morph";

const clipPath = toMorphPair(0.5, "Circle", "Heart");
```

### React

```tsx
import { Shape } from "shape-morph/react";

<Shape name="Heart" size={32} fill="red" />
```

#### useMorph

Animates between two shapes.

```tsx
import { useMorph } from "shape-morph/react";

function Avatar({ hovered }: { hovered: boolean }) {
  const { clipPath } = useMorph("Circle", "Heart", {
    progress: hovered ? 1 : 0,
    duration: 300,
  });

  return <img style={{ clipPath }} src="/avatar.png" />;
}
```

Returns `{ pathD, clipPath, progress }`.

#### useShape

Returns path data for a single shape.

```tsx
import { useShape } from "shape-morph/react";

const { pathD, clipPath } = useShape("Heart");
```

## Custom Polygons

```ts
import { createStar, createRectangle, cornerRounding, Morph, toPathD } from "shape-morph";

const star = createStar(5, 1, 0.5, cornerRounding(0.1));
const rect = createRectangle(1, 1, cornerRounding(0.2));
const morph = new Morph(star.normalized(), rect.normalized());

const d = toPathD(morph.asCubics(0.5), 200);
```

## Available Shapes

Circle, Square, Slanted, Arch, Fan, Arrow, SemiCircle, Oval, Pill, Triangle, Diamond, ClamShell, Pentagon, Gem, Sunny, VerySunny, Cookie4Sided, Cookie6Sided, Cookie7Sided, Cookie9Sided, Cookie12Sided, Ghostish, Clover4Leaf, Clover8Leaf, Burst, SoftBurst, Boom, SoftBoom, Flower, Puffy, PuffyDiamond, PixelCircle, PixelTriangle, Bun, Heart

## API

### Core

| Export | Description |
|---|---|
| `Morph(start, end)` | Morph between two `RoundedPolygon` shapes |
| `morph.asCubics(progress)` | Get interpolated `Cubic[]` at progress 0–1 |
| `getShape(name)` | Get a Material shape as `RoundedPolygon` |
| `shapeNames` | Array of all shape names |

### Polygon Builders

| Export | Description |
|---|---|
| `createCircle(vertices?)` | Circle approximation |
| `createRectangle(w, h, rounding?)` | Rectangle with optional rounding |
| `createStar(points, outer, inner, rounding)` | Star polygon |
| `createPolygon(vertices, rounding)` | Regular polygon |
| `cornerRounding(radius, smoothing?)` | Corner rounding config |

### Output

| Export | Description |
|---|---|
| `toPathD(cubics, size?)` | Cubics to SVG path `d` attribute |
| `toSvgPath(polygon, size?)` | Polygon to SVG path `d` attribute |
| `toClipPathPolygon(cubics, samples?)` | Cubics to CSS `clip-path: polygon(...)` |
| `toClipPathPath(cubics, samples?)` | Cubics to CSS `clip-path: path(...)` |
| `toMorphPair(progress, start, end, samples?)` | Morph to CSS clip-path string |

### React (`shape-morph/react`)

| Export | Description |
|---|---|
| `<Shape name size? fill? stroke? className? style? />` | Renders shape as inline SVG |
| `useMorph(start, end, { progress, duration?, size? })` | Animated morph returning `{ pathD, clipPath, progress }` |
| `useShape(name, size?)` | Static shape returning `{ pathD, clipPath, polygon }` |

## License

MIT
