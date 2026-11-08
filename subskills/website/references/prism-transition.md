# PRISM Scroll Transition

## Contents

- Visual contract
- Architecture
- Required stack and starter
- Integration workflow
- Scroll and endpoint contract
- Dissolve field
- Emissive edge and Bloom
- GPU boundary particles
- Render lifecycle
- Performance tiers
- Accessibility and compatibility
- Failure modes
- Verification

## Visual contract

Build a reversible scene transition that feels like material is being illuminated, eroded, and replaced along an irregular active boundary. The target scene must not slide in as a pane, fade as one layer, or appear behind a regular wipe.

The effect is successful only when all of these are true:

1. Several spatially separated ignition fronts expand at different times.
2. Broad, medium, and detail noise perturb the boundary without dominating its direction.
3. A narrow white-hot core, warmer inner band, and restrained outer halo share the same threshold.
4. GPU particles appear near the active boundary and drift away from it; they are not uniformly scattered.
5. Native scroll position is the source of truth. Downward scrolling advances and upward scrolling reverses the exact same state.
6. Progress `0` is transparent over the source scene. Progress `1` exactly matches the destination scene's crop, registration, color source, and neutral transform.
7. The active range is slow enough to inspect. Do not compress the full transition into one wheel tick or a timed flash.

This is not a generic rainbow prism. Prefer pale white-gold and cool-silver energy. Add stronger color only when the project's art direction requires it.

## Architecture

Use this ownership model:

```text
native document scroll
  -> progressRef (0..1, no per-frame React state)
  -> demand-render invalidation event
  -> R3F Canvas
       -> target render target (incoming artwork / 2.5D scene)
       -> effects render target (HDR edge + GPU particles)
       -> transparent composite plane
       -> imperative postprocessing composer (RenderPass + BloomEffect)
  -> endpoint scene state only (source / transitioning / destination)
```

Keep modules separate:

- `usePrismScrollProgress.js`: map a sticky section's native scroll range into a mutable ref and coarse endpoint state.
- `PrismTransition.jsx`: own Canvas configuration, quality tier, and a memoized WebGL subtree.
- `DualRenderPipeline.jsx`: own render targets, textures, uniforms, portals, and composite.
- `prismShaders.js`: own the shared dissolve field plus target, effects, composite, and particle shaders.
- `GpuBoundaryParticles.jsx`: own seeded point geometry and particle material.
- `BloomRenderPipeline.jsx`: own the imperative composer, passes, and disposal.
- `ScrollRenderDriver.jsx`: invalidate on progress events and animate only while `0 < progress < 1`.
- `webglSupport.js`: detect WebGL2 without treating a fallback as proof the primary effect works.

Do not put all behavior into one component.

## Required stack and starter

Compatible baseline:

```bash
npm install three @react-three/fiber postprocessing
```

Reuse `assets/prism-transition/react/` from this skill. Copy the folder into the project's component area, then adapt:

- `targetImageUrl` or the target-scene render source;
- the event namespace in `usePrismScrollProgress.js` and `ScrollRenderDriver.jsx`;
- source/destination scene state names;
- sticky journey height;
- project quality thresholds and asset budgets.

Use direct `postprocessing` classes. Do not default to `@react-three/postprocessing` for this effect: reactive pass re-registration can collide with a lost or replayed WebGL context. The starter explicitly owns one composer lifecycle.

## Integration workflow

1. Identify the source DOM/scene and target artwork/scene.
2. Make the scroll journey a relative section, normally `300svh`, with a sticky `100svh` stage.
3. Mount the source scene, destination endpoint scene, and `PrismTransition` inside the same sticky coordinate system.
4. Pass a stable `progressRef` into the memoized transition. Do not pass frequently changing React state into the WebGL subtree.
5. Render the destination endpoint scene only at `progress >= 0.999`. It must use the same image and cover crop as the shader's final frame.
6. Test at progress `0`, `0.25`, `0.5`, `0.75`, `1`, then reverse to `0.5` and `0`.
7. Tune ignition timing and boundary width before increasing particles or Bloom.

