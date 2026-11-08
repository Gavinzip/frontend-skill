---
name: amicro-micro-transitions
description: "Implement intent-aware React button and control micro-transitions inspired by Subhan-code/Amicro--Micro-transitions-, including Copy/Copied, sign-in success, submit, upload, download, toggle, destructive, and CTA animations. Use when button copy or interaction semantics should determine the animation, or when the user asks to reproduce an Amicro example exactly."
---

# Amicro Micro Transitions

Build a small, accessible state machine around one control. Read [interaction-catalog.md](references/interaction-catalog.md) before selecting or reproducing a pattern.

## Workflow

1. Inspect the target project's React version, styling system, icon library, motion dependency, component conventions, and existing button primitives.
2. Infer the action intent from the visible copy, icon, event, and completion state. Do not classify from copy alone when behavior is available.
3. Choose the closest pattern from the catalog. Ask only when two choices would communicate materially different outcomes.
4. Keep the reusable animated control, intent configuration, and feature-side async behavior in separate files. Do not put unrelated transitions into one switch-heavy application component.
5. Trigger success animation from the real operation result. Never show `Copied`, `Signed in`, `Uploaded`, or a check icon merely on hover.
6. Preserve button width where label changes would cause layout shift. Use `AnimatePresence` only for elements that actually enter or leave.
7. Support keyboard activation, touch, disabled and loading states, focus-visible styling, and `prefers-reduced-motion`.
8. Verify the interaction in a real browser at desktop and touch-sized viewports.

## Selection Modes

### Intent-matched mode

Adapt the visual treatment to the target product while preserving the catalog's semantic mapping and motion grammar. Prefer the project's installed `motion/react` or `framer-motion` import instead of adding a duplicate package.

### Exact Amicro mode

Use this mode when the user says exact, identical, 一模一樣, or names an Amicro example.

- Reproduce the pinned upstream implementation at commit `25216e5527be4ce47790047c377a1a2a07b0d373`.
- Read the bundled [AnimatedButton](examples/upstream/src/components/AnimatedButton.tsx), [button configurations](examples/upstream/src/data/buttons.tsx) and [code generator](examples/upstream/src/utils/codeGenerator.ts) for exact constants. The catalog also links to the pinned upstream card examples.
- Preserve spring stiffness, damping, offsets, delays, scale, duration, icon geometry, spacing, and state timing unless the target environment makes one value impossible.
- Keep attribution and the MIT notice when copying a substantial portion of upstream source.
- Report every deliberate deviation. Do not silently approximate an unavailable dependency with a fallback.

## State Rules

- Treat hover as preview only.
- Treat click/tap as intent.
- Treat resolved async state as success or failure.
- Reset transient success through an explicit timer owned by the feature or a reusable status hook; clear timers on unmount.
- Keep toggles persistent until the underlying state changes.
- Keep destructive actions visually cautionary before activation and confirm completion only after success.

## Dependencies

- Prefer `motion/react` for Motion 12 projects and `framer-motion` only when that is already the project convention.
- Prefer the existing icon set; Amicro uses `lucide-react`.
- Adapt Tailwind utilities to the target styling system without changing motion semantics.
- Do not introduce a fallback to conceal missing packages, unsupported APIs, or broken rendering. If any fallback is necessary, tell the user.

## Source and License

Pattern source: [Subhan-code/Amicro--Micro-transitions-](https://github.com/Subhan-code/Amicro--Micro-transitions-) by Syed Subhan Uddin. Retain the bundled [MIT notice](examples/upstream/LICENSE) when reusing its code. The exact examples depict visual states. Connect success and failure to the app's actual action when integrating them.
