# Website 3D scene contract

Create this document beside a substantial world before implementation. It converts an
interesting visual idea into a testable spatial experience.

## 1. Intent

```yaml
world_id: classroom-after-rain
purpose: editorial brand experience
audience: first-time visitors
primary_action: explore the programme
world_sentence: >-
  Travel from a rain-dark corridor into an evening classroom and end at the window,
  where the room becomes personal rather than institutional.
interaction_sentence: >-
  Scroll controls the route; local objects can reveal detail without changing camera travel.
topology: connected-sets # continuous-geography | connected-sets | layered-reveal
targets:
  minimum_device: iPhone 12 class and integrated laptop GPU
  viewports: [1440x900, 768x1024, 390x844]
  reduced_motion: composed-stills-and-semantic-story
rights:
  brand_assets: approved
  reference_images: list exact source and usage permission
```

## 2. Visual bible

Use numerical or named values that can be shared by scene modules. Do not write only
words such as “cinematic” or “premium.”

| system | decision | reason |
| --- | --- | --- |
| units | 1 unit = 1 metre; human proxy = 1.7 units | stable camera, light, and fog scale |
| silhouette | low ceiling, rectangular desks, tall rain windows | chapter identity at thumbnail size |
| palette | `worldDark`, `structureMid`, `readingLight`, `warmPractical`, `storyAccent` | roles survive chapter changes |
| materials | painted wall, matte wood, wet glass, brushed metal | each has its own PBR response |
| lens | FOV 36–50; eye line 1.55 m; copy-safe left zone | endpoints can be checked |
| lighting | cool window key, low fill, desk lamp practical | light explains place and focus |
| atmosphere | low rain, window streaks, dust only near lamp | depth without a screen overlay |
| motion | camera damp 5.2; pointer parallax <= 0.12 units | scroll remains primary |
| exclusions | no neon dashboard, no random bokeh, no unlicensed imagery | protects the direction |

## 3. Chapter ledger

Every row must differ in landmark, camera relationship, and world change—not only text.

| id | beat | landmark | camera position / target / FOV | mobile override | seam/occlusion | world state | DOM and foreground | assets |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| corridor | arrival | wet window at corridor end | `[0,1.6,8] / [0,1.6,-8] / 40` | pullback and 47 FOV | door shadow | cold key, rain `.25` | title / none | shell, rain |
| threshold | crossing | classroom door | `[...]` | `[...]` | doorframe | practical `.3`, fog `.01` | chapter copy / frame | door, room |
| desks | evidence | grouped desks | `[...]` | `[...]` | foreground desk edge | lamp `.8`, rain `.1` | caption / chair cutout | desks, lamp |
| blackboard | mechanism | board and pinned note | `[...]` | `[...]` | close pass | key `.55`, dust `.15` | explanation / none | board, note |
| window | payoff | rain-lit city | `[...]` | `[...]` | curtain or haze | warmer practical, rain `.4` | CTA / window edge | city, window |

For each chapter record `scrollWeight`, asset group, prefetch point, composed unavailable-asset
still, focus/interactions, exact availability range, readable copy zone, and retirement rule.

## 4. Camera ledger

List endpoints before generating curves.

| chapter | position | target | FOV | near/far | danger to test | mobile endpoint |
| --- | --- | --- | ---: | --- | --- | --- |
| corridor | `[0,1.6,8]` | `[0,1.6,-8]` | 40 | `.1 / 160` | ceiling clip | explicit value |

Check every segment for wall collision, near-plane clipping, target flips, acceleration spikes,
copy collision, tall-phone crop, and reverse-scroll readability. Create the final curve only
after every endpoint is composed and approved.

## 5. Asset and model ledger

| id | source/provenance | owner | transfer | decoded/GPU estimate | used by | prefetch | unavailable treatment |
| --- | --- | --- | ---: | ---: | --- | --- | --- |
| desk-hero | procedural factory + review record | models | code | geometry/material measure | desks | initial | simple desk kit + disclosed approximation |
| window-rain | authored texture | atmosphere | 320 KB | texture estimate | corridor/window | initial | static rain-free window |

Record rights and sources separately. Never call an opaque generated asset “original model”
without recording that it was generated and the tool/model used.

## 6. Interaction matrix

| id | 3D proxy | chapter range | hover/focus | activation | DOM equivalent | exit rule |
| --- | --- | --- | --- | --- | --- | --- |
| inspect-note | board-note-proxy | `2.1–3.2` | rim light and label | opens note panel | button with `aria-controls` | close on chapter exit |

## 7. Performance contract

```yaml
quality:
  mobile: { dpr: 1.35, shadows: 1024, particles: 0.45, post: lite }
  desktop: { dpr: 1.75, shadows: 2048, particles: 1.0, post: full }
budget:
  critical_transfer_mobile_mb: 5
  total_transfer_mobile_mb: 24
  draw_calls_mobile: 75
  draw_calls_desktop: 135
  visible_triangles_mobile: 240000
  visible_triangles_desktop: 850000
  target_frame_ms: 16.7
  fallback_frame_ms: 25
quality_reduction_order: [dpr, post, reflections, shadow_updates, lod, transparent_layers]
```

## 8. Review gates

Stop for review after world/story contract, graybox endpoints, one finished material/light
slice, first reversible seam, interaction plus DOM proxy, mobile quality tier, and the complete
journey. Do not burn the asset-production budget before the graybox route works.
