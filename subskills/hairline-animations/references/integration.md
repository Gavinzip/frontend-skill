# API and integration

Pinned source: `@lucasmarkes/hairline@0.5.0`, MIT, Lucas Marques. [Official repository](https://github.com/lucasmarkes/hairline). Original README, declarations, runtime, source maps and license live in `assets/hairline/`. `source-manifest.json` records SHA-256 hashes. Catalog tags are skill-authored selection hints, not upstream claims.

Use the project's package manager. If already installed, inspect its version first. For a new project: `npm install @lucasmarkes/hairline@0.5.0` or the pnpm/yarn/bun equivalent. React 18+ is an optional peer; vanilla ESM has no dependencies. For an offline static page, copy vendored `dist/index.js` and LICENSE and import by relative path. Do not copy the whole skill into public.

```tsx
import { Settle } from '@lucasmarkes/hairline/react';
export function Illustration() {
  return <Settle intensity={0.35} theme="dark" play={false} aria-label="資料整理成一個整齊的結構" />;
}
```

React components accept div attributes and forward a div ref. SSR reserves a 5:4 box. Vanilla functions need a DOM; call in an effect or after mounting:

```ts
import { settle } from '@lucasmarkes/hairline';
const figure = settle(element, { intensity: 0.35, theme: 'dark', label: '資料整理成一個整齊的結構', play: false });
figure.update({ play: true });
// On unmount:
figure.destroy();
```

Options: `intensity` 0…1 (default .5), `theme` auto/light/dark (default auto), `label`, `onRead(text)`, `play` (default false). `update` leaves omitted keys unchanged; undefined restores a default. `onRead` describes drawing measurements, not application results. `destroy` is safe twice.

```css
.figure {
  width: 100%; aspect-ratio: 5 / 4;
  --hairline-plate: #060807;
  --hairline-hi: #75d5b5;
  --hairline-edge: #8b9c94;
  --hairline-mid: #46564d;
  --hairline-lo: #27352c;
  --hairline-stroke: .9;
}
```

Match plate to the real background. Do not assume transparency. A centered flex item still needs width; an empty host can collapse on mobile. Figures share a RAF loop; resting/offscreen figures stop work. Reduced motion stops autonomous play, but pointer interactions still respond. Riffle is keyboard-focusable and supports arrows; other figures are accessible images.

For large/multiple figures, adapt `assets/react/HairlineFigure.tsx`. It imports after intersection, uses actual visibility for play, cleans asynchronous work/listeners, and presents an explicit load error. Keep DOM runtime out of React Native bundles. Inspect the production lazy chunk; `import()` is a strategy, not proof of splitting.
