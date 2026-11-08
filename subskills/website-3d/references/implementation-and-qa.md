# Website 3D implementation and QA

## Runtime rules

### Renderer and materials

- Create one renderer; configure color management, tone mapping, exposure, and shadows before
  material review.
- Cap DPR by quality tier. Resize renderer, camera, and post targets from measured viewport size.
  Rebuild responsive camera curves only for meaningful width/orientation changes.
- Base/emissive maps are sRGB. Normal, roughness, AO, metalness, masks, and data maps are linear.
  Use AO only with its required second UV set.
- Use alpha test for foliage/cards whenever soft blend is unnecessary. Limit full-screen blended
  layers because overdraw is often more expensive than simple geometry.
- Prefer shared atlas/trim resources, instancing, merged static geometry, and LODs for repetition.

### Scene and scroll state

- Persist groups for environment, landmarks, chapter sets, interactives, and atmosphere. Register
  animated objects and material/light channels at load time; never traverse the full scene per frame.
- Measure anchors after fonts and essential images settle. Exact native scroll state drives the
  deterministic story; damped state only gives visual catch-up.
- Resolve in stable order: scroll/input, camera/world, mixers/particles, interactions/DOM, render,
  then performance sampling.
- Prefetch by exact progress/direction. Keep adjacent assets long enough for reverse scroll.
  Invisible does not mean disposed.

### Motion and lifecycle

- Request frames only while visible work needs updates. Pause when hidden/offscreen and clamp the
  resumed delta to about 1/30 second.
- Keep pointer parallax small, local, and separate from authored camera data.
- Cancel RAF/timers; remove listeners; disconnect observers; stop mixers/media; dispose unique GPU
  resources and renderer once at teardown. Guard async loads that resolve after disposal.
- On context loss, preserve readable DOM and a designed still. Do not call that an active 3D state.

## Starting performance envelopes

Measure the real target and adjust, but begin inside these conservative limits:

| Budget | phone | desktop |
| --- | ---: | ---: |
| DPR cap | 1.25–1.5 | 1.5–2.0 |
| draw calls | 50–90 | 90–160 |
| visible triangles | 150k–300k | 500k–1.2m |
| dynamic shadow lights | 1–2 | 2–4 |
| blended full-screen layers | <=2 | <=3 |
| critical initial transfer | 3–6 MB | 5–10 MB |
| steady frame time | ideal <=16.7 ms, fallback <=25 ms | ideal <=16.7 ms |

Profile after shader warm-up at the heaviest seam. Toggle DPR, post-processing, shadows,
transparent atmosphere, chapter groups, LODs, and neutral materials to identify the true
bottleneck. File size alone is not performance evidence.

## Live QA matrix

Complete this against the running localhost experience—not a design mockup.

| Area | Required proof |
| --- | --- |
| Endpoints | Live capture at 1440×900, 768×1024, and 390×844; landmark, copy zone, and near plane all compose correctly |
| Seams | Slow forward/reverse, fast flick, scrollbar drag, anchors, reload at depth, history restoration, resize mid-segment |
| Geometry | Silhouette in grayscale; believable thickness, contact, scale, bevels, normals, and no camera collision |
| Materials | Correct color space, UV density, normal/roughness response, AO, emissive/light relationship, alpha sorting, shipped compression |
| Atmosphere | Fog separates planes, practicals match glow/spill, particles have depth, bloom isolates highlights, no temporal shimmer |
| Interaction | Proxy hit accuracy, hover/focus parity, touch behavior, chapter gating, DOM counterpart, cleanup on chapter exit |
| Accessibility | Semantic order without canvas, heading hierarchy, focus, contrast per chapter, 200% zoom, reduced motion, reachable footer |
| Loading | Cold cache, throttled network, real group progress, shader warm-up, fast skip, failed asset, context loss, hidden-tab return |
| Performance | Median/p95 frame time, calls, triangles, textures/programs, texture memory, transfer, long tasks, device/browser recorded |
| Cleanup | Mount/unmount or route cycle returns to baseline canvas/listener/resource count where observable |

## Delivery evidence

Report checked facts separately from inference. Include checked branch/commit or local runtime
revision, tested route/port, viewport/device/browser evidence, representative screenshots and
forward/reverse recording when seams matter, console/request results, performance/asset table,
reduced-motion and WebGL-failure evidence, and every untested device or fallback used.

A passing typecheck, build, HTTP 200, or visible canvas is useful, but none proves the complete
3D journey or target-device performance.
