// Particle engine for theme scenes: embers, petals, feathers, snow, sparks,
// fireflies and stars on one <canvas> behind the game. Three depths give
// parallax (near particles are bigger, faster, brighter and follow the
// pointer more); a slow gusting wind sways everything. The simulation is
// pure (createSystems / stepSystems) so it can be tested without a canvas.

import { isHex, luminance } from '../../lib/color.js';

// Per-theme particle systems. Colours are token names.
export const PARTICLES = {
  // Clean
  obsidian: [{ kind: 'mote', count: 40, colors: ['accent', 'text'] }],
  midnight: [{ kind: 'star', count: 140, colors: ['text', 'accent2'] }, { kind: 'meteor', count: 1, colors: ['accent'] }],
  crimson: [{ kind: 'ember', count: 50, colors: ['accent', 'danger'], speed: 0.7 }],
  verdant: [{ kind: 'leaf', count: 26, colors: ['accent', 'success'] }, { kind: 'firefly', count: 24, colors: ['warning'] }],
  sakura: [{ kind: 'petal', count: 70, colors: ['accent', 'text'] }],
  parchment: [{ kind: 'mote', count: 60, colors: ['warning', 'accent'], light: true }],
  graphite: [{ kind: 'mote', count: 50, colors: ['muted', 'accent'] }],
  snow: [{ kind: 'flake', count: 150, colors: ['accent', 'muted'] }],
  // Duel themes
  spell: [{ kind: 'spark', count: 60, colors: ['accent', 'accent2'] }],
  trap: [{ kind: 'ember', count: 40, colors: ['accent', 'accent2'], speed: 0.6 }],
  fusion: [{ kind: 'mote', count: 70, colors: ['accent', 'accent2'], swirl: true }],
  synchro: [{ kind: 'spark', count: 50, colors: ['text', 'accent2'], column: true }],
  xyz: [{ kind: 'star', count: 120, colors: ['accent', 'text'] }],
  link: [{ kind: 'mote', count: 50, colors: ['accent2', 'accent'] }],
  'white-dragon': [{ kind: 'flake', count: 70, colors: ['accent2', 'text'] }, { kind: 'flash', count: 1, colors: ['text'] }],
  'dark-magic': [{ kind: 'spark', count: 70, colors: ['accent2', 'accent'] }],
  'black-dragon': [{ kind: 'ember', count: 110, colors: ['accent', 'warning'] }, { kind: 'ash', count: 40, colors: ['muted'] }],
  millennium: [{ kind: 'mote', count: 90, colors: ['accent', 'warning'] }],
  pendulum: [{ kind: 'mote', count: 50, colors: ['self', 'accent'] }],
  divine: [{ kind: 'ember', count: 80, colors: ['accent', 'warning', 'opp'] }],
  'duel-disk': [{ kind: 'mote', count: 40, colors: ['accent', 'accent2'], light: true }],
  ritual: [{ kind: 'ember', count: 50, colors: ['accent2', 'accent'], speed: 0.5 }],
  'shadow-realm': [{ kind: 'firefly', count: 40, colors: ['accent', 'accent2'] }, { kind: 'ash', count: 30, colors: ['accent2'] }],
  // Archetypes
  branded: [{ kind: 'ember', count: 130, colors: ['accent2', 'accent', 'warning'] }, { kind: 'burst', count: 1, colors: ['accent2'] }],
  artmage: [{ kind: 'mote', count: 60, colors: ['accent', 'opp', 'accent2'] }],
  hero: [{ kind: 'star', count: 90, colors: ['text'] }, { kind: 'meteor', count: 1, colors: ['accent'] }],
  'sky-striker': [{ kind: 'spark', count: 40, colors: ['accent2', 'accent'], speed: 2 }],
  'snake-eye': [{ kind: 'ember', count: 120, colors: ['accent', 'accent2'] }, { kind: 'burst', count: 1, colors: ['accent'] }],
  labrynth: [{ kind: 'mote', count: 60, colors: ['accent2', 'warning'] }],
  blackwing: [{ kind: 'feather', count: 26, colors: ['accent'] }, { kind: 'star', count: 80, colors: ['text'] }, { kind: 'meteor', count: 1, colors: ['accent'] }],
  lightsworn: [{ kind: 'mote', count: 90, colors: ['warning', 'accent'], light: true, rise: true }],
  frog: [{ kind: 'firefly', count: 50, colors: ['warning', 'accent'] }],
  angelechy: [{ kind: 'feather', count: 22, colors: ['text', 'accent'] }, { kind: 'mote', count: 40, colors: ['accent', 'accent2'] }],
  mitsurugi: [{ kind: 'leaf', count: 26, colors: ['accent', 'accent2'] }, { kind: 'mote', count: 30, colors: ['accent2'] }],
  gladiator: [{ kind: 'mote', count: 80, colors: ['warning', 'accent'] }, { kind: 'ash', count: 30, colors: ['muted'] }],
};

