---
name: website-3d
description: Build original, maintainable Three.js websites and scroll-controlled 3D worlds. Use for 3D landing pages, spatial narratives, virtual rooms, exhibitions, product stories, camera journeys, interactive hero objects, and requests to turn a place or reference into a real-time website. Routes suitable focal-object reference images through the installed img2threejs quality pipeline; it does not pretend a scene image can become a complete accurate world automatically.
license: MIT
version: 1.0.0
---

# Website 3D

Create an original 3D website as a readable web experience, not a pile of effects.
The core pattern is one persistent real-time scene, native document scroll as the
reversible story conductor, semantic HTML for the narrative, and a component
architecture that lets future scenes reuse the runtime without copying one giant file.

This is a personal synthesis of relevant MIT-licensed workflows from Meng To's Skills
repository and the installed `img2threejs` skill. See [UPSTREAM.md](UPSTREAM.md) for
the exact source snapshot and attribution. It is deliberately not a copy of Kage, its
artwork, its name, or its single-file implementation.

## When to use

Use this skill when the request needs:

- an interactive Three.js hero, object, room, exhibition, map, or virtual place;
- a scroll-driven camera journey across 3–8 authored chapters;
- an original version of the *approach* behind a reference such as Kage;
- a modular system where classroom, gallery, or forest can share the same runtime;
- a supplied object image that must become a procedural Three.js focal model.

Do **not** use real-time 3D just because a page needs motion. Prefer video scrub for
cinematic footage, or semantic HTML/SVG for data- and copy-led narratives. If the
visitor never benefits from spatial depth, 3D is unnecessary complexity.

## Promise and boundaries

Website 3D creates a sense of moving through a place with real geometry, materials,
lights, camera perspective, fog, and local interaction. It cannot infer the hidden side,
exact dimensions, construction, or PBR maps of a whole place from one picture. A single
reference image is evidence for composition and visible surfaces, not a scene-export
button. State a result as stylized or approximate whenever the input cannot support a
reconstruction claim.

Never hide a video, flat background image, or generic particle effect behind a claim of
live Three.js. If a fallback is genuinely required, explain the cause, preserve a
semantic story or composed still, and record the fallback in delivery evidence.

## Choose the correct route before code

| Need | Route | Result |
| --- | --- | --- |
| One inspectable product or decorative object, no authored journey | Single Three.js scene | One camera and local interaction |
| Several views of one place | Scroll world | One renderer, scene, and chapter conductor |
| A reference photo of one chair, lantern, desk, machine, plant, or character | `img2threejs` sub-pipeline | Verified procedural model factory |
| A full room, landscape, or mood-board image | World-reference route | Art direction and selective modular geometry; not image-to-mesh |
| Film-realistic imagery but no live depth/hotspots | Video route | Scroll-scrubbed footage, not faux 3D |
| Facts and reading are central | DOM/data route | Semantic HTML/SVG, not WebGL |

For a classroom, build a reusable runtime plus a classroom scene definition, modular
architecture, and furniture kits. Route only a distinctive hero prop through
`img2threejs` when a suitable reference exists.

## Required intake

Inspect the supplied project and reference first. Ask only for details that cannot be
safely discovered. Establish:

- purpose, audience, and the one action the journey should earn;
- subject and 4–8 ordered story beats;
- topology: continuous geography, connected rooms/sets, or layered state changes;
- approved brand assets, copy, model/photo rights, and provenance;
- desktop/mobile targets, reduced motion, and minimum hardware;
- interaction depth: scroll-only, ambient response, inspectable objects, or local tasks;
- critical-first-frame and total-transfer budget.

Before code, write a world sentence and interaction sentence:

> Travel from the rain-dark corridor into a quiet classroom, ending at the window as the
> room changes from institutional to personal.

> Scroll controls camera travel; pointer, touch, and keyboard reveal local details without
> taking the visitor off the route.

Reject a direction that is only a mood. It must imply distinct places, state changes, or
spatial relationships that make camera movement meaningful.

## Required planning artifacts

Before a substantial world, create a world contract from
[references/scene-contract.md](references/scene-contract.md) in the feature folder as
`world-bible.md` and `worldSpec.ts`. It must include:

1. visual constants: unit scale, silhouette, palette roles, material families, lens, lights,
   atmosphere, exclusions, and motion ranges;
2. chapter ledger: beat, landmark, camera, occlusion seam, state, DOM, foreground, asset,
   and mobile composition for every chapter;
3. camera ledger: endpoint, target, FOV, close-pass risk, and explicit mobile override;
4. asset/loading ledger: source, rights, compressed/decoded cost, owner, prefetch, fallback;
5. interaction matrix with a real DOM equivalent for every meaningful 3D control;
6. measured performance budget and ordered quality reductions.

Do not spend heavily on models, textures, or particles until graybox silhouettes and every
desktop/mobile camera endpoint have passed review.

## Maintainable project structure

Adapt names to the host stack, but keep ownership separate. Do not put scene construction,
scroll thresholds, UI text, loaders, and material factories into one page.

```text
src/features/<world-id>/
  config/
    worldSpec.ts             chapters, endpoints, budgets, assets
    visualTokens.ts          palette, materials, quality tiers
  scene/
    createWorld.ts           scene graph and lifecycle owner
    createEnvironment.ts     sky, floor, terrain, distant silhouettes
    createArchitecture.ts    permanent shells and paths
    createAtmosphere.ts      fog, weather, optional particles
    createLights.ts
    createMaterials.ts
  models/
    create<ClassroomDesk>Model.ts
    specs/                   img2threejs contracts and reviewed evidence
  runtime/
    ScrollConductor.ts       exact progress, anchors, history, resize
    CameraRig.ts             authored path plus local input rig
    WorldState.ts            interpolation and chapter ownership
    AssetGroups.ts           streaming, warm-up, disposal
    InteractionRegistry.ts   proxies plus DOM synchronization
    QualityGovernor.ts
  ui/
    WorldStory.tsx           semantic chapter DOM
    ChapterNavigation.tsx
    WorldFallback.tsx
  debug/
    WorldDebugOverlay.tsx
  world-bible.md
```

A single-file proof is acceptable for a throwaway experiment, not for a scene system that
must later swap worlds or be maintained.

## Build sequence

### 1. Build a real graybox

- Use a declared unit system, normally one unit equals one metre, and a human-scale proxy.
- Establish large silhouette, structural thickness and contact, then visible accents.
- Use doors, terrain folds, darkness, fog, or foreground to conceal unavoidable set seams.
- Compose every endpoint on desktop and mobile before adding camera smoothing.

### 2. Keep one persistent world

Use one renderer, normally one scene, and named groups for environment, landmarks,
chapter-local sets, atmosphere, and interactive proxies. Never make a new canvas, renderer,
or unrelated scene at each chapter boundary.

All systems receive one state object:

```ts
type StoryProgress = {
  exact: number;       // native scroll truth, e.g. 2.35
  smooth: number;      // damped visual state
  index: number;
  next: number;
  localExact: number;
  localSmooth: number;
  direction: -1 | 0 | 1;
};
```

`exact` owns navigation, URL/hash, interaction availability, DOM ownership, and foreground
ownership. `smooth` owns camera and visual interpolation. Never derive those systems from
different thresholds.

### 3. Author scroll as cinematography

- Measure stable DOM anchors after fonts and critical media settle; remeasure with
  `ResizeObserver` after width, orientation, or content changes.
- Keep native scroll reversible. Never integrate wheel deltas into story state or trap scroll.
- Store position, target, FOV, optional roll, and a phone override per endpoint.
- Interpolate position/target then use `lookAt`; use quaternion slerp only for deliberate roll.
- Sample the authored route in debug mode for geometry collisions.
- Keep pointer/device parallax in a separate input rig; never mutate source waypoints.
- Each chapter must reveal a new spatial relationship, not just move toward the same object.

### 4. Add surface, light, and atmosphere

- Configure output color space, tone mapping, exposure, and shadow policy before material review.
- Base/emissive color maps are sRGB; normal, roughness, AO, metalness, masks, and data are linear.
- Give materials causal wear: touched edges, wet lower walls, path use, joints, and recesses.
- Begin with a key, restrained fill/environment, and practical lights. An emitter needs fixture,
  emissive surface, nearby illumination/baked spill, and optional glow—not bloom alone.