Example shell:

```jsx
const journeyRef = useRef(null);
const { progressRef, sceneState } = usePrismScrollProgress(true, journeyRef);

return (
  <section ref={journeyRef} className="prism-journey">
    <div className="prism-journey__sticky">
      <SourceScene />
      <DestinationScene visible={sceneState === 'destination'} />
      <Suspense fallback={null}>
        <PrismTransition progressRef={progressRef} targetImageUrl={targetImage} />
      </Suspense>
    </div>
  </section>
);
```

```css
.prism-journey { position: relative; height: 300svh; }
.prism-journey__sticky {
  position: sticky;
  top: 0;
  height: 100svh;
  overflow: clip;
  isolation: isolate;
}
```

## Scroll and endpoint contract

Calculate progress from layout, not accumulated wheel deltas:

```js
travel = section.offsetHeight - window.innerHeight;
progress = clamp((window.scrollY - section.offsetTop) / travel, 0, 1);
```

Update the mutable ref inside a scroll-scheduled `requestAnimationFrame`. React state should change only when entering `source`, `transitioning`, or `destination`; otherwise React rerenders can rebuild expensive WebGL ownership.

Never:

- intercept wheel events to play a fixed animation;
- convert each wheel gesture into a direction toggle;
- animate toward an endpoint independently from actual `scrollY`;
- let a fast trackpad gesture skip a separately timed transition.

The browser scrollbar, wheel, trackpad, touch, keyboard, and scripted accessible navigation must all resolve to the same progress.

## Dissolve field

Use one GLSL function for reveal, emissive edge, and particle activity. The starter's field combines:

- broad noise: large contour variation;
- medium noise: breakup and branching;
- detail noise: grain at the cut edge;
- a subtle filament term;
- four aspect-normalized radial ignition fronts;
- staggered smoothstep ranges with a later power curve.

Normalize radial metrics by the viewport diagonal. Without this, mobile completes much earlier than desktop. Keep noise displacement subordinate to wave expansion so the transition still has spatial intent.

Tune in this order:

1. ignition coordinates;
2. each ignition's start/end range;
3. expansion exponent;
4. broad/medium/detail amplitudes;
5. edge widths.

Do not tune particles until the monochrome threshold silhouette is attractive.

## Emissive edge and Bloom

Render effects in HDR values above `1.0`, then apply real Bloom:

- core: near-white, narrow, highest intensity;
- inner band: warm gold/amber, medium width;
- halo: wider, low intensity;
- char/dark band: optional restrained darkening just behind the edge.

Bloom defaults from the verified build:

| Setting | High | Balanced |
| --- | ---: | ---: |
| intensity | 1.12 | 0.96 |
| luminance threshold | 1.02 | 1.02 |
| smoothing | 0.035 | 0.035 |
| radius | 0.78 | 0.78 |
| mip levels | 7 | 5 |

More Bloom is not automatically more premium. If the edge becomes a white fog, narrow the halo or reduce HDR energy before raising threshold.

## GPU boundary particles

Seed point positions once in a buffer. In the vertex shader, sample the same dissolve field used by the composite and activate points only near `abs(edge) == 0`.

Use additive blending, disable depth read/write, and keep particles stretched or streak-like rather than circular confetti. Vary lifetime, temperature, drift direction, and point size from a stable seed. The verified tiers use approximately `1600` points on high and `700` on balanced.

Particles should reinforce the boundary; they must not define it.

## Render lifecycle

Use `frameloop="demand"`. Invalidate on each progress update and keep a RAF alive only while progress is between endpoints so sparks can move. Stop rendering at `0` and `1`.

Explicitly dispose:

- both WebGL render targets;
- generated noise texture;
- composer and passes;
- scheduled RAFs and event listeners.

