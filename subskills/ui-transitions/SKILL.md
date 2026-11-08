---
name: ui-transitions
description: Implement UI motion for real submit, save, copy, loading and disclosure states. Includes a framework-neutral async-action example and CSS with reduced-motion support.
---

# UI Transitions

Choose motion from the state change. Treat the host component and business operation as the state owners. Open a menu from the real expanded state, update a tab indicator after selection, and display success only after the action confirms it.

| State | Motion and behavior |
| --- | --- |
| Submit, save, copy, upload | Keep the control stable while pending. Show the actual result in a live status. Prevent duplicate submissions. Keep retry available after failure. |
| Disclosure, menu, modal | Use the existing semantic primitive. Keep focus and dismissal behavior attached to the host component. Animate its inner panel so the opening and closing styles do not control interaction semantics. |
| Tabs, text swap, loading | Scope motion to the changed area. Keep usable content visible while waiting when possible. Use the real loading condition and stable dimensions. |

For a simple DOM action, adapt [the JavaScript example](examples/async-action.mjs) and [its CSS](examples/async-action.css). In React or another framework, use the same state contract through the existing mutation and component lifecycle. The operation callback must reject on business failure and resolve only after confirmed success. Use a stable `role="status"` region and connect real strings, validation and error information from the app.

```js
import { bindAsyncAction } from './async-action.mjs';

const dispose = bindAsyncAction({
  button: saveButton,
  status: saveStatus,
  run: saveValidatedSettings,
  messages: { pending: 'Saving…', success: 'Saved', error: 'Save failed. Try again.' },
});
```

For a real form, retain its native validation and submission semantics. Adapt the state contract to its submit handler and let the feature own retries and input preservation. Call `dispose()` when removing the standalone control. Check keyboard activation, a rejected action, rapid clicks and reduced-motion behavior in the real route.

For an exact reference to a named transitions.dev example, inspect [the original project](https://github.com/Jakubantalik/transitions.dev) and confirm rights before importing its code. The example in this package is independently authored.
