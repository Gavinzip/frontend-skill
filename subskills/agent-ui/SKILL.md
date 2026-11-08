---
name: agent-ui
description: Build or refine React AI-agent interfaces from a fully local catalog of 21 copy-paste primitives. Use for chat, streaming, approvals, tool activity, agent workspaces, data tables, and agent-control UI; do not use it for generic marketing pages or to fetch UI code from the web.
---

# React Agent UI

Use this skill as the local source of truth for React interfaces where an agent explains work, requests approval, exposes context, or lets a person steer it. The source code, support modules, design tokens, and component lookup data all live in this skill; do not browse or fetch a UI implementation from the original gallery.

## Start with the component lookup

Run the local finder before choosing a primitive:

```bash
node scripts/find-component.mjs "human approval before deleting files"
```

It returns the closest component, its exact local source path, behavior, required support files, and npm packages. For a complete intentional mapping of all 21 components, read [the catalog](references/component-catalog.md). For programmatic use, use `assets/component-manifest.json`.

Select the smallest primitive that matches the user-visible interaction:

- Long-running work or streamed responses: Loading State, Thinking, Streaming Text, Tool Chips, or Task Rows.
- Human control over an agent: Approval Card, Recommendation Card, Selection Actions, Prompt Bar, or Agent Screen.
- Agent data and retrieval surfaces: Context Cards, Diff Table, Records Table, Filter Table, Insight Cards, Code Block, or Fine-tune Card.
- Agent navigation and orchestration: Chat, Sidebar Nav, Search, or Flowchart.

Do not use a component merely because its demo resembles the request. Preserve the product's actual state model, permissions, labels, and error states.

## Integrate local source

The local React source tree is [assets/react-source](assets/react-source). It expects React, Tailwind CSS v4, and an `@/*` import alias rooted at the app source directory.

1. Read the chosen component and its row in the catalog. Copy only that file plus every listed local support file into the matching `components/` paths of the target app.
2. Add [tokens-and-keyframes.css](assets/react-source/styles/tokens-and-keyframes.css) to the target's global Tailwind v4 stylesheet. Preserve existing project tokens where they intentionally differ; map the required Agent UI tokens instead of overwriting an established system.
3. Install only the npm packages named in that component's manifest row. All other component code is already local.
4. Keep the component's `"use client"` directive when it uses effects, timers, portals, selection, or DOM measurement. Connect its sample data and demo timers to the app's real state before calling it production-ready.

The gallery's two remote demo-media defaults have intentionally been removed from the local source: `LoadingState` in `Surfer` mode now requires a caller-supplied local `videoSrc`, and `AgentScreen` starts with its built-in faux window unless the caller supplies `streamSrc`. No component in this skill makes a network request for gallery media.

## Boundaries that matter

- Each primitive is an interaction shell, not an API contract. Keep durable data fetching, mutations, authorization, and application state outside the visual component.
- The copied components intentionally include sample/demo transitions. Replace the simulated sequences with meaningful real states; do not leave a pretend completed task, approval, or source citation in a production UI.
- The bundled Approval Card's demo marks its answers sent immediately. In a real approval flow, show pending until the approval request resolves, keep the answers available on failure, and represent the approval and the authorized action's execution as separate states.
- Retain accessible controls and focus behavior when adapting dialogs, keyboard interactions, selection, or tables.
- The source snapshot is locally vendored under the included upstream MIT license. Retain [the license notice](assets/licenses/UPSTREAM-MIT-LICENSE.txt) whenever source is redistributed.

## Local inventory

```text
assets/react-source/components/        21 primary React primitives
assets/react-source/components/atoms/  local button, chips, shimmer, stream text
assets/react-source/components/primitives/GlideMenu.tsx
assets/react-source/styles/            Tailwind v4 tokens and keyframes
assets/component-manifest.json         component-to-code/dependency mapping
references/component-catalog.md        full human-readable catalog
scripts/find-component.mjs             local semantic finder
```
