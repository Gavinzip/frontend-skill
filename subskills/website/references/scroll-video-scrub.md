# Scroll-Controlled Video

Use this pattern when document/page scrolling controls an MP4 or WebM hero. It is not a replacement for the WebGL PRISM transition.

## Choose the Motion Contract

These are separate interaction modes. Select one from the user's description or the accepted reference before implementing:

- **Direct scrub:** every bounded document-scroll position maps to a media frame. When the user stops scrolling, the media stops at that exact progress.
- **Assisted completion:** a small downward or upward document-scroll displacement expresses intent. After the threshold is crossed, the media and document journey finish the full forward or reverse transition automatically. The user does not need to keep scrolling.

Descriptions such as “scroll follows the frame,” “frame by frame,” or “stop wherever I stop” mean direct scrub. Descriptions such as “a small scroll plays the rest,” “help finish the scroll,” or “one swipe opens and one swipe closes” mean assisted completion. Do not implement direct scrub and then approximate assisted completion by making the scroll range shorter.

## Shared Contract

- Native document scroll is the source of truth. Mouse wheel, trackpad, touch, keyboard, scrollbar dragging, and scripted navigation must resolve through the same selected motion contract and state transition.
- The stage is `fixed` or `sticky`; the journey is a normal page section with enough height to make the scrub inspectable.
- Scrolling down advances or completes the media and scrolling up reverses or closes it.
- Keep the scroll driver separate from the hero composition and avoid React state writes on every scroll event.
- Reduced-motion users receive stable endpoints. A directional gesture may switch endpoints immediately, but must not start timed autoplay or continuous scrubbing.

## Direct-Scrub Contract

- Keep the target time in a closure/ref and seek in one `requestAnimationFrame` callback.
- When scrolling stops, media progress remains at the bounded document-scroll progress.
- Preload and warm the decoder before expecting precise bidirectional seeking.

## Assisted-Completion Contract

- Use a small bounded displacement from the current endpoint to infer forward or reverse intent. Do not accumulate raw wheel deltas as animation progress.
- Once triggered, enter an explicit `playing` or `closing` state and ignore re-entry until the matching endpoint is reached.
- Play the selected forward or reverse media to completion and synchronize the document journey toward the same endpoint so the page feels as though it helps complete the scroll.
- A single upward gesture at the completed endpoint must run the full reverse transition. If a claim/form panel has its own scroll, let that panel consume its internal scroll before interpreting the gesture as close intent.
- Keep direct scrub and assisted completion as explicit configuration or separate hooks. Do not infer the mode from incidental media properties.
- A playback failure must remain visible and retryable. Do not silently jump to the endpoint as a fallback.

## Layout

```css
.video-journey { min-height: 220svh; }
.video-stage {
  position: sticky;
  top: 0;
  height: 100svh;
  overflow: clip;
}
.video-stage video,
.video-stage img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
```

Use a fixed backdrop only when the same media must remain behind multiple page sections. Otherwise prefer one sticky stage scoped to its journey.

## Direct-Scrub React Driver

Keep the scroll driver separate from the hero composition. The hook accepts a journey/container ref and a video ref; it does not own page copy, layout state, or poster rendering.

```jsx
function useScrollVideoScrub(journeyRef, videoRef, enabled = true) {
  useEffect(() => {
    if (!enabled || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const journey = journeyRef.current;
    const video = videoRef.current;
    if (!journey || !video) return;

    let raf = 0;
    let duration = 0;

    const sync = () => {
      raf = 0;
      const viewport = window.innerHeight || 1;
      const top = journey.getBoundingClientRect().top + window.scrollY;
      const travel = Math.max(1, journey.offsetHeight - viewport);
      const progress = Math.min(1, Math.max(0, (window.scrollY - top) / travel));
      const target = Math.min(Math.max(0, duration - 0.02), progress * duration);
      video.pause();
      if (Number.isFinite(target)) video.currentTime = target;
    };

    const requestSync = () => {
      if (!raf) raf = window.requestAnimationFrame(sync);
    };
    const onMetadata = () => {
      duration = Number.isFinite(video.duration) && video.duration > 0 ? video.duration : 0;
      requestSync();
    };

    video.addEventListener('loadedmetadata', onMetadata);
    window.addEventListener('scroll', requestSync, { passive: true });
    window.addEventListener('resize', requestSync);
    if (video.readyState >= 1) onMetadata();
    requestSync();

    return () => {
      if (raf) window.cancelAnimationFrame(raf);
      video.removeEventListener('loadedmetadata', onMetadata);
      window.removeEventListener('scroll', requestSync);
      window.removeEventListener('resize', requestSync);
    };
  }, [enabled, journeyRef, videoRef]);
}
```