// How each kind moves. speed in px/s at depth 1; size in px.
const KINDS = {
  ember: { dir: -1, speed: [40, 110], size: [1.2, 3.4], sway: 18, glow: 4, twinkle: 6 },
  ash: { dir: 1, speed: [12, 30], size: [1, 2.4], sway: 30, glow: 0, twinkle: 0 },
  spark: { dir: -1, speed: [60, 160], size: [1, 2.4], sway: 8, glow: 5, twinkle: 12 },
  petal: { dir: 1, speed: [28, 60], size: [5, 10], sway: 60, glow: 0, spin: 1.6, flutter: 2.2 },
  leaf: { dir: 1, speed: [24, 50], size: [7, 13], sway: 70, glow: 0, spin: 1.2, flutter: 1.6 },
  feather: { dir: 1, speed: [18, 40], size: [14, 26], sway: 90, glow: 0, spin: 0.7, flutter: 1.1 },
  flake: { dir: 1, speed: [20, 60], size: [1.5, 4.5], sway: 26, glow: 2, spin: 0.6 },
  mote: { dir: 0, speed: [6, 18], size: [1, 2.8], sway: 22, glow: 4, twinkle: 1.5 },
  firefly: { dir: 0, speed: [14, 34], size: [1.6, 3], sway: 40, glow: 7, twinkle: 2.4 },
  star: { dir: 0, speed: [0, 0], size: [0.5, 1.8], sway: 0, glow: 2, twinkle: 1.2 },
  meteor: { event: true, every: [5, 12] },
  flash: { event: true, every: [6, 14] },
  burst: { event: true, every: [7, 15] },
};

export const PARTICLE_KINDS = Object.keys(KINDS);

const rng = (seed) => () => {
  seed = (seed + 0x6d2b79f5) | 0;
  let r = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
  return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
};
const between = (r, [a, b]) => a + r() * (b - a);

// Particle counts are tuned for 1600x900; smaller screens get fewer.
const scaled = (count, w, h) => Math.max(1, Math.round(count * Math.min(1.4, Math.max(0.35, (w * h) / (1600 * 900)))));

const spawn = (p, sys, w, h, r, anywhere) => {
  const k = KINDS[sys.kind];
  p.z = 0.35 + r() * 0.65;
  p.size = between(r, k.size) * (0.55 + p.z * 0.6);
  p.speed = between(r, k.speed) * (sys.speed || 1) * (0.45 + p.z * 0.75);
  p.phase = r() * Math.PI * 2;
  p.spin = (r() - 0.5) * 2 * (k.spin || 0);
  p.rot = r() * Math.PI * 2;
  p.color = sys.colors[Math.floor(r() * sys.colors.length)];
  p.x = sys.column ? w * (0.4 + r() * 0.2) : r() * w;
  const dir = sys.rise ? -1 : k.dir;
  if (anywhere || dir === 0) p.y = r() * h;
  else p.y = dir < 0 ? h + 10 + r() * 40 : -10 - r() * 40;
  p.vx = (r() - 0.5) * p.speed;
  p.vy = (r() - 0.5) * p.speed;
};

// Builds the particle systems for a theme at the given size.
export const createSystems = (presetId, w, h, seed = 7) => {
  const r = rng(seed);
  return (PARTICLES[presetId] || []).map((cfg) => {
    const k = KINDS[cfg.kind];
    const sys = { ...cfg, r, particles: [], next: k.event ? between(r, [1.5, 4]) : 0, active: null };
    if (!k.event) {
      for (let i = 0; i < scaled(cfg.count, w, h); i++) {
        const p = {};
        spawn(p, sys, w, h, r, true);
        sys.particles.push(p);
      }
    }
    return sys;
  });
};

// A slow, gusting wind in px/s.
export const windAt = (t) => 14 * Math.sin(t * 0.13) + 7 * Math.sin(t * 0.37 + 1.3);

