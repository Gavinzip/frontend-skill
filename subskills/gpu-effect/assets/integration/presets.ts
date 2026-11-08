import type { PresetConfig } from 'shaders/js';

/** Example colors, not a user-approved style. Keep identity stable in React. */
export const calmGradient = {
  components: [{
    id: 'background',
    type: 'FlowingGradient',
    props: {
      colorA: '#101317', colorB: '#3e4650', colorC: '#929aa4',
      colorD: '#d6dce2', speed: 0.25, distortion: 0.35,
    },
  }],
} satisfies PresetConfig;

export const cursorRipples = {
  components: [{
    id: 'ripples', type: 'CursorRipples', props: { intensity: 0.15 },
    children: [{ id: 'background', type: 'LinearGradient',
      props: { colorA: '#0f172a', colorB: '#64748b' } }],
  }],
} satisfies PresetConfig;
