---
name: hairline-animations
description: Choose, preview and integrate Hairline's 33 built-in interactive isometric line animations in React or DOM websites. Use for Hairline animations, a built-in figure catalog, subtle line illustrations, or a specific figure such as Settle, Riffle, Relay, Format or Slow. Includes an offline gallery, pinned MIT runtime and React lifecycle template. For a new custom figure, use hairline-create instead.
---

# Hairline built-in animations

Packages **@lucasmarkes/hairline 0.5.0**: real runtime, type declarations, original TypeScript in source maps, and MIT license. These are interactive illustrations; they do not generate a product story by themselves.

## Select by meaning

1. Inspect the target UI. Identify what the illustration explains, where it sits, and the reader's next action. Preserve accepted design and unrelated work.
2. Search the catalog in English or Chinese. Read the description: the actual gesture matters more than the name.

   ```sh
   node <skill-dir>/scripts/catalog.mjs list
   node <skill-dir>/scripts/catalog.mjs search 整理
   node <skill-dir>/scripts/catalog.mjs show settle
   ```

3. Preview candidates in a real browser using the offline gallery. It mounts one figure at a time, with intensity, theme and playback controls.

   ```sh
   node <skill-dir>/scripts/catalog.mjs preview --out <absolute-review-directory>
   python3 -m http.server 4332 --directory <absolute-review-directory> --bind 127.0.0.1
   ```

4. Choose the smallest illustration that communicates the intended relationship. **Settle** gathers crooked tiles into an organized tree; **Riffle** browses cards; **Format** aligns file lines; **Relay** highlights a branch path. A branching graph does not by itself describe a sequential process. If no built-in fits, explain the mismatch and use a product-specific sequence or route a single custom illustration to `hairline-create`.

All 33 exact descriptions and intensity behaviors are in [figures.json](references/figures.json). Search covers names, descriptions and curated tags.

## Integrate

- Read [integration.md](references/integration.md) for API, theme, SSR and package-manager guidance.
- Generate a minimal snippet with `node <skill-dir>/scripts/catalog.mjs snippet settle --react` (or `--vanilla`).
- For large or multiple figures, adapt [HairlineFigure.tsx](assets/react/HairlineFigure.tsx): import near the viewport, pause offscreen/in a hidden tab, destroy on unmount. Keep DOM-only code in the web/client boundary.
- Give the host a measurable width and **5:4 aspect ratio**. Set `--hairline-plate` to the actual background color: plates are opaque to hide lines behind them.
- Provide a localized accessible label. Essential information also belongs in normal text; built-in readouts are drawing measurements, not business state.
- Default to restrained intensity. Enable autonomous playback only when useful; honor reduced motion and review touch/keyboard access.
- Do not substitute another effect after an import/runtime error. Report the error and repair its cause.

## Verify and deliver

Run `node <skill-dir>/scripts/catalog.mjs verify` for vendored hashes and all 33 exports. Check project type/lint/build commands, real desktop/mobile rendering, stable layout, playback cleanup and reduced motion. Report which figures received visual review; importing every export is not visual QA. Show the final browser preview and distinguish local changes from deployment. Follow project approval and artifact-retention rules.

For an explicit library refresh, inspect the new official release, replace runtime/types/maps/license together, regenerate catalog/manifest, and verify again. Do not silently fetch latest or rewrite the user's lockfile.