// Advances every system by dt seconds at time t (seconds).
export const stepSystems = (systems, dt, t, w, h) => {
  const wind = windAt(t);
  systems.forEach((sys) => {
    const k = KINDS[sys.kind];
    if (k.event) {
      if (sys.active) {
        sys.active.age += dt;
        if (sys.active.age > sys.active.life) sys.active = null;
      } else if ((sys.next -= dt) <= 0) {
        const r = sys.r;
        sys.next = between(r, k.every);
        if (sys.kind === 'meteor') sys.active = { age: 0, life: 1.1, x: w * (0.15 + r() * 0.6), y: h * r() * 0.3, angle: 0.5 + r() * 0.4, len: 180 + r() * 160, speed: 900 + r() * 500, color: sys.colors[0] };
        else if (sys.kind === 'flash') sys.active = { age: 0, life: 0.6, color: sys.colors[0] };
        else sys.active = { age: 0, life: 1.6, x: w * (0.2 + r() * 0.6), y: h * (0.55 + r() * 0.35), color: sys.colors[0], seeds: Array.from({ length: 26 }, () => [r() * Math.PI * 2, 60 + r() * 160]) };
      }
      return;
    }
    const dir = sys.rise ? -1 : k.dir;
    sys.particles.forEach((p) => {
      p.phase += dt * (k.twinkle || 1);
      p.rot += p.spin * dt;
      const sway = Math.sin(t * 0.8 + p.phase) * (k.sway || 0) * p.z;
      if (dir === 0) {
        // Wanderers turn slowly; swirlers orbit the centre.
        if (sys.swirl) {
          const a = Math.atan2(p.y - h / 2, p.x - w / 2) + Math.PI / 2;
          p.vx = Math.cos(a) * p.speed * 2;
          p.vy = Math.sin(a) * p.speed * 2;
        } else {
          const turn = Math.sin(t * 0.5 + p.phase * 3) * 0.9 * dt;
          const vx = p.vx * Math.cos(turn) - p.vy * Math.sin(turn);
          p.vy = p.vx * Math.sin(turn) + p.vy * Math.cos(turn);
          p.vx = vx;
        }
        p.x += (p.vx + wind * 0.3 * p.z) * dt;
        p.y += p.vy * dt;
      } else {
        p.x += (sway * 0.8 + wind * p.z) * dt;
        p.y += dir * p.speed * dt;
      }
      const out = p.x < -60 || p.x > w + 60 || p.y < -60 || p.y > h + 60;
      if (out) {
        if (dir === 0) {
          p.x = (p.x + w + 120) % (w + 120) - 60;
          p.y = (p.y + h + 120) % (h + 120) - 60;
        } else spawn(p, sys, w, h, sys.r, false);
      }
    });
  });
};

// ---------- drawing ----------

const SHAPE_PATHS = {
  petal: 'M0 -1C0.75 -0.85 0.85 0.35 0 1C-0.85 0.35 -0.75 -0.85 -0.16 -0.76L0 -1Z',
  leaf: 'M0 -1C0.6 -0.6 0.6 0.6 0 1C-0.6 0.6 -0.6 -0.6 0 -1ZM0 -1V1.2',
  feather: 'M0 -1C0.32 -0.5 0.3 0.5 0 1C-0.3 0.5 -0.32 -0.5 0 -1ZM0 -1.05V1.15',
};
// Parsed once, on first draw (Path2D exists only in the browser).
let shapes = null;
const shapeOf = (kind) => {
  if (!shapes) shapes = Object.fromEntries(Object.entries(SHAPE_PATHS).map(([k, d]) => [k, new Path2D(d)]));
  return shapes[kind];
};

// Glow sprites per colour; colour-picker drags would add one per tick, so
// the cache starts over once it holds more than a theme could use.
const sprites = new Map();
const MAX_SPRITES = 48;
const glowSprite = (hex) => {
  if (!sprites.has(hex)) {
    if (sprites.size >= MAX_SPRITES) sprites.clear();
    const c = document.createElement('canvas');
    c.width = 64;
    c.height = 64;
    const g = c.getContext('2d');
    const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, hex);
    grad.addColorStop(0.25, `${hex}aa`);
    grad.addColorStop(1, `${hex}00`);
    g.fillStyle = grad;
    g.fillRect(0, 0, 64, 64);
    sprites.set(hex, c);
  }
  return sprites.get(hex);
};

