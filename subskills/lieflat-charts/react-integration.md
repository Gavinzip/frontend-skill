# React integration

Read this file when a Lieflat chart or report must live inside React, Next.js, Vite, Remix, or another component-based frontend instead of being delivered as a standalone HTML file.

## Preserve the template contract

- Select the chart in `catalog.md` before writing React code. Keep the chosen gallery card's visual encoding, geometry, proportions, labels, and motion cadence.
- Treat the upstream HTML template as a rendering reference, not as a component to paste wholesale. Extract only the selected card, its renderer, its tokens, and the data contract.
- Keep data preparation, rendering, and page composition separate. A maintainable default is `data.ts`, one reusable chart component, one renderer or hook, and a feature/page wrapper.
- Do not combine multiple gallery implementations into one switch-heavy component. Use one component per chart family or per materially different renderer.

## Renderer boundaries

### Hand-written SVG

- Prefer declarative JSX when the template is static enough to express clearly.
- Preserve the original `viewBox` and internal coordinate system. Make the outer SVG responsive with CSS rather than recalculating the template geometry without need.
- Generate stable keys from real record identifiers. Do not use array indexes when records can reorder.
- Keep decorative marks non-interactive and `aria-hidden`; expose real data marks through labels, summaries, or an accessible table.

### ECharts

- Create the chart from a container `ref` inside an effect, then dispose it in the cleanup function.
- Update options from explicit data/config dependencies. Do not recreate the instance on every render.
- Use `ResizeObserver` or the project's existing resize hook and call `chart.resize()`; disconnect the observer during cleanup.
- In SSR frameworks, place browser-only initialization behind an explicit client component boundary. Do not hide an SSR error with an unrelated placeholder fallback.
- Keep SVG rendering when the selected template relies on sharp editorial line work unless the target project has a measured reason to use canvas.

### Chart.js

- Mount Chart.js on a real `<canvas>` ref, keep the instance in a ref, and call `destroy()` before recreation and on unmount.
- Register only the controllers, elements, scales, and plugins the selected chart needs when the project's Chart.js setup is tree-shaken.
- Keep the wrapper's height explicit so responsive layout does not collapse.

## Data and state

- Define a typed input model for the chart's semantic data, not for raw DOM coordinates.
- Put sorting, aggregation, unit expansion, binning, and normalization in pure functions outside the render path. Preserve the original units for labels and tooltips.
- Memoize only transformations that are genuinely expensive or identity-sensitive. Do not use memoization to conceal mutable input.
- Use stable refs rather than global element IDs so multiple chart instances can coexist.
- For replay controls, reset the real animation state and timers. Clear timers, observers, and event listeners on unmount.

## Styling and assets

- Scope Lieflat tokens under a component or feature root when global token names could collide with the host application.
- Keep one color system across the entire chart set. If Mono is chosen because no color preset has a clear semantic fit, report that choice explicitly.
- Prefer the project's font-loading mechanism. If Inter is already available, do not add a second network font request.
- External Chart.js, ECharts, font, or GeoJSON CDN dependencies must be disclosed. For production applications, use the project's package and asset pipeline when licensing and bundle constraints allow it.

## Accessibility and reduced motion

- Preserve `prefers-reduced-motion`; render the final readable state without replay-only dependencies.
- Add a concise accessible summary describing the principal conclusion, units, time range, and source.
- If precise values matter, provide an accessible table or list in addition to the visual chart.
- Keyboard interaction is required for any pin, filter, replay, or selectable legend control.

## Verification

- Compare the React result beside the selected gallery card at desktop and mobile widths.
- Verify repeated mount/unmount cycles do not leave duplicate canvases, observers, listeners, or timers.
- Verify two instances on the same page render independently.
- Check labels at the smallest supported width and confirm that visual area/length remains proportional to the data.
- Run the target project's typecheck/build and inspect the real browser result. Do not treat a successful build as visual acceptance.
