---
name: frontend
description: Coordinate frontend design, implementation, motion, effects, and browser verification for websites and app interfaces. Use for new pages, redesigns, components, scroll or loading motion, product UI reviews, and saving or reusing approved frontend patterns. Supports existing stacks without requiring separate specialist skills.
---

# Frontend

Identify the intended user experience, existing stack, accepted design and scope. Use the smallest combination of the references below that serves the task. Instructions and assets in this package are relative to this file. An installed specialist or connector can supply additional implementation details when relevant.

| Task | Start here |
| --- | --- |
| Choose a visual direction, reproduce a reference, build a page, or work across web and mobile | [Product UI](references/product-ui.md) |
| Design a hero, entry sequence, loading gate, scroll video, or prismatic scene transition | [Website motion](references/website-motion.md) |
| Build interactive controls, React components, submit/save feedback, tables, or agent chat | [Components and state](references/components-and-state.md) |
| Choose a shader, WebGPU material, glass effect, or a spatial 3D experience | [Graphics and effects](references/graphics.md) |
| Check an implementation in the browser or verify an authorized release | [Verification](references/verification.md) |
| Save, find, or reuse an approved design method | [Design library](references/design-library.md) |

## Work on the actual product

1. Inspect the normal app entry, relevant routes, existing primitives and data/auth boundaries. Start with the accepted reference and the current product. A small repair usually needs a local change.
2. When the request calls for reusing a saved approach or would benefit from known patterns, search the approved design library for the current project and verify a matching payload. Use the current brief and product constraints to decide whether to adopt it.
3. Open the references for the chosen roles. Keep page composition, control state, decorative effects and data/mutations separately owned. Use the host framework, tokens and dependencies unless the task calls for a change.
4. Validate the changed behavior through the normal product entry, including responsive and accessibility states that the change touches. Distinguish observed behavior from visual approval and from deployment status.

When the user asks only for discussion or review, stay within the requested scope. A visual asset, a saved pattern, or a previous approval does not grant permission to publish, deploy, change unrelated designs, or reuse project-specific code elsewhere. Pure backend work and standalone film production have their own workflows.

For an edge-refraction overlay specifically, the packaged [Liquid Glass implementation](assets/liquid-glass-edge-refraction/integration.md) supplies JavaScript and CSS. Check the target browser, backdrop and CSP before enabling it.