Save and restore renderer state around offscreen renders: render target, clear color, and clear alpha.

Memoize the top-level transition. Keep `progressRef` stable. Do not allow endpoint React state to recreate Canvas.

React 19 development warning: with some React Three Fiber versions, Strict Mode effect replay around a lazily mounted Canvas can release the replacement WebGL context after mount. Verify the actual dev server by scrolling after the Canvas has been mounted for at least one second. If reproduced, keep the WebGL root outside the replayed Strict Mode boundary or remove that development wrapper for the app entry after confirming the lifecycle conflict. Do not hide the failure behind a static fallback.

## Performance tiers

Start with:

| Resource | High | Balanced |
| --- | ---: | ---: |
| Canvas DPR cap | 1.5 | 1.1 |
| target scale | DPR-capped full | 1.0 |
| effects target scale | 0.58 | 0.44 |
| particles | 1600 | 700 |
| antialias | off | off |
| multisampling | 0 | 0 |

Choose balanced for compact viewports or devices reporting four or fewer logical CPU cores. Audit the lazy 3D chunk and source imagery. Keep large media out of the eager main chunk and place production-heavy media on a CDN/R2 when appropriate.

Do not use CPU Canvas particles, per-frame gradient construction, thousands of DOM nodes, or React state updates on every frame.

## Accessibility and compatibility

For `prefers-reduced-motion`, snap between static endpoints at the midpoint and remove the animated Canvas. Keep both endpoints fully understandable.

For browsers without WebGL2, decide and document a static compatibility path. This is an explicit compatibility tier, not evidence the primary effect works. Do not introduce it while debugging the main renderer.

Keep the Canvas decorative (`aria-hidden`, `pointer-events: none`). Interactive content belongs in the source or destination DOM scene.

## Failure modes

| Symptom | Likely cause | Fix |
| --- | --- | --- |
| Entire React root disappears on first scroll | Composer re-registers against a lost context | Stabilize/memoize the WebGL subtree; own one imperative composer; inspect Strict Mode lifecycle |
| Canvas remains transparent although progress changes | WebGL context was released or render invalidation stopped | Check context-loss logs and actual Canvas lifetime; test a diagnostic shader, then remove it |
| Bright edge over black | Target shader failed while effect target still renders | Read shader compile logs; avoid helper-name collisions with Three.js injected GLSL |
| Looks like a straight wipe | One dominant directional threshold | Use multiple staggered ignition fields and aspect-normalized radial metrics |
| Looks cheap despite many sparks | Boundary and heat layers are weak | Fix threshold silhouette, white-hot core, warm band, and Bloom before particles |
| Mobile reveals too early | Distances are not aspect normalized; noise amplitude dominates | Divide metrics by viewport diagonal and reduce noise to edge perturbation |
| Final frame jumps | Canvas crop/transform differs from destination DOM | Use one source image, identical cover UV, center registration, and neutral endpoint transforms |
| Reverse scroll flashes or restarts | Timed animation owns progress | Derive every frame directly from native scroll progress |

## Verification

Use the real browser and real input surface. A build alone is insufficient.

Required checks:

1. Page identity and nonblank DOM.
2. No framework overlay or relevant console/WebGL errors.
3. Source at `0`: Canvas transparent, source fully visible.
4. Early active state near `0.25`: distinct ignition, not a full wipe.
5. Midpoint near `0.5`: irregular boundary, visible HDR edge, attached sparks.
6. Late state near `0.75`: destination mostly revealed without an opaque pane.
7. Endpoint at `1`: exact crop and registration; no edge residue or duplicate overlay.
8. Reverse from `1` through `0.5` to `0`: same geometry backward, no restart.
9. Root and Canvas remain mounted once through source-state changes.
10. Desktop and mobile tiers, reduced motion, horizontal overflow, and asset sizes.
11. Demand rendering stops at endpoints.
12. Remove every diagnostic shader, query flag, screenshot, and temporary test script after verification.
