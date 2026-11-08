# Shadcn Admin Source Patterns

Source: `satnaing/shadcn-admin` (MIT). It is a responsive, accessible dashboard UI collection built with Vite, React, TypeScript, Shadcn UI, Tailwind, and TanStack Router. Treat it as a pattern library, not a starter to transplant wholesale.

## Architecture to borrow

- Split application code into shared `components`, `config`, `context`, `features`, `hooks`, `lib`, `routes`, `stores`, and `styles`.
- Keep navigation configuration separate from the sidebar renderer.
- Keep data-table columns, filter controls, schemas, and dialogs in the feature that owns the resource.
- Use a router for route hierarchy and route-level composition; do not hide whole screens behind one dashboard component.

## Shell and navigation

- Pair a responsive sidebar with a thin header. On narrow viewports, expose navigation through an accessible sheet/drawer instead of leaving a compressed sidebar.
- Provide global command search, theme control, notifications, and profile actions in the shell.
- Support keyboard-first navigation and clear active-route indication.

## Screen patterns

| Need | Prefer |
| --- | --- |
| Operational overview | Metric cards, a focused chart, and a short actionable activity or exception list |
| Large resource list | Toolbar, filters, controllable columns, paginated/sortable table, selection, bulk actions |
| Record maintenance | A table or list plus a create/edit dialog, sheet, or dedicated detail route based on form complexity |
| Configuration | Grouped settings sections with explicit save state and clear impact copy |
| Account access | Isolated auth pages; do not couple them to the app shell |

## Source-specific caution

The upstream project carries customized Shadcn components for RTL and other behavior. Do not overwrite an existing project's primitives with those files just to match the reference. If RTL is required, audit direction-sensitive controls deliberately: dialogs, dropdowns, selects, tables, sheets, sidebars, calendars, switches, separators, scroll areas, and toast notifications.

## Useful dependency roles

- Shadcn/Radix: accessible primitives.
- TanStack Router: typed route structure.
- TanStack Table: controlled sorting, filters, selection, pagination, and columns.
- React Hook Form plus Zod: validated CRUD forms.
- React Query: server cache and mutations.
- Zustand/context: narrowly scoped shared client UI state.
- Recharts: purpose-driven charts.

Use the target project's equivalents when they already exist.
