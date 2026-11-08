# Amicro Interaction Catalog

## Contents

- Intent mapping
- Motion grammar
- Exact-source index
- Adaptation rules

## Intent mapping

| Intent or copy | Default transition | Before → after | Trigger and persistence |
| --- | --- | --- | --- |
| Copy, Copy hash, Copy link | `morph` | `Copy` → `Check`; `Copy` → `Copied` | Resolve `navigator.clipboard.writeText`; transient success |
| Sign in, Log in, Connect account | `morph` | `LogIn` or `User` → `UserCheck` or `Check` | Resolve authentication; persist through navigation or briefly confirm |
| Submit, Send | `morph` | `Send` → `Check` | Resolve request; transient success |
| Upload | `morph` | `Upload` → `Check` | Resolve upload; transient success |
| Download | `morph` | `Download` → `Check` | Start/resolve download; transient success |
| Save, Bookmark, Like, Favorite | `color-morph` | outline → filled/colored | Toggle state; persistent |
| Theme, mic, camera, volume, lock, visibility | `morph` | state A icon → state B icon | Toggle state; persistent |
| Settings, Reload | `rotate` | same icon rotates | Hover preview or activation |
| Delete, Remove | `shake` | same caution-colored icon | Hover preview; completion handled separately |
| Subscribe, Notify | `ring` | bell → ringing bell | Hover preview or resolved subscription |
| Sponsor, Love | `pulse` | outline/neutral → pulsing filled heart | Hover preview or toggle |
| Star on GitHub | `sparkle` | GitHub → colored star plus sparkles | Hover preview; click follows link |
| Primary CTA, Continue, Download for Mac | `slide-arrow` | leading icon → trailing arrow | Hover preview |
| Premium CTA or visual emphasis | `glare` | highlight sweeps surface | Hover preview |
| Directional text CTA | `text-reveal` | label shifts/reveals direction | Hover preview |
| Playful/high-touch CTA | `magnetic` | control follows pointer up to 35% delta | Pointer only; reset on leave |
| Share/link emphasis | `expand-ring` | ring expands around link icon | Hover preview |
| Related link group | `focus-blur` | siblings blur while target focuses | Hover/focus within group |

When copy and actual behavior disagree, follow behavior. For example, a `Copy` control must not show success until the clipboard operation succeeds.

## Motion grammar

- Base pill in upstream: height `36px`, horizontal padding `24px`, radius `40px`, `whileHover: { scale: 1.02 }`, `whileTap: { scale: 0.96 }`.
- Primary icon morph: start/exit at `scale: 0.5`, `opacity: 0`; animate to `scale: 1`, `opacity: 1`; spring `stiffness: 600`, `damping: 25`.
- Slide-arrow: horizontal offset `10px`, spring `600/25`; leading icon exits left and trailing icon enters right.
- Sparkle icon swap: vertical offset `15px`, scale `0.8`, spring `600/25`; sparkle delays `0.05s` and `0.1s`.
- Rotate: `180deg`, spring `stiffness: 400`, `damping: 25`.
- Shake: y sequence `[0,-2,0,-2,0]`, rotation `[0,-10,10,-10,0]`, duration `0.4s`.
- Pulse: scale `[1,1.25,1]`, duration `0.4s`, `easeInOut`.
- Magnetic pointer delta multiplier: `0.35`; reset to zero on pointer leave.
- Upstream touch preview remains visible for `500ms`. In intent-matched mode, use real operation state for success instead.

## Exact-source index

Pinned commit: `25216e5527be4ce47790047c377a1a2a07b0d373`.

- Runtime patterns: `src/components/AnimatedButton.tsx` at https://github.com/Subhan-code/Amicro--Micro-transitions-/blob/25216e5527be4ce47790047c377a1a2a07b0d373/src/components/AnimatedButton.tsx
- Intent/config examples: `src/data/buttons.tsx` at https://github.com/Subhan-code/Amicro--Micro-transitions-/blob/25216e5527be4ce47790047c377a1a2a07b0d373/src/data/buttons.tsx
- Copyable standalone templates: `src/utils/codeGenerator.ts` at https://github.com/Subhan-code/Amicro--Micro-transitions-/blob/25216e5527be4ce47790047c377a1a2a07b0d373/src/utils/codeGenerator.ts
- Card transitions: `src/components/cards/` at https://github.com/Subhan-code/Amicro--Micro-transitions-/tree/25216e5527be4ce47790047c377a1a2a07b0d373/src/components/cards
- License: https://github.com/Subhan-code/Amicro--Micro-transitions-/blob/25216e5527be4ce47790047c377a1a2a07b0d373/LICENSE

Exact reproduction means source-copy the selected pattern, not the whole playground. Exclude the gallery, layout switcher, sample data, Google GenAI dependency, and unrelated cards.

## Adaptation rules

- Preserve semantic state transitions before surface styling.
- Preserve the target component's public API and design tokens.
- Replace hard-coded colors with project tokens unless exact Amicro mode is requested.
- Keep one reusable primitive per transition family when several controls share it; keep async operations outside the primitive.
- Use stable keys for entering/exiting icons.
- Use `aria-live="polite"` for status copy when the success message is not otherwise announced.
- Under reduced motion, replace transforms with an immediate icon/text state change or a short opacity crossfade.
- Never use animation as the only signal for success, failure, disabled state, or destructive intent.
