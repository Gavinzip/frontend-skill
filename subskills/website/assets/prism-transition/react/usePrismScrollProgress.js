import { useEffect, useRef, useState } from 'react';

export const PRISM_SCROLL_PROGRESS_EVENT = 'website:prism-scroll-progress';

function clamp(value, minimum, maximum) {
  return Math.min(maximum, Math.max(minimum, value));
}

export function usePrismScrollProgress(enabled, sectionRef) {
  const progressRef = useRef(0);
  const [sceneState, setSceneState] = useState('source');

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || !enabled) {
      progressRef.current = 0;
      setSceneState('source');
      return undefined;
    }

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let updateFrame = 0;

    const updateProgress = () => {
      updateFrame = 0;
      const travelDistance = Math.max(1, section.offsetHeight - window.innerHeight);
      const rawProgress = clamp((window.scrollY - section.offsetTop) / travelDistance, 0, 1);
      const nextProgress = reducedMotion.matches ? (rawProgress >= 0.5 ? 1 : 0) : rawProgress;

      progressRef.current = nextProgress;
      section.style.setProperty('--prism-progress', nextProgress.toFixed(4));
      setSceneState((currentState) => {
        const nextState = nextProgress >= 0.999
          ? 'destination'
          : nextProgress <= 0.001
            ? 'source'
            : 'transitioning';
        return currentState === nextState ? currentState : nextState;
      });
      window.dispatchEvent(new CustomEvent(PRISM_SCROLL_PROGRESS_EVENT, { detail: nextProgress }));
    };

    const scheduleUpdate = () => {
      if (!updateFrame) updateFrame = window.requestAnimationFrame(updateProgress);
    };

    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate);
    reducedMotion.addEventListener('change', scheduleUpdate);
    updateProgress();

    return () => {
      window.cancelAnimationFrame(updateFrame);
      window.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('resize', scheduleUpdate);
      reducedMotion.removeEventListener('change', scheduleUpdate);
    };
  }, [enabled, sectionRef]);

  return { progressRef, sceneState };
}
