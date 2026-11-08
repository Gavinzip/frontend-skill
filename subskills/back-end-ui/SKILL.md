---
name: back-end-ui
description: Design, implement, or refactor polished responsive back-office, admin dashboard, and data-management interfaces. Use for React/TypeScript admin shells, navigation, data tables, CRUD forms, analytics pages, settings, user management, command search, and light/dark or RTL-ready UI. Apply the architecture and interaction patterns learned from satnaing/shadcn-admin while adapting to the host project's framework and existing design system.
---

# Back-end UI

Build a usable product surface, not a generic dashboard mockup. Preserve the host project's router, component system, data layer, and visual language unless the user explicitly asks to replace them.

## Work in layers

1. Inspect the existing app before choosing libraries or moving files. Reuse its routing, UI primitives, tokens, form validation, and query layer where possible.
2. Establish the shell first: persistent navigation, compact top bar, bounded content width, mobile navigation, global feedback, and theme handling. Keep the shell independent of individual feature data.
3. Implement each area as a feature module. Keep route composition, feature components, schemas/types, and API/query code separate. Do not place all dashboard screens in one page component.
4. Add real states for loading, empty, error, permission-denied, and destructive actions. Do not use fake fallback data to conceal missing or failing data.
5. Verify desktop, narrow viewport, keyboard navigation, focus behavior, contrast, and the project build/test commands relevant to the changed surface.

## Interface principles

- Optimize for information density without crowding: a clear page title and one primary action, then filters, summary metrics, and data content in a predictable order.
- Let navigation express information architecture. Group related sections, visually distinguish the active route, and make the collapsed sidebar still understandable through labels or tooltips.
- Use a data table only when people need to scan, filter, compare, select, or take bulk actions. For a small set of rich records, choose cards or a detail layout instead.
- Make filters, column visibility, sorting, pagination, row selection, and bulk actions explicit. Keep table state close to the feature, not the global shell.
- Put create/edit flows in a dialog, sheet, or dedicated route according to task complexity. Use schema-backed validation and preserve unsaved input during recoverable failures.
- Use charts to answer a named operational question. Always give metrics labels, time range, units, and an accessible textual value; avoid decorative charts.
- Treat command search, notifications, profile controls, and theme selection as global utilities. They must not own feature-specific business logic.
- Design responsive behavior deliberately: stack controls in a meaningful order, use a sheet/drawer for navigation, and preserve the primary task rather than merely shrinking the desktop layout.

## Source-inspired architecture

Use a feature-first structure such as:

```text
src/
  components/       # shared layout and UI primitives
  features/<area>/  # screen-specific UI, columns, schema, hooks, queries
  routes/           # route definitions and composition
  config/           # navigation and app-level configuration
  context|stores/   # genuinely shared UI state only
```

Avoid copying the source repository wholesale: it is a dashboard collection rather than a drop-in starter. Port only patterns that fit the target project. Read [references/source-patterns.md](references/source-patterns.md) when choosing layout, table, form, or accessibility details.

## Quality bar

- Use accessible primitives and semantic labels; every icon-only action needs an accessible name.
- Preserve focus on modal open/close and communicate async results with non-blocking feedback.
- Confirm destructive actions and identify the affected record(s) in the confirmation copy.
- Keep visual components presentational; put server interactions in feature hooks/services.
- Do not add a second router, styling system, state library, or authentication provider merely to imitate the reference project.
