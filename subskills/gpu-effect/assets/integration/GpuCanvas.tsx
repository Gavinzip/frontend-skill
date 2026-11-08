'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import type { PresetConfig } from 'shaders/js';
import { mountEffect, type EffectStatus } from './mountEffect';

export interface GpuCanvasProps {
  preset: PresetConfig;
  ariaLabel?: string;
  className?: string;
  style?: CSSProperties;
  onStatus?: (status: EffectStatus) => void;
}

export function GpuCanvas({
  preset, ariaLabel, className, style, onStatus,
}: GpuCanvasProps) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const callback = useRef(onStatus);
  callback.current = onStatus;
  const [status, setStatus] = useState<EffectStatus>({ state: 'checking' });

  useEffect(() => {
    if (!canvas.current) return;
    const effect = mountEffect(canvas.current, preset, {
      onStatus(next) {
        setStatus(next);
        callback.current?.(next);
      },
    });
    return () => effect.destroy();
  }, [preset]);

  return (
    <div className={className} style={{ position: 'relative', height: 320, ...style }}>
      <canvas ref={canvas} role={ariaLabel ? 'img' : undefined}
        aria-label={ariaLabel} aria-hidden={ariaLabel ? undefined : true}
        style={{ display: 'block', width: '100%', height: '100%' }} />
      {status.state === 'error' && (
        <p role="status" style={{ position: 'absolute', inset: 16 }}>
          此裝置目前無法顯示這個動態效果。
        </p>
      )}
    </div>
  );
}
