# Website motion

## Hero and entry

Choose motion based on the visual role. For a new hero whose direction calls for an entrance, start with a short stagger through navigation, headline, supporting copy, action and hero media in reading order. Combine a small translation with a low, visible starting opacity. Use blur sparingly and keep the initial HTML readable without hydration. With a delayed CSS keyframe animation, `animation-fill-mode: both` applies the start state during the delay and the final state afterward. Reduced-motion mode should render the content immediately. Use a marquee or a decorative beam only if it supports the content hierarchy. Provide stable controls when motion persists beside readable content.

## Scroll-controlled video

Choose an interaction contract before building the hero.

| Contract | Implementation |
| --- | --- |
| Direct scrub | Use native document scroll. Normalize travel through the sticky stage to `[0, 1]` and map it to bounded media time. Coalesce seeks with `requestAnimationFrame`, track readiness, and stop advancing when the scroll stops. |
| Assisted completion | Use a small directional displacement near an endpoint to detect intent. Lock the transition while it travels to the opposite endpoint. Synchronize the document position and video, including a complete reverse journey. Use a reverse media asset when required. |

Keep page content and the scroll driver separate. Use a stable sticky or fixed stage and measure actual viewport travel. Preserve keyboard, scrollbar, touch and nested scroll behavior. Warm the decoder for the first useful frame. Check reverse scrubbing, interruption, end frames, slow seeks, and reduced-motion endpoint behavior. Check range support and content type when media is served remotely.

## Entry with critical media or code

Gate an immersive introduction on completed transfers, a visible decoded frame and prepared renderer states. Trigger route chunk and data loads in parallel when possible. If transfer progress cannot be measured, show an indeterminate stage. Reserve `100%` for the point the UI can enter. Bound failed downloads, lazy imports and decodes with actionable errors and a retry that reattempts the failing stage. Keep normal application content navigable where the brief permits independent loading.

## Prismatic scene transition

For a reference with an irregular luminous dissolve between rendered scenes, use one progress signal, one shared dissolve field, scene render targets, a narrow emissive boundary and optional bloom. Let edge particles sample that boundary so they follow the same geometry. Define visible start and end states before selecting postprocessing. Expose intermediate states for profiling and avoid recreating textures or render passes on scroll. A simple fade or wipe is a different effect. See [graphics](graphics.md) for renderer ownership and device checks.
