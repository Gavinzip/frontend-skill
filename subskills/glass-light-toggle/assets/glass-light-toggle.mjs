const clamp = value => Math.min(1, Math.max(0, value));
const smooth = value => value * value * (3 - 2 * value);
const mix = (from, to, amount) => from + (to - from) * amount;
const prefix = 'glass-light-toggle';

function makeGlyphs() {
  const moon = [];
  const sun = [];
  for (let y = -8; y <= 8; y++) {
    for (let x = -8; x <= 8; x++) {
      const radius = Math.hypot(x, y);
      const crescent = Math.hypot(x + 0.3, y - 0.45) <= 6.2 && Math.hypot(x - 2.6, y + 2.7) > 5.35;
      const star = Math.abs(x - 6) + Math.abs(y + 6) <= 1 || (x === 2 && y === -7) || (x === 7 && y === -3);
      const spoke = (x === 0 || y === 0 || Math.abs(x) === Math.abs(y)) && radius >= 5 && radius <= 8;
      if (crescent || star) moon.push({ x, y, alpha: star ? 0.68 : 1 });
      if (radius <= 3.55 || spoke) sun.push({ x, y, alpha: 1 });
    }
  }

  const remaining = [...sun];
  const pairs = [];
  const move = [];
  for (const point of moon) {
    const same = remaining.findIndex(other => other.x === point.x && other.y === point.y);
    if (same >= 0) pairs.push([point, remaining.splice(same, 1)[0]]);
    else move.push(point);
  }
  const nearest = (point, choices) => choices.reduce((best, choice, index) => {
    const distance = (point.x - choice.x) ** 2 + (point.y - choice.y) ** 2;
    return distance < best.distance ? { distance, index } : best;
  }, { distance: Infinity, index: 0 }).index;
  for (const point of move) {
    if (remaining.length) pairs.push([point, remaining.splice(nearest(point, remaining), 1)[0]]);
    else pairs.push([point, { ...sun[nearest(point, sun)], alpha: 0 }]);
  }
  for (const point of remaining) pairs.push([{ ...moon[nearest(point, moon)], alpha: 0 }, point]);
  return pairs;
}

const particles = makeGlyphs();

function paintGlyph(context, width, height, progress) {
  context.clearRect(0, 0, width, height);
  const cell = Math.min(width, height) / 18.5;
  const tile = cell * 0.79;
  const x0 = (width - tile) / 2;
  const y0 = (height - tile) / 2;
  const blend = smooth(progress);
  const ink = [mix(255, 51, blend), mix(239, 41, blend), mix(218, 29, blend)].map(Math.round);
  context.fillStyle = `rgb(${ink.join(',')})`;

  // A faint stationary pixel grid shows through the dark face.
  for (let y = -6; y <= 6; y++) {
    for (let x = -6; x <= 6; x++) {
      if (Math.hypot(x, y) > 6.15) continue;
      context.globalAlpha = (1 - blend) * ((x + y) % 2 === 0 ? 0.12 : 0.055);
      context.fillRect(x0 + x * cell, y0 + y * cell, tile, tile);
    }
  }

  for (const [index, [from, to]] of particles.entries()) {
    const seed = ((index * 37) % 101) / 100;
    const delay = seed * 0.2;
    const phase = smooth(clamp((progress - delay) / 0.8));
    const arc = Math.sin(Math.PI * phase);
    const x = mix(from.x, to.x, phase) + Math.cos(index * 2.4) * arc * (0.8 + 2.2 * seed);
    const y = mix(from.y, to.y, phase) + Math.sin(index * 2.4) * arc * (0.8 + 2.2 * seed);
    const size = tile * (1 - 0.28 * arc);
    context.globalAlpha = clamp(mix(from.alpha, to.alpha, phase) * (1 - 0.22 * arc));
    context.shadowColor = '#ffc184';
    context.shadowBlur = cell * (1 - blend) * 0.8;
    context.fillRect(x0 + x * cell + (tile - size) / 2, y0 + y * cell + (tile - size) / 2, size, size);
  }
  context.shadowBlur = 0;
  context.globalAlpha = 1;
}

