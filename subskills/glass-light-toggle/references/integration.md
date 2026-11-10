# Integrate the glass switch

Copy `assets/glass-light-toggle.mjs` and `assets/glass-light-toggle.css` to the feature. Load the CSS and pass an empty button to the module. The app retains ownership of persistence, system preference, initial rendering and theme changes elsewhere. The switch treats dark as the on state and uses dark on the left to match the reference.

```html
<button id="theme" type="button" aria-label="Dark mode"></button>
```

```js
import { mountGlassLightToggle } from './glass-light-toggle.mjs';

const toggle = mountGlassLightToggle(document.querySelector('#theme'), {
  initialDark: theme.get() === 'dark',
  onChange(dark) { theme.set(dark ? 'dark' : 'light'); },
});

// The existing provider should call this when the theme changes elsewhere.
toggle.setDark(theme.get() === 'dark');
// When removing the button, call toggle.destroy().
```

In React, mount on a `button` ref in a client effect. Keep the callback current through a ref if its identity changes. Sync provider state with `setDark` from a separate effect, and dispose of the mounted controller in the effect cleanup. Keep the button's accessible name and the app's theme state in the real component. The module uses `aria-checked` as the committed state. Optional `onProgress(p)` gives a decorative value from `0` for dark to `1` for light. It does not signal an app state change.

Set `--glass-switch-width` on the button to change its scale. The reference preview is deliberately large so the particle path is visible. A smaller control should still have a generous hit area and visible focus ring. Change the cool and warm rim colors in the stylesheet together with their glow. Draw the two glyphs in the same grid coordinate system so the particle mapping stays stable. Keep the decorative canvas out of the accessibility tree. A textual icon is available when Canvas 2D cannot initialize or forced colors are active. Reduced motion snaps to the selected endpoint.

The recreated geometry and interaction come from observing the original demo. This implementation uses original CSS, SVG paths and Canvas code. On integration, compare the actual backdrop and theme transition under rapid reversal and pointer cancellation. A release past the midpoint should commit the nearer theme, while returning to the starting half should retain the current state.
