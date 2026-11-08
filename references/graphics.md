# Graphics and effects

## Choose the technique from the result

Use CSS or the product's motion library for ordinary controls. Use Canvas, WebGL or WebGPU when the visual needs procedural pixels, a material, a scene, or a texture input. Clarify whether the effect is background, overlay, distortion of existing content, or part of a 3D scene. Each has a different input and layering model.

- **Liquid Glass with edge refraction.** The packaged [DOM implementation](../assets/liquid-glass-edge-refraction/integration.md) uses Canvas for a displacement map and SVG to sample the visible backdrop in Chromium. Verify with a high-contrast backdrop behind the actual surface. Keep the surface's original base blur for unsupported browsers or preference states and surface the support status. Geometry, browser and CSP limits are documented with the asset.
- **Procedural materials and shader effects.** An optional upstream source is [Shader Effects](https://github.com/shader-effects-inc/shaders). Choose a compatible version from the actual project. Confirm its supported runtime and framework entry points. Inspect effect props, layering, any texture input and telemetry settings before adding a dependency.
- **Spatial website, 3D scene or game HUD.** Identify camera, lighting, interaction and budgets. Keep readable DOM controls and focus behavior when a canvas handles scenery. A postprocess on a sprite or rendered scene needs a real framebuffer or texture from the host pipeline.

## Renderer integration and checks

Initialize browser-only effects in their client lifecycle. With WebGPU, request a real adapter and device, handle initialization and device loss, and verify visible frames. The presence of `navigator.gpu` is an initial capability signal. Report unsupported targets and any agreed alternative explicitly.

Resize at a bounded pixel ratio and clean up observers, animation frames, events and GPU resources on unmount. Pause continuous effects while offscreen or in background tabs. Honor reduced motion and preserve foreground contrast, pointer behavior and keyboard access. Compare desktop and target mobile performance with the effect active. Document which hardware/browser conditions were actually exercised.