- Compose before post. Bloom, grain, vignette, and chromatic effects must strengthen the image,
  not conceal weak geometry.

### 5. Use DOM and 3D as distinct layers

The canvas supplies place. Real HTML supplies headings, copy, links, navigation, and reading
order. Optional alpha cut-outs can be fixed near-plane scenery only when they add depth; they
must not replace meaningful 3D objects. Preserve full accessible headings when visual words
are split and reserve deliberate negative space for copy.

### 6. Add local interactions only

Scroll controls macro travel. Pointer, touch, and keyboard may only create local responses.
Raycast named inexpensive proxy meshes, not all decorative triangles. Give every interactive:
`unavailable → idle ↔ hover/focus → active → idle`, an exact chapter range, meaningful visual
response, and a real DOM button/link with equivalent behavior.

### 7. Stream and admit honestly

Warm the composed first frame before release. Prefetch the next one or two chapter groups using
exact progress and direction. Account for decoded texture memory, not just compressed transfer.
Progress must represent real required groups; it must not reach 100% while visible shader
compilation still runs.

### 8. Degrade quality deliberately

Start with the budget in
[references/implementation-and-qa.md](references/implementation-and-qa.md). If measured
performance misses it, reduce in this order:

1. DPR;
2. full-resolution post, reflections, and dense transparent particles;
3. shadow resolution/update frequency;
4. LOD and texture variants;
5. non-focal geometry.

Do not remove the landmark, copy, or essential interaction to hide a bottleneck. Diagnose
whether it is fill rate, materials, draw calls, transparency, or JavaScript first.

## Image-to-model route: required use of img2threejs

When a reference image is needed as a **single focal object**, load and follow the installed
`img2threejs` skill before writing model code. Its suitability check, assessment, detail
inventory, strict specification, staged build, and screenshot comparison remain mandatory.
Website 3D does not weaken its gates.

Use [references/modeling-with-img2threejs.md](references/modeling-with-img2threejs.md) for
the handoff and model-admission contract.

- Full room/landscape screenshots use the world-reference route, not `img2threejs`.
- One photo cannot prove unseen geometry. Ask for more views or accept a declared stylized result.
- Keep model factories in `models/`, expose pivots/sockets/colliders in
  `root.userData.sculptRuntime`, and keep reconstruction specs/review artifacts outside render code.
- Record rights and source provenance. Do not mix unapproved source photos or generated art into
  a runtime without declaring them.

## Accessibility, lifecycle, and failure

- Preserve native scroll, semantic headings, landmarks, focus, and reachable footer.
- For reduced motion, render composed chapter stills, stop ambient loops/blur/stagger, and keep
  all reading and activation paths.
- Pause live rendering when document or world host is hidden/offscreen. Clamp the first resumed
  delta and stop only invisible work.
- On WebGL creation failure or context loss, retain the ordered DOM story and a composed still.
  Report this fallback; do not describe it as an active 3D state.
- On unmount, cancel RAF/timers, remove listeners, disconnect observers, stop mixers, and dispose
  owned geometry/materials/textures/render targets/controls/renderer exactly once.

## Verification is required

Read and complete [references/implementation-and-qa.md](references/implementation-and-qa.md).
At minimum, test a live local runtime at 1440×900, 768×1024, and 390×844:

- every endpoint and seam, forward and reverse;
- fast flick, scrollbar drag, anchors, reload at depth, and resize/orientation;
- materials, texture color space, scale, grounding, lights, atmosphere, and post;
- pointer, keyboard, touch, exact interaction gating, and exit recovery;
- cold load, failed optional asset, hidden-tab resume, reduced motion, WebGL failure, teardown;
- console/network results plus measured frame time, calls, triangles, texture memory, and transfer.

Build success, screen share, or a static screenshot does not prove a scroll world works. State
untested devices, performance limits, and every fallback plainly.

## Deliverables

Deliver the world bible, typed scene config, module map, source/provenance asset ledger, working
local world, live desktop/tablet/mobile evidence, performance measurements, reduced-motion and
fallback evidence, and remaining gaps. If scenes are meant to be swappable, demonstrate at least
two scene definitions sharing one runtime before claiming the system is modular.
