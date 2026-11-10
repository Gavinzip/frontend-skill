---
name: frontend
description: Build and verify website and app interfaces, including React components, theme controls, glass effects, UI transitions, scroll motion, WebGPU, 3D scenes, admin UI and agent chat. Route to bundled specialists for concrete examples and scripts. Also use to save or reuse approved frontend patterns.
---

# Frontend

Identify the intended user experience, existing stack, accepted design and scope. Read the matching bundled subskill's `SKILL.md` before planning or implementing its part of the task. Resolve every path relative to this installed `frontend` directory. The subskills below are included in this single install. Load only the ones the request needs.

| Task | Read |
| --- | --- |
| Choose a visual direction, reproduce a reference, build a page, or work across web and mobile | [Product UI](references/product-ui.md) |
| Build a hero, entry sequence, loading gate, scroll video or PRISM transition | [Website](subskills/website/SKILL.md) |
| Choose a React Bits background, text effect, gallery or cursor | [ReactSkills](subskills/react-skills/SKILL.md) |
| Build a draggable glass light/dark switch with pixel moon/sun particles or a moving edge light (玻璃開關、日月粒子) | [Glass Light Toggle](subskills/glass-light-toggle/SKILL.md) |
| Make the actual page behind a glass overlay bend at its rim or show color dispersion (液態玻璃邊緣折射、色散) | [Liquid Glass edge refraction](assets/liquid-glass-edge-refraction/integration.md). Check the backdrop, browser support and CSP. |
| Build async action feedback, disclosures, tabs or other state transitions | [UI Transitions](subskills/ui-transitions/SKILL.md) and [Amicro](subskills/amicro-micro-transitions/SKILL.md) for action-specific button motion |
| Build admin tables, CRUD forms, settings or navigation | [Back-end UI](subskills/back-end-ui/SKILL.md) |
| Build agent chat, streaming, tool activity or approvals | [Agent UI](subskills/agent-ui/SKILL.md) |
| Choose a shader, WebGPU material, filter or GPU pointer effect | [GPU Effect](subskills/gpu-effect/SKILL.md) |
| Build an interactive line illustration | [Hairline Animations](subskills/hairline-animations/SKILL.md) |
| Build a spatial website or turn a focal-object image into a procedural model | [Website 3D](subskills/website-3d/SKILL.md), then [img2threejs](subskills/img2threejs/SKILL.md) for a suitable object image |
| Select a chart or visual report template | [Lieflat Charts](subskills/lieflat-charts/SKILL.md) for projects covered by its separate noncommercial terms |
| Check an implementation in the browser or verify an authorized release | [Verification](references/verification.md) |
| Save, find, or reuse an approved design method | [Design library](references/design-library.md) |

## Work on the actual product

1. Inspect the normal app entry, relevant routes, existing primitives and data/auth boundaries. Start with the accepted reference and the current product. A small repair usually needs a local change.
2. When the request calls for reusing a saved approach or would benefit from known patterns, search the approved design library for the current project and verify a matching payload. Use the current brief and product constraints to decide whether to adopt it.
3. Use the selected bundled skill's relevant examples and scripts. Keep page composition, control state, decorative effects and data/mutations separately owned. Use the host framework, tokens and dependencies unless the task calls for a change. For quick integration decisions, see [website motion](references/website-motion.md), [components and state](references/components-and-state.md), or [graphics and effects](references/graphics.md).
4. Validate the changed behavior through the normal product entry, including responsive and accessibility states that the change touches. Distinguish observed behavior from visual approval and from deployment status.

When the user asks only for discussion or review, stay within the requested scope. A visual asset, a saved pattern, or a previous approval does not grant permission to publish, deploy, change unrelated designs, or reuse project-specific code elsewhere. Pure backend work and standalone film production have their own workflows.