const drawSystems = (ctx, systems, tokens, t, w, h, px, py, light) => {
  ctx.clearRect(0, 0, w, h);
  systems.forEach((sys) => {
    const k = KINDS[sys.kind];
    if (k.event) {
      const a = sys.active;
      if (!a) return;
      const col = tokens[a.color];
      if (sys.kind === 'flash') {
        ctx.globalAlpha = 0.14 * (1 - a.age / a.life);
        ctx.fillStyle = col;
        ctx.fillRect(0, 0, w, h);
      } else if (sys.kind === 'meteor') {
        const d = a.age * a.speed;
        const x = a.x + Math.cos(a.angle) * d;
        const y = a.y + Math.sin(a.angle) * d;
        const grad = ctx.createLinearGradient(x, y, x - Math.cos(a.angle) * a.len, y - Math.sin(a.angle) * a.len);
        grad.addColorStop(0, col);
        grad.addColorStop(1, `${col}00`);
        ctx.globalAlpha = 1 - a.age / a.life;
        ctx.strokeStyle = grad;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x - Math.cos(a.angle) * a.len, y - Math.sin(a.angle) * a.len);
        ctx.stroke();
        ctx.drawImage(glowSprite(col), x - 10, y - 10, 20, 20);
      } else {
        // An ember burst: sparks thrown out and falling back.
        a.seeds.forEach(([ang, v]) => {
          const x = a.x + Math.cos(ang) * v * a.age;
          const y = a.y + Math.sin(ang) * v * a.age + 140 * a.age * a.age;
          ctx.globalAlpha = Math.max(0, 1 - a.age / a.life);
          ctx.drawImage(glowSprite(col), x - 6, y - 6, 12, 12);
        });
      }
      ctx.globalAlpha = 1;
      return;
    }
    ctx.globalCompositeOperation = light || sys.light ? 'source-over' : 'lighter';
    sys.particles.forEach((p) => {
      const col = tokens[p.color];
      // Depth parallax: far particles drift against the pointer, near ones with it.
      const x = p.x + px * 70 * (p.z - 0.45);
      const y = p.y + py * 44 * (p.z - 0.45);
      const tw = k.twinkle ? 0.6 + 0.4 * Math.sin(p.phase) : 1;
      const alpha = (0.3 + 0.7 * p.z) * tw;
      if (sys.kind === 'petal' || sys.kind === 'leaf' || sys.kind === 'feather') {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(p.rot);
        // Turning over in the air: the shape narrows and widens.
        ctx.scale(p.size * (0.25 + 0.75 * Math.abs(Math.cos(t * (k.flutter || 1) + p.phase))), p.size);
        ctx.globalAlpha = alpha * 0.85;
        ctx.fillStyle = col;
        const path = shapeOf(sys.kind);
        ctx.fill(path);
        if (sys.kind !== 'petal') {
          ctx.lineWidth = 0.08;
          ctx.strokeStyle = tokens.text;
          ctx.globalAlpha = alpha * 0.35;
          ctx.stroke(path);
        }
        ctx.restore();
        return;
      }
      if (sys.kind === 'flake' && p.size > 3) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(p.rot);
        ctx.globalAlpha = alpha;
        ctx.strokeStyle = col;
        ctx.lineWidth = 0.9;
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const a = (i * Math.PI) / 3;
          ctx.moveTo(0, 0);
          ctx.lineTo(Math.cos(a) * p.size * 1.6, Math.sin(a) * p.size * 1.6);
        }
        ctx.stroke();
        ctx.restore();
      }
      ctx.globalAlpha = alpha;
      // The nearest dots are out of focus: a soft disc, no sharp core.
      if (p.z > 0.9 && k.glow) {
        const g = p.size * k.glow * 1.8;
        ctx.globalAlpha = alpha * 0.55;
        ctx.drawImage(glowSprite(col), x - g, y - g, g * 2, g * 2);
        return;
      }
      if (k.glow) {
        const g = p.size * k.glow;
        ctx.drawImage(glowSprite(col), x - g, y - g, g * 2, g * 2);
      }
      ctx.fillStyle = col;
      ctx.beginPath();
      if (sys.kind === 'ember' || sys.kind === 'spark') ctx.ellipse(x, y, p.size * 0.7, p.size * 1.6, 0, 0, Math.PI * 2);
      else ctx.arc(x, y, p.size * 0.6, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  });
};

