# Website Pattern Reference

## Contents

- Hero section
- Icon system
- Entry animation
- PRISM scene transition
- Beam animation
- Social-proof marquee
- Button interaction
- Verification

## Hero section

Interpret the reusable prompt as:

> Create the hero section for `{app}` called `{name}` in the style of `{reference_site}`.

Prefer a reference screenshot. Match the reference's composition, density, typography character, media placement, CTA hierarchy, container width, and first-viewport rhythm. Adapt branding and copy to `{app}` and `{name}`. Do not reproduce the reference site's trademarks, proprietary copy, or unrelated product claims.

When no screenshot is supplied, inspect the live reference at desktop and mobile before designing. Treat live content as unstable and record which visible state was used.

## Icon system

Interpret the reusable prompt as:

> Use Iconify `{icon set name}`.

Prefer one family per surface. Good defaults include:

| Direction | Suggested family |
| --- | --- |
| Neutral product UI | Lucide or HeroIcons |
| Soft, expressive product UI | Solar |
| Geometric editorial UI | Iconoir |
| Flexible weight and filled states | Phosphor |

Keep a shared size scale, stroke/fill mode, optical alignment, and interactive-state treatment. Import icons individually or through the project's existing Iconify integration to avoid shipping an entire collection.

## Entry animation

Interpret the reusable prompt as:

> Animate fade in, slide in, blur in, element by element. Use `both` instead of `forwards`. Don't use `opacity: 0`.

Default timing:

- Start opacity: `0.01` to `0.12`, never `0`.
- Translate distance: `8px` to `24px`; use smaller movement for dense UI.
- Blur: `6px` to `14px`, resolving to `0`.
- Duration: `500ms` to `850ms`.
- Stagger: `60ms` to `120ms`.
- Easing: a restrained ease-out such as `cubic-bezier(0.22, 1, 0.36, 1)`.

CSS example:

```css
@keyframes website-entry {
  from {
    opacity: 0.06;
    transform: translate3d(0, 18px, 0);
    filter: blur(10px);
  }
  to {
    opacity: 1;
    transform: translate3d(0, 0, 0);
    filter: blur(0);
  }
}

.entry-item {
  animation: website-entry 700ms cubic-bezier(0.22, 1, 0.36, 1) both;
  animation-delay: calc(var(--entry-index, 0) * 90ms);
}

@media (prefers-reduced-motion: reduce) {
  .entry-item {
    animation: none;
    opacity: 1;
    transform: none;
    filter: none;
  }
}
```

Do not set base content to `opacity: 0` while waiting for an observer or hydration. For below-the-fold scroll reveals, preserve readable content when JavaScript fails and add animation only after enhancement is available.

## PRISM scene transition

Interpret the reusable prompt as:

> Transition from the current scene into `{target scene}` with a premium PRISM dissolve: irregular glowing tear edges, attached sparks, real Bloom, and reversible native scroll scrub.

Read [prism-transition.md](prism-transition.md) completely. Use the starter in `../assets/prism-transition/react/` for compatible React/R3F projects. Preserve these defining traits:

- multiple asynchronous ignition fields instead of one straight wipe;
- one shared noise threshold for reveal, emissive edge, and GPU particles;
- layered white-hot, warm-metal, and restrained halo bands;
- progress tied directly to native document scroll and reversible at any point;
- exact visual registration between the final WebGL frame and destination scene;
- demand rendering and explicit GPU-resource disposal.

Do not substitute a CSS mask, clip-path, CPU Canvas particle loop, fixed-duration autoplay, or pre-rendered video unless the user explicitly chooses a lower-fidelity variant. Report any compatibility tier that is actually introduced.

## Beam animation

Interpret the reusable prompt as:

> Add noodles that connect and beam animate into the right circle. Add subtle details to the right beam animation circle with sonar and decorations.

- Draw curved SVG paths from the source items into the destination circle.
- Animate a short highlight segment using dash offset, gradient travel, or a masked particle.
- Keep the static path quiet and the traveling beam brighter.
- Add two or three low-opacity sonar rings, small orbit dots, ticks, or crosshair marks around the destination.
- Clip or mask decorations so they do not create horizontal overflow.
- Pause or simplify when offscreen and disable continuous travel under reduced motion.
- Use `aria-hidden="true"` and `pointer-events: none` for decorative beam layers.

## Social-proof marquee

Interpret the reusable prompt as:

> Animate the logos with marquee animation looping infinitely using duplicated items and alpha mask.

- Render two identical item groups inside one moving track.
- Mark the duplicate group `aria-hidden="true"`.
- Translate exactly one group width for a seamless loop.
- Use a CSS alpha mask at the left and right edges; do not fake the fade with opaque overlays that only work on one background.
- Pause on hover or focus only when users need to inspect or interact with items.
- Keep logo boxes, baseline, visual weight, and gaps normalized.
- Stop motion under reduced-motion preferences while keeping one complete group visible.

## Button interaction

Interpret the reusable prompt as:

> Change main button `{code}` and secondary button `{code}`. Add a 1px border beam animation around the pill-shaped main button on hover.

- Treat supplied UIVerse or CodePen snippets as source material, not application architecture.
- Preserve semantic `button` or `a` behavior, focus-visible treatment, disabled/loading state, and minimum touch target.
- Implement the primary button's beam as a 1px edge-only ring using a masked conic gradient or equivalent border layer.
- Keep the button interior neutral; do not let the animated gradient wash across the content.
- Activate the border beam on hover and keyboard focus when appropriate.
- Keep the secondary button quieter and structurally related to the primary.
- Route copy-, sign-in-, submit-, and state-driven icon transitions through `amicro-micro-transitions` when installed.

## Verification

- Confirm no entry keyframe or initial style uses exact `opacity: 0`.
- Confirm CSS/WAAPI entry animations use `both`, not `forwards`.
- Confirm reduced-motion content is fully visible and stable.
- Confirm marquee duplication is seamless at the loop boundary.
- Confirm masked fades work on the actual page background.
- Confirm beam SVGs and sonar decorations do not intercept input or cause overflow.
- Confirm the 1px button beam stays on the border and keyboard focus remains visible.
- Confirm icons come from one intended family and are tree-shaken or individually imported.
