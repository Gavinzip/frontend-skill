import { useThree } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import { PRISM_SCROLL_PROGRESS_EVENT } from './usePrismScrollProgress';

export function ScrollRenderDriver({ progressRef }) {
  const invalidate = useThree((state) => state.invalidate);
  const animationFrameRef = useRef(0);
  const runningRef = useRef(false);

  useEffect(() => {
    const renderWhileActive = () => {
      invalidate();
      const progress = progressRef.current;

      if (progress > 0.001 && progress < 0.999) {
        animationFrameRef.current = window.requestAnimationFrame(renderWhileActive);
        return;
      }

      runningRef.current = false;
      animationFrameRef.current = 0;
    };

    const requestRender = () => {
      invalidate();
      if (runningRef.current) return;
      runningRef.current = true;
      animationFrameRef.current = window.requestAnimationFrame(renderWhileActive);
    };

    window.addEventListener(PRISM_SCROLL_PROGRESS_EVENT, requestRender);
    requestRender();

    return () => {
      window.removeEventListener(PRISM_SCROLL_PROGRESS_EVENT, requestRender);
      window.cancelAnimationFrame(animationFrameRef.current);
    };
  }, [invalidate, progressRef]);

  return null;
}
