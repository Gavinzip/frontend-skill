---
name: glass-light-toggle
description: Implement or adapt a draggable glass dark-mode switch whose pixel particles morph from a moon to a sun while a blue or amber edge light moves with the thumb. Use for this specific light/dark interaction, especially from the Glass Light Toggle reference.
---

# Glass Light Toggle

Use the original project’s theme provider, tokens, and normal entry point. Choose a starting theme from its existing state before mounting the switch. Build the effect with [the portable JavaScript module](assets/glass-light-toggle.mjs) and [its CSS](assets/glass-light-toggle.css). Both files are required. The motion uses Canvas 2D and CSS and runs without a framework or GPU dependency.

1. Put the visual on a native button with `type="button"`, `role="switch"`, and a stable accessible label like `Dark mode`. Set `initialDark` from the real app and connect `onChange(dark)` to its existing theme setter. Use `setDark` to sync changes from outside the control. Call `destroy()` on unmount.
2. Use one continuous progress value for thumb position, the glass rim, particle morph, and optional preview lighting. During drag, follow the pointer. On release, commit the nearest endpoint. A click or keyboard activation toggles the theme. Leave semantic state unchanged during a drag until the choice commits.
3. Preserve the blue lower rim with a warm white moon in dark mode, and the amber upper rim with an ink sun in light mode. The glyph comes from one set of particles with two target arrangements. Interpolate each tile so reversal follows the same path. Adjust scale and colors to the host surface without changing the direction of the feedback.
4. Verify real light/dark changes, click, drag in both directions, pointer cancel, Space and Enter, focus, narrow touch viewports and reduced motion. Verify that the host theme persists according to its own policy. Treat a reference match and a product integration as separate checks.

See [integration.md](references/integration.md) for the native and React lifecycle, tuning and evidence. The [standalone preview](preview.html) exercises the actual module. Visual reference: [Zsolt Kacso, Glass Light Toggle](https://experiments.thisiswhitespace.com/glass-light-toggle).
