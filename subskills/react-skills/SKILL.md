---
name: react-skills
description: Select and integrate React Bits components through the official public registry for React backgrounds, text effects, galleries and pointer interactions.
---

# ReactSkills

Choose the component by its role and the project's React, CSS, TypeScript and dependency conventions. Open the actual variant to check props, imports, licensing and defaults. Existing accepted custom components stay in the host project.

## Find the official component

Use the shadcn MCP when the current session already exposes it and its registry list includes `@react-bits`. Search or inspect the named variant. An available MCP is optional. The bundled read-only script can search or inspect the same official registry with Node.js 22+ and no shadcn setup. Run these commands from the installed `frontend` directory.

```sh
node subskills/react-skills/scripts/registry.mjs search "button"
node subskills/react-skills/scripts/registry.mjs view FuseButton-TS-CSS
```

Select an exact returned variant. `view` reports metadata and file paths. Inspect the source with the MCP or the CLI `view` before integrating. If the registry or selected variant is unavailable, report the error. The public skill does not include cached components, Pro assets or personal archives.

## Integrate in the target app

Merge `"@react-bits": "https://reactbits.dev/r/{name}.json"` into the app's existing `components.json` `registries` map. Preserve the existing aliases, styling and registry entries. For projects without shadcn configuration, choose the setup appropriate for that project's stack and scope.

Use the target project's package runner and explicit project directory. Inspect before installing. Never use an overwrite option unless the task authorizes replacing existing files.

```sh
npx shadcn@latest view @react-bits/FuseButton-TS-CSS --cwd /absolute/target-app
npx shadcn@latest add @react-bits/FuseButton-TS-CSS --dry-run --cwd /absolute/target-app
```

When the task calls for integration, install the chosen variant into the target app and inspect the actual files and dependencies. Connect effects to existing product state, verify reduced motion, containment, unmount cleanup and narrow screens. For a regular control or async feedback, use the host primitive and [UI Transitions](../ui-transitions/SKILL.md) when it fits the task.

- [React Bits registry and MCP setup](https://reactbits.dev/get-started/mcp)
- [shadcn CLI](https://ui.shadcn.com/docs/cli)
- [React Bits license](https://github.com/DavidHDev/react-bits/blob/main/LICENSE.md)
