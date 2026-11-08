---
name: website
description: "Apply the bundled website composition, motion, and admission-loading system when creating or redesigning websites, landing pages, hero sections, React frontends, and marketing pages. Covers reference-led heroes, entry animation, remote code-split readiness, scroll-controlled video modes, PRISM transitions, beams, marquees, and animated buttons."
---

# Website Motion System

Apply this skill with the active frontend-building skill. Treat the accepted concept or supplied reference as the visual source of truth; use these rules as defaults only where that source does not specify otherwise.

Read [patterns.md](references/patterns.md) before implementing a hero, entry animation, beam, logo marquee, or animated primary button.

For a scroll-controlled MP4/WebM hero, read [scroll-video-scrub.md](references/scroll-video-scrub.md) before planning or editing. First choose the interaction contract: **direct scrub** maps document-scroll progress to media time, while **assisted completion** uses a small directional document scroll as intent and then completes the bounded forward or reverse playback automatically. Do not mix the two modes.

For PRISM/prismatic dissolve, glowing tear, spark-edge, or scroll-scrubbed WebGL scene transitions, read [prism-transition.md](references/prism-transition.md) completely before planning or editing. Reuse the modular React/R3F starter in `assets/prism-transition/react/` when the target stack is compatible; adapt the image, scene ownership, quality tier, and event namespace instead of rebuilding the effect from scratch.

## Priority

1. Preserve explicit user requirements and an accepted/reference design.
2. Apply the entry-animation baseline to nearly every newly built website unless the user requests static or reduced motion.
3. Apply the remaining patterns only when the page contains the matching visual role.

## Workflow

1. For a hero request, identify `{app}`, `{name}`, and `{reference_site}`. Strongly prefer a supplied screenshot because a live reference may change, hide states, or be inaccessible.
2. Extract layout, typography, color, spacing, image treatment, icon style, CTA hierarchy, and motion cues from the reference. Recreate the design language without copying protected branding or unrelated copy.
3. Use one coherent icon family. Prefer the requested Iconify set; otherwise choose Lucide, Solar, HeroIcons, Iconoir, or Phosphor to match stroke, fill, and visual weight.
4. Build components with clear ownership: hero composition, entry-motion wrapper, beam decoration, logo marquee, and buttons remain separate reusable units.
5. For scroll-controlled video or PRISM, define the motion mode, scroll range, visual start/end frame, reverse-scroll behavior, reduced-motion behavior, mobile behavior, and performance tier before implementation.
6. For any experience that depends on remote media, code splitting, WebGL, or intensive rendering, define its admission-loading stages before implementation.
7. Implement and verify animation in a real browser on desktop, mobile, keyboard navigation, reverse scrolling, and reduced-motion settings.

## Complex Experience Admission Loading

For a complex visual entry, do not dismiss the loader because files merely exist, metadata exists, or a component mounted. Build one explicit admission gate and release only after every required stage is genuinely presentation-ready:

- Download: report real byte progress when response streams expose it; do not make a file-complete counter masquerade as continuous loading.
- Decode: wait for critical images to decode and each video to seek/render its required first frame. Preload a matching poster but do not treat the poster as proof that the video decoder is warm.
- Render: wait for the actual first paint. For WebGL, compile and render every expensive state the visitor will immediately encounter (for example start, active dissolve, endpoint, then the visible start state), including postprocessing and particles.
- Admission: only then set the experience-ready state. `100%` means the entry transition will begin immediately, not that background work will continue after release.

Expose an honest, legible loader:

- Display a numeric percentage and rail that advance continuously. A display value may smoothly trail measured work, but it must never exceed it.
- Cap at `99%` until the admission gate passes. Do not show a premature `100%`, then stall or hitch.
- Keep the fully prepared first frame visible while waiting; never use a blank fallback to conceal unfinished rendering.
- State the loading stages in code so they are inspectable in browser QA. Test cold load, cached load, slow network, first visit to each scroll range, reverse travel, and reduced motion.

## Remote Code-Split Admission

For a route that depends on a remote lazy chunk, CDN-hosted JavaScript/CSS, or a large runtime module:

- Publish content-hashed JS/CSS before deploying HTML that references them. Keep HTML and dynamic APIs on the application origin with `no-store`; give only immutable hashed assets a one-year cache policy.
- Start preloading the route chunk as soon as the route is entered, in parallel with initial data requests. Do not wait for those requests to finish before beginning the chunk download.
- Bound every lazy import with an explicit timeout and error boundary. Replace permanent Suspense/loading states with a legible failure message and a user-triggered Retry that starts a fresh page/module load. State clearly when no wallet request, mutation, or transaction occurred.
- A missing hashed asset must return a real `404` with the correct MIME type policy; never serve SPA `index.html` with `200` for a missing `.js` or `.css` URL.
- Static responses must report `Content-Length` for the actual transmitted representation, including precompressed Brotli/gzip files. Keep `Vary: Accept-Encoding` when negotiation is used.
- Verify the deployed HTML references the intended immutable origin, then check a representative large chunk for status, JavaScript MIME, CORS, `Content-Length`, immutable cache headers, content hash, and browser `nextHopProtocol` when HTTP/3 is required. Test cold load, warm load, throttled/failed chunk delivery, and explicit Retry in a real browser.
- Do not attribute a stalled loader to low-power mode, device speed, or an old cache without network evidence. Low-power scheduling may expose a race or timeout gap, but the actionable defect is the unbounded or invalid delivery path.

## Mandatory Entry Baseline

- Reveal the first viewport element by element with fade, slide, and blur resolving together.
- Use a restrained stagger that expresses hierarchy: navigation, headline lines, supporting copy, actions, proof, then hero media or decoration.
- Never use an initial or keyframe value of `opacity: 0`. Use a low nonzero opacity only when a fade is needed.
- For CSS Animations, use `animation-fill-mode: both`, never `forwards`.
- For Web Animations API, use `fill: "both"`, never `"forwards"`.
- For Motion/Framer Motion or GSAP, express the same pre-start and post-end persistence with that library's native lifecycle; do not add an invalid CSS-style `fill` option.
- Keep content readable before JavaScript hydrates. Do not hide the page behind a mounted-state gate.
- Respect `prefers-reduced-motion`; reveal content immediately without transform or blur.

## Pattern Routing

- Hero / 首屏: follow the reference-led hero instructions in `patterns.md`.
- Icons / 圖標: enforce a single Iconify family and consistent optical sizing.
- Entry / 進場: always apply the mandatory baseline unless explicitly overridden.
- Scroll video / 捲動影片: use `scroll-video-scrub.md` for a page-scroll-driven fixed or sticky video stage. Select direct scrub when every scroll position must address a frame; select assisted completion when one small directional scroll should finish the full forward or reverse sequence. This is for video playback or seeking, not WebGL PRISM transitions.
- PRISM / 溶解轉場: use the verified dual-render-target + HDR Bloom + GPU boundary-particle + native scroll-scrub system in `prism-transition.md`; do not approximate it with CSS masks, canvas CPU particles, a regular wipe, or a timed autoplay.
- Beam / 光束: connect the relevant source elements into the destination circle with path-based animated noodles, then add restrained sonar and orbit details.
- Social proof / logo 跑馬燈: use duplicated content, infinite marquee motion, and an alpha edge mask.
- Buttons / 按鈕: adapt the supplied main and secondary button code into project conventions; add a 1px animated border beam around the pill-shaped primary button on hover.

## Guardrails

- Do not add every pattern to every page. Presence follows content role; entry animation is the only broad default.
- Do not use continuous high-energy motion that competes with reading or calls to action.
- Do not animate layout-affecting properties when transform or opacity can express the same movement.
- Do not drive a video hero from an inner overflow container. In direct-scrub mode, map native document scroll to a bounded seek target and schedule it with `requestAnimationFrame`. In assisted-completion mode, use a small bounded document-scroll displacement only to infer direction, lock re-entry while the transition runs, and complete playback plus document travel to the matching endpoint. Never treat accumulated wheel delta as media progress.
- Do not mix icon families in one surface unless the reference intentionally does so.
- Do not paste UIVerse or CodePen code directly into production. Review its license, remove demo wrappers, isolate the reusable technique, convert it to project tokens, and preserve attribution when required.
- Do not call a CSS gradient, clip-path wipe, SVG mask, or uniform particle field a PRISM transition. The premium effect requires an irregular shared dissolve field, emissive layered boundary, particles attached to that boundary, and reversible scroll progress.
- Do not add GPU particle count to compensate for a weak boundary. Fix the dissolve field, edge temperature layers, Bloom, and timing first.
- Keep the WebGL subtree stable across ordinary React state changes. Explicitly own and dispose render targets, textures, RAFs, passes, and composers.
- Do not release an intro or complex scene while any required media decoder, render pipeline, or visible end-state is still warming. A loader is an admission gate, not decorative delay.
- Do not use fallback visuals to conceal broken motion, missing icons, or missing dependencies. Diagnose the actual cause and report any fallback that is genuinely required.
- Do not run `git push` without the user's approval.