// Camera: the stage tilts toward the pointer (degrees at the window edge);
// with no pointer movement for a while it drifts slowly on its own.
const TILT_X = 4;
const TILT_Y = 6;
const IDLE_S = 4;
const RESIZE_MS = 200;

// Runs a theme's fx inside `root` (the stage from sceneMarkup): the camera
// tilt and the particle canvas, in one animation loop. Returns a stop
// function. Still (Motion off, or the system asks for reduced motion, even
// later on) draws one frame and redraws it only when the window resizes.
// Without particles the loop runs only while the camera is moving.
export const startFx = (root, presetId, tokens, { still = false } = {}) => {
  const stage = root && root.querySelector('.dbtefx-stage');
  const canvas = root && root.querySelector('.dbtefx-canvas');
  if (!stage || !Object.values(tokens || {}).every(isHex)) return () => {};
  const ctx = canvas ? canvas.getContext('2d') : null;
  const light = luminance(tokens.surface) > 0.4;
  const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
  const mql = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
  const isStill = () => still || (mql && mql.matches);
  let w = 0;
  let h = 0;
  let systems = [];
  let raf = 0;
  let t = 0;
  let last = 0;
  let px = 0;
  let py = 0;
  let tx = 0;
  let ty = 0;
  let idle = IDLE_S;

  const drawStill = () => {
    stage.style.transform = '';
    if (ctx) drawSystems(ctx, systems, tokens, 0, w, h, 0, 0, light);
  };
  // The canvas fills the (slightly oversized) stage: size its bitmap to its
  // own layout box so particles stay sharp.
  const resize = () => {
    w = (canvas && canvas.offsetWidth) || window.innerWidth;
    h = (canvas && canvas.offsetHeight) || window.innerHeight;
    if (ctx) {
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      systems = createSystems(presetId, w, h);
    }
    if (isStill()) drawStill();
  };
  let resizeTimer = 0;
  const onResize = () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, RESIZE_MS);
  };

  const frame = (now) => {
    raf = 0;
    if (isStill() || document.hidden) return;
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    t += dt;
    idle += dt;
    // The idle drift only runs alongside particles; a tilt-only scene settles and sleeps.
    const drift = ctx && idle > IDLE_S;
    const gx = drift ? 0.22 * Math.sin(t * 0.07) : tx;
    const gy = drift ? 0.14 * Math.cos(t * 0.05) : ty;
    px += (gx - px) * Math.min(1, dt * 2.5);
    py += (gy - py) * Math.min(1, dt * 2.5);
    stage.style.transform = `rotateX(${(-py * TILT_X).toFixed(3)}deg) rotateY(${(px * TILT_Y).toFixed(3)}deg)`;
    if (ctx) {
      stepSystems(systems, dt, t, w, h);
      drawSystems(ctx, systems, tokens, t, w, h, px, py, light);
    }
    const settled = Math.abs(gx - px) < 0.001 && Math.abs(gy - py) < 0.001;
    if (ctx || !settled) raf = requestAnimationFrame(frame);
  };
  const wake = () => {
    if (raf || isStill() || document.hidden) return;
    last = performance.now();
    raf = requestAnimationFrame(frame);
  };
  const onPointer = (e) => {
    tx = e.clientX / window.innerWidth - 0.5;
    ty = e.clientY / window.innerHeight - 0.5;
    idle = 0;
    wake();
  };
  const onVisibility = () => (document.hidden ? (cancelAnimationFrame(raf), (raf = 0)) : wake());
  const onMotionPref = () => {
    if (isStill()) {
      cancelAnimationFrame(raf);
      raf = 0;
      drawStill();
    } else wake();
  };

  resize();
  window.addEventListener('resize', onResize);
  window.addEventListener('pointermove', onPointer, { passive: true });
  document.addEventListener('visibilitychange', onVisibility);
  if (mql && mql.addEventListener) mql.addEventListener('change', onMotionPref);
  if (isStill()) drawStill();
  else wake();
  return () => {
    cancelAnimationFrame(raf);
    clearTimeout(resizeTimer);
    window.removeEventListener('resize', onResize);
    window.removeEventListener('pointermove', onPointer);
    document.removeEventListener('visibilitychange', onVisibility);
    if (mql && mql.removeEventListener) mql.removeEventListener('change', onMotionPref);
    stage.style.transform = '';
    if (ctx) ctx.clearRect(0, 0, w, h);
  };
};