export function mountGlassLightToggle(button, {
  initialDark = true,
  onChange = () => {},
  onProgress = () => {},
} = {}) {
  const document = button.ownerDocument;
  const view = document.defaultView;
  const reduced = view.matchMedia('(prefers-reduced-motion: reduce)');
  const savedRole = button.getAttribute('role');
  const savedChecked = button.getAttribute('aria-checked');
  const art = document.createElement('span');
  art.setAttribute('aria-hidden', 'true');
  art.innerHTML = `
    <span class="${prefix}__track ${prefix}__track--night"></span>
    <span class="${prefix}__track ${prefix}__track--day"></span>
    <span class="${prefix}__thumb">
      <span class="${prefix}__material ${prefix}__material--night"></span>
      <span class="${prefix}__material ${prefix}__material--day"></span>
      <svg class="${prefix}__light" viewBox="0 0 200 200">
        <rect class="${prefix}__bloom" x="-6" y="-6" width="212" height="212" rx="65" pathLength="100" stroke-dasharray="32 68"/>
        <rect class="${prefix}__core" x="-6" y="-6" width="212" height="212" rx="65" pathLength="100" stroke-dasharray="32 68"/>
      </svg>
      <canvas class="${prefix}__pixels"></canvas>
      <span class="${prefix}__symbol"></span>
    </span>`;
  button.classList.add(prefix);
  button.setAttribute('role', 'switch');
  button.append(art);
  const canvas = art.querySelector('canvas');
  const symbol = art.querySelector(`.${prefix}__symbol`);
  const thumb = art.querySelector(`.${prefix}__thumb`);
  const rimSegments = art.querySelectorAll(`.${prefix}__light rect`);
  const context = canvas.getContext('2d');
  if (!context) button.setAttribute('data-static-symbol', '');

  let dark = Boolean(initialDark);
  let position = dark ? 0 : 1;
  let target = position;
  let velocity = 0;
  let frame = 0;
  let lastTime = 0;
  let gesture;
  let ignoreClick = false;

  function render() {
    button.style.setProperty('--p', position.toFixed(5));
    const rimOffset = String(-39 + position * 50);
    for (const rim of rimSegments) rim.setAttribute('stroke-dashoffset', rimOffset);
    if (context) paintGlyph(context, canvas.width, canvas.height, position);
    onProgress(position);
  }

  function resize() {
    const bounds = canvas.getBoundingClientRect();
    const ratio = Math.min(view.devicePixelRatio || 1, 2);
    const width = Math.max(1, Math.round(bounds.width * ratio));
    const height = Math.max(1, Math.round(bounds.height * ratio));
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }
    render();
  }

  function animate(now) {
    frame = 0;
    const step = Math.min(lastTime ? (now - lastTime) / 1000 : 1 / 60, 1 / 30) / 3;
    lastTime = now;
    for (let i = 0; i < 3; i++) {
      velocity += ((target - position) * 232 - velocity * 27) * step;
      position = clamp(position + velocity * step);
    }
    if (Math.abs(target - position) < 0.001 && Math.abs(velocity) < 0.025) {
      position = target;
      velocity = 0;
      lastTime = 0;
    } else {
      frame = view.requestAnimationFrame(animate);
    }
    render();
  }

  function stopAnimation() {
    if (frame) view.cancelAnimationFrame(frame);
    frame = 0;
    velocity = 0;
    lastTime = 0;
  }

  function settle() {
    if (reduced.matches) {
      stopAnimation();
      position = target;
      render();
    } else if (!frame && position !== target) {
      frame = view.requestAnimationFrame(animate);
    }
  }

  function syncState() {
    button.setAttribute('aria-checked', String(dark));
    symbol.textContent = dark ? '☾' : '☀';
  }

  function setDark(value, { notify = false } = {}) {
    const next = Boolean(value);
    const changed = next !== dark;
    dark = next;
    target = dark ? 0 : 1;
    syncState();
    if (!gesture?.dragged) settle();
    if (changed && notify) onChange(dark);
  }

  function pointerDown(event) {
    if (gesture || button.disabled || event.button !== 0 || !event.isPrimary) return;
    ignoreClick = false;
    const width = button.getBoundingClientRect().width;
    const initialInset = width * 0.028;
    const travel = Math.max(1, width - thumb.getBoundingClientRect().width - 2 * initialInset);
    gesture = { id: event.pointerId, start: event.clientX, origin: position, travel, dragged: false };
    button.setPointerCapture(event.pointerId);
    button.setAttribute('data-grabbed', '');
  }

  function pointerMove(event) {
    if (event.pointerId !== gesture?.id) return;
    const distance = event.clientX - gesture.start;
    if (!gesture.dragged && Math.abs(distance) < 5) return;
    gesture.dragged = true;
    stopAnimation();
    gesture.preview = clamp(gesture.origin + distance / gesture.travel);
    if (!reduced.matches) {
      position = gesture.preview;
      render();
    }
  }

  function pointerEnd(event) {
    if (event.pointerId !== gesture?.id) return;
    const { dragged, preview } = gesture;
    gesture = undefined;
    button.removeAttribute('data-grabbed');
    if (event.type === 'pointerup' && dragged) {
      ignoreClick = true;
      setDark(preview < 0.5, { notify: true });
    } else {
      settle();
    }
  }

  function click(event) {
    if (event.detail !== 0 && ignoreClick) {
      ignoreClick = false;
      return;
    }
    if (!button.disabled) setDark(!dark, { notify: true });
  }

  const listeners = [
    ['click', click], ['pointerdown', pointerDown], ['pointermove', pointerMove],
    ['pointerup', pointerEnd], ['pointercancel', pointerEnd], ['lostpointercapture', pointerEnd],
  ];
  for (const [event, fn] of listeners) button.addEventListener(event, fn);
  reduced.addEventListener('change', settle);
  const observer = new view.ResizeObserver(resize);
  observer.observe(button);
  syncState();
  resize();

  return {
    setDark,
    getDark: () => dark,
    destroy() {
      stopAnimation();
      observer.disconnect();
      reduced.removeEventListener('change', settle);
      for (const [event, fn] of listeners) button.removeEventListener(event, fn);
      if (gesture && button.hasPointerCapture(gesture.id)) button.releasePointerCapture(gesture.id);
      gesture = undefined;
      for (const [attribute, previous] of [['role', savedRole], ['aria-checked', savedChecked]]) {
        if (previous === null) button.removeAttribute(attribute);
        else button.setAttribute(attribute, previous);
      }
      button.removeAttribute('data-static-symbol');
      button.removeAttribute('data-grabbed');
      button.style.removeProperty('--p');
      button.classList.remove(prefix);
      art.remove();
    },
  };
}