## Mobile Decoding

Seeking may not visibly update on iOS or Android until media playback has been unlocked by a gesture. For coarse pointers:

1. Set `muted`, `playsInline`, and `webkit-playsinline`.
2. On the first `pointerdown` or `touchstart`, call `video.play()`.
3. Once it resolves, pause after a short timeout and restore the current target frame.
4. During later scrolls, briefly play/pause only when decoder warm-up is required.
5. If playback remains blocked, keep the stable entry frame visible and report the compatibility limitation. Do not claim the selected mode works on mobile without testing it.

Do not use the play/pause priming path on fine-pointer desktop devices unless evidence shows it is necessary.

## Media Preparation

- Ship a poster that matches the first frame so loading does not flash.
- Preload the poster and use `<video preload="auto" muted playsInline>` where the asset budget permits.
- Host large media on immutable CDN/R2 URLs, not inside an eager application bundle.
- Treat seekability as a source-asset contract. Inspect the actual sync-sample/keyframe interval before wiring a scroll driver: an MP4 made for normal playback can have a single keyframe across a short clip and will visibly jump no matter how often JavaScript writes `currentTime`.
- Encode every frame as a sync sample (all-I) for short, precision scrub clips. A practical upper bound is one keyframe every two frames only when real-browser testing proves that it remains continuous. Preserve the supplied source dimensions and validate visual fidelity before replacing an approved source; never silently trade image quality for seek speed.
- If an all-I export is not acceptable for the asset budget, request a purpose-made high-keyframe source or explicitly choose and label a lossless/near-lossless numbered image sequence. This is a delivery-mode decision, not a CSS or JavaScript fallback.
- If seeking remains visibly laggy after keyframe validation, switch delivery mode instead of adding more `currentTime` calls.
- A numbered sequence preserves the source cadence; it does not create more motion frames. If a 24fps source still reads as stepping, request a true 48/60fps export or use tested optical-flow interpolation. Adjacent-frame blending can smooth scroll positions, but it may ghost fine lines, so treat it as an aesthetic interpolation and inspect it visually before sign-off.
- In direct-scrub mode, keep the scroll range long enough that one normal wheel tick does not skip meaningful visual states. In assisted-completion mode, make the directional trigger small enough for one deliberate wheel/trackpad/touch gesture and keep the journey long enough to own both stable endpoints.

## Verification

Test the actual browser, not only a local build:

1. Direct scrub: test desktop at progress `0`, `0.25`, `0.5`, `0.75`, and `1`. Assisted completion: test that one small downward gesture reaches `1` without more input.
2. Reverse from the end. Direct scrub must return exact earlier frames; assisted completion must reach `0` after one small upward gesture.
3. Mouse wheel, trackpad, scrollbar drag, keyboard navigation, and touch.
4. Mobile after a first user gesture; confirm each scrub visibly changes the frame.
5. `prefers-reduced-motion`, network loading/poster handoff, and background tab behavior.
6. No React rerender loop, seek errors, or unbounded RAF after unmount.
7. Continuous real-device scrolling in both directions: make small successive wheel/trackpad movements and verify the *displayed frame* advances at each movement. A changing `video.currentTime` value alone is not evidence of smooth scrub.
8. Before sign-off, record the source duration, total frame count, sync-frame count, and maximum keyframe gap. A precision-scroll clip must not ship with a long-GOP or single-keyframe source.
9. When the page uses an opening loader, keep it below `100%` until the video has decoded and rendered the entry frame, plus every dependent render system has completed its own real warm-up frame.

If the implementation relies on a poster-only behavior or an image sequence, label it as that mode. Do not describe it as successful video scrubbing.
