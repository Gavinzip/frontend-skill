# Verify the delivered frontend

Run the app from the checkout that contains the change, using its normal entry, routing, theme and permission model. Exercise the actual affected flow. For a mutation, observe the request, outcome, stored state and readback after refresh when applicable. Use temporary data only within the agreed environment and scope. A standalone component check is useful as evidence about that component.

- Compare the rendered route with the accepted design at relevant viewport sizes. Check layout overflow, click and touch targets, keyboard order, focus restoration, readable contrast and reduced-motion behavior.
- Exercise states introduced or changed by the task, including loading, empty, failure, retry, rapid re-entry and reverse motion where relevant. Observe requests, console and actual screen behavior. Check the effects of unmounting and resizing.
- For media or GPU changes, confirm that the intended frames are visible and that real media playback or a GPU-backed effect is running. Profile expensive work on the target browser/device where available. Record any untested condition.
- For an authorized production release, inspect emitted JavaScript and media sizes, hashed asset cache/compression, HTML/API/auth cache behavior, and live headers and timings. Verify the real user flow at the deployed URL.

Report observed behavior, validation limits and any change that still needs visual acceptance. Build and static checks are separate evidence from real interaction and deployment checks.
