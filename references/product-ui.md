# Product UI and visual direction

## Start from the right surface

- For an existing product, identify the affected route, the normal path to reach it, and the accepted layout, content and business behavior. Reuse its primitives and design tokens. Inspect the actual page and state before diagnosing visual differences.
- For a new page or an authorized redesign, name the audience, top task, primary action and information hierarchy. Establish the hero, first proof, and next action before choosing decorative motion. For a reference match, record observable layout, typography, spacing, color, media treatment, density and interactions. Separate transferable design choices from the reference's brand assets and copy.
- Use a consistent icon set and optical size. Define text, spacing, radii, elevation and focus tokens before repeating ad hoc values. Check readable text and meaningful actions with motion turned off. Let content, hover and focus remain legible over media.

## Choose layout by task

| Surface | Decisions that matter |
| --- | --- |
| Landing page | Put the product and its main promise in the first viewport. Give the primary action a clear destination. Keep text and controls available while optional media loads. |
| Admin or settings | Keep shell, navigation and global utilities separate from feature data. Put page title and primary action ahead of filters and results. Choose a dialog, sheet or route based on form length and task context. |
| Data dashboard | State the question before choosing a chart. Provide units, date range, labels and a usable textual value. Choose a table for exact comparison or selection. Explain missing values as missing. |
| AI workspace | Distinguish user messages, model output, tool activity and approval. Preserve typed drafts, focus and scroll position while work streams. See [components and state](components-and-state.md). |
| Mobile or Expo | Use the project's existing platform primitives. Test safe areas, keyboard insets, system back, screen reader order, dynamic type and touch targets on the relevant platforms. Keep navigation and layout ownership separate from custom animation. |
| Figma handoff | Inspect the relevant frames, states, tokens, assets and component variants when access is available. Map them to the product's existing components and verify the rendered page. Preserve the actual product shell and data flow during review. |

For narrow screens, keep the primary action reachable, change navigation intentionally, and prioritize columns or use a detail view. Verify the result against the same user task at desktop and narrow widths. Apply [browser verification](verification.md) to the real route.
