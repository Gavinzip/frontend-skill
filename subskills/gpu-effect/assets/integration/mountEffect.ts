import {
  createShader,
  getWebGPUSupport,
  type PresetConfig,
  type ShaderInstance,
} from 'shaders/js';

export type EffectStatus =
  | { state: 'checking' | 'initializing' | 'ready' | 'paused' | 'recovering' }
  | { state: 'error'; reason: string };

export interface EffectOptions {
  onStatus?: (status: EffectStatus) => void;
}

export interface EffectController {
  ready: Promise<ShaderInstance | null>;
  update: (id: string, props: Record<string, unknown>) => void;
  destroy: () => void;
}

/** Browser-only. Copies into a project using shaders@4.0.0. */
export function mountEffect(
  canvas: HTMLCanvasElement,
  preset: PresetConfig,
  options: EffectOptions = {},
): EffectController {
  let instance: ShaderInstance | null = null;
  let disposed = false;
  let failed = false;
  let drewFirstFrame = false;
  let inView = true;
  let lastState: EffectStatus['state'] | undefined;
  const pending = new Map<string, Record<string, unknown>>();
  const ids = new Set<string>();
  function collectIds(components: PresetConfig['components']) {
    for (const component of components) {
      if (component.id) ids.add(component.id);
      if (component.children) collectIds(component.children);
    }
  }
  collectIds(preset.components);

  function report(status: EffectStatus) {
    if (disposed) return;
    if (status.state !== 'error' && status.state === lastState) return;
    lastState = status.state;
    if (status.state === 'error') console.error('[gpu-effect]', status.reason);
    options.onStatus?.(status);
  }

  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  function reconcile() {
    if (!instance || disposed || failed || !drewFirstFrame) return;
    if (motion.matches || document.hidden || !inView) {
      instance.pause();
      report({ state: 'paused' });
    } else {
      instance.resume();
      report({ state: 'ready' });
    }
  }
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) if (entry.target === canvas) inView = entry.isIntersecting;
    reconcile();
  });
  const resizeObserver = new ResizeObserver(entries => {
    if (!instance || disposed || failed) return;
    for (const entry of entries) {
      if (entry.target === canvas) {
        instance.resize(entry.contentRect.width, entry.contentRect.height);
      }
    }
  });
  observer.observe(canvas);
  resizeObserver.observe(canvas);
  motion.addEventListener('change', reconcile);
  document.addEventListener('visibilitychange', reconcile);

  function detach() {
    observer.disconnect();
    resizeObserver.disconnect();
    motion.removeEventListener('change', reconcile);
    document.removeEventListener('visibilitychange', reconcile);
  }
  function terminal(reason: string) {
    if (disposed || failed) return;
    failed = true;
    detach();
    report({ state: 'error', reason });
  }
  const terminalReasons = new Set([
    'unsupported', 'no-adapter', 'no-device', 'init-failed', 'device-lost',
    'out-of-memory', 'gpu-error', 'render-failed', 'limit-exceeded',
    'unrecoverable', 'rebuild_failed',
  ]);

  report({ state: 'checking' });
  const ready = (async () => {
    try {
      const support = await getWebGPUSupport();
      if (disposed) return null;
      if (!support.supported) {
        terminal(support.reason ?? 'GPU support probe returned no reason');
        return null;
      }
      report({ state: 'initializing' });
      const created = await createShader(canvas, preset, {
        disableTelemetry: true,
        observeElement: false,
        onReady() {
          drewFirstFrame = true;
          if (!failed) report({ state: 'ready' });
          reconcile();
        },
        onError(reason) {
          if (terminalReasons.has(reason) || instance?.getFailureReason()) {
            terminal(instance?.getFailureReason() ?? reason);
          } else {
            // Upstream can rebuild after transient device loss. This reports it.
            drewFirstFrame = false;
            report({ state: 'recovering' });
          }
        },
      });
      if (disposed) {
        created.destroy();
        return null;
      }
      instance = created;
      const failure = created.getFailureReason();
      if (failure || failed) {
        terminal(failure ?? 'GPU initialization failed');
        created.destroy();
        instance = null;
        return null;
      }
      for (const [id, props] of pending) created.update(id, props);
      pending.clear();
      // onReady may fire before createShader resolves. Still pause after frame 1.
      reconcile();
      return created;
    } catch (error) {
      terminal(error instanceof Error ? error.message : String(error));
      instance?.destroy();
      instance = null;
      return null;
    }
  })();

  return {
    ready,
    update(id, props) {
      if (disposed) throw new Error('Cannot update a destroyed GPU effect');
      if (failed) throw new Error('Cannot update a failed GPU effect');
      if (!ids.has(id)) throw new Error(`Unknown effect component id: ${id}`);
      if (instance) instance.update(id, props);
      else pending.set(id, { ...pending.get(id), ...props });
    },
    destroy() {
      if (disposed) return;
      disposed = true;
      detach();
      pending.clear();
      instance?.destroy();
      instance = null;
    },
  };
}
