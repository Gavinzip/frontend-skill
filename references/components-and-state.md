# Components and interaction state

## Start with the host primitives

Use the app's existing accessible controls, style system and dependencies. Select a component by the action and its states. For visual inspiration or a named React Bits component, follow its [official registry setup](https://reactbits.dev/get-started/mcp). Inspect the exact variant, source, dependencies and current [license](https://github.com/DavidHDev/react-bits/blob/main/LICENSE.md) before integrating into the application. Check container geometry, CSS ownership, hydration, cleanup and mobile cost. Keep decorative visuals separate from application logic.

## Map motion to meaning

| Intent | State and motion |
| --- | --- |
| Submit, save, copy, sign in or upload | Read the real outcome. Sequence `idle → pending → success/error`. Only the resolved operation may set success. Keep the target stable and guard duplicate actions where required. |
| Toggle or segmented choice | Animate the selected indicator when the underlying choice changes. Preserve the control's accessible selected state and keyboard behavior. |
| Popover, menu or dialog | Tie open/close to real visibility. Preserve dismissal, focus restoration and pointer/keyboard behavior through exit motion. |
| Tabs, step or detail pane | Move between semantic views without losing navigation, focus or input state. Keep the animation scoped to the changing region. |
| Loading, streaming or retry | Name the actual wait. Preserve the last useful content when appropriate. Distinguish pending, cancellation, disconnected and failed states. |

For async actions, keep mutation ownership in the feature and pass state and callbacks into the visual control. Handle retries and stale responses. Keep success feedback readable, announce consequential status changes to assistive tech, and reset transient status without clearing an unrelated action. Reduced motion should keep the same outcome and focus behavior.

## Admin and agent interfaces

Keep table columns, filters, pagination and selection owned by the relevant feature. Define loading, empty, failed and permission-denied views from real data. Keep unsaved form input during recoverable errors and confirm destructive actions with the affected records identified.

For chat, tool calls or agent workspaces, render real streaming and durable run states. Separate approval from execution and surface the scope and outcome of each proposed action. Represent failure and retries accurately. Preserve references and tool outputs with the correct provenance. Connect visual components to actual auth and data before running [verification](verification.md).
