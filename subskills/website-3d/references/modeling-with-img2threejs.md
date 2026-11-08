# Modeling a focal object with img2threejs

`img2threejs` is a strict Website 3D sub-pipeline. It is for a visible individual object,
not a shortcut for converting a whole room or landscape photograph into a true world.

## Route correctly

| Reference | Use img2threejs? | Reason |
| --- | --- | --- |
| One chair, desk lamp, lantern, camera, sculpture, plant, machine, or character | Usually | Its component hierarchy can be inspected and reconstructed in code |
| A classroom interior with desks, windows, lighting, and people | No | It establishes composition; rebuild the world from modular systems |
| A photo with a tiny distant prop | Usually no | There is too little detail for a quality contract |
| A product with front, side, and material close-ups | Yes, strongly | Multiple views make controlled reconstruction credible |
| A real person from one casual image | Conditional | Only stylized, explicitly approximate output is defensible |

## Mandatory handoff

Before model code, load and follow the [bundled img2threejs skill](../../img2threejs/SKILL.md) in full:

1. Validate image suitability and state unknown scale, hidden sides, and material detail.
2. Create its pre-spec assessment and `qualityContract`; select complexity honestly.
3. Build a detail inventory for moderate or harder targets. Every identity detail maps to a
   real component or local material override.
4. Generate the sculpt specification and run normal and strict-quality validation.
5. Build only the currently unlocked pass: blockout, structure, form, material, lighting,
   interaction, and optimization.
6. Render each pass from the agreed viewpoint, compare it beside the source, and record one
   decision: `continue`, `refine-spec`, `refine-code`, `request-input`, or `stop`.

Do not accept a one-shot mesh because the website needs a prop. If the source is weak, request
another view or build a declared stylized modular prop.

## Website 3D model-admission contract

After an `img2threejs` model passes its own gates, integrate it through a factory—not a
component that recreates geometry every render.

```ts
export type WorldModelOptions = {
  quality: "high" | "medium" | "low";
  castShadow?: boolean;
  receiveShadow?: boolean;
};

export function createClassroomLampModel(options: WorldModelOptions): THREE.Group {
  const root = new THREE.Group();
  root.name = "classroom-lamp";

  // Acquire shared geometry/materials once and attach the reviewed hierarchy.
  // Name pivots, sockets, collision proxies, and interaction proxies explicitly.

  root.userData.sculptRuntime = {
    pivots: { shade: "lamp-shade-pivot" },
    sockets: { bulb: "bulb-socket" },
    colliders: ["lamp-collider"],
    interactionProxy: "lamp-inspect-proxy"
  };
  return root;
}
```

Keep runtime factories, reconstruction specs, reviewed comparison evidence, and source
references in separate folders. Track shared resource ownership; one instance must not dispose
materials or textures still used by another.

## World-level verification

Passing object reconstruction does not prove the object works in the world. Check every authored
camera that can see it for silhouette/scale, floor-wall-table contact, material under neutral and
final lights, tone-mapped contrast, shadow/emissive relationship, proxy and DOM behavior, quality
tier cost, and chapter removal/re-entry leaks.

If a model fails at runtime, retain a composed still or a simpler approved modular prop and
disclose that fallback. Do not silently substitute unrelated art.
