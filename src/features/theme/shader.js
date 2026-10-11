// WebGL shader layer for theme scenes: one full-screen fragment shader drawn
// on a canvas in the far plane of the 3D stage, behind the SVG art. Formless
// effects (fire, smoke, nebula, aurora, water, god rays) that SVG cannot do.
// Zero dependencies, GLSL ES 1.00 (runs on WebGL1 and WebGL2 contexts).
// Any failure (no WebGL, software renderer, compile error, lost context)
// returns null / calls onLost, and the scene simply renders without it.

import { isHex, toRgb } from '../../lib/color.js';

// Visual quality: render scale of the bitmap (CSS upscales it) and fps cap.
export const QUALITY = {
  off: null,
  low: { scale: 0.5, fps: 30 },
  high: { scale: 1, fps: 60 },
};

const VERTEX = 'attribute vec2 p; void main() { gl_Position = vec4(p, 0.0, 1.0); }';

// Shared helpers available to every scene shader: hash, value noise, fbm
// (5 octaves max), and dither() to hide banding in dark gradients.
const KIT = `
uniform vec2 u_res;
uniform float u_time;
float hash(vec2 p) { p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
}
const mat2 KIT_ROT = mat2(0.8, 0.6, -0.6, 0.8);
float fbm(vec2 p) {
  float f = 0.0, a = 0.5;
  for (int i = 0; i < 5; i++) { f += a * noise(p); p = KIT_ROT * p * 2.02; a *= 0.5; }
  return f / 0.96875;
}
vec3 dither(vec3 c) { return c + (hash(gl_FragCoord.xy + fract(u_time)) - 0.5) / 255.0; }
`;

// accent2 -> u_accent2, accentText -> u_accent_text
export const uniformName = (token) => `u_${token.replace(/[A-Z]/g, (c) => `_${c.toLowerCase()}`)}`;

// The full fragment source for a scene's shader definition: precision, the
// token uniforms it asked for, the kit, then the scene's own code (which
// defines main()).
export const fragmentSource = (def) =>
  `precision mediump float;\n${(def.uniforms || []).map((tk) => `uniform vec3 ${uniformName(tk)};`).join('\n')}\n${KIT}\n${def.frag}`;

let warned = false;

// Creates the layer on `canvas`, or returns null when it cannot run.
// Returns { draw(t, now), drawStill(t), resize(), dispose() }.
export const createShaderLayer = (canvas, def, tokens, quality, { onLost } = {}) => {
  const q = QUALITY[quality];
  if (!q || !def || !canvas || !Object.values(tokens || {}).every(isHex)) return null;
  const attrs = { alpha: false, antialias: false, depth: false, stencil: false, powerPreference: 'low-power', failIfMajorPerformanceCaveat: true };
  const gl = canvas.getContext('webgl2', attrs) || canvas.getContext('webgl', attrs);
  if (!gl) return null;
  let program;
  try {
    const compile = (type, src) => {
      const sh = gl.createShader(type);
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(sh));
      return sh;
    };
    program = gl.createProgram();
    gl.attachShader(program, compile(gl.VERTEX_SHADER, VERTEX));
    gl.attachShader(program, compile(gl.FRAGMENT_SHADER, fragmentSource(def)));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program));
  } catch (e) {
    if (!warned) console.error('[DB Theme Editor] scene shader failed to build; showing the scene without it.', e.message);
    warned = true;
    return null;
  }
  gl.useProgram(program);
  // One triangle covering the screen.
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(program, 'p');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  (def.uniforms || []).forEach((tk) => {
    const u = gl.getUniformLocation(program, uniformName(tk));
    if (u && isHex(tokens[tk])) gl.uniform3fv(u, toRgb(tokens[tk]).map((c) => c / 255));
  });
  const uRes = gl.getUniformLocation(program, 'u_res');
  const uTime = gl.getUniformLocation(program, 'u_time');
  const scale = q.scale * (def.scale || 1);
  const interval = 1000 / Math.min(q.fps, def.fps || q.fps);
  let last = -Infinity;
  let lost = false;

  const resize = () => {
    canvas.width = Math.max(1, Math.round((canvas.offsetWidth || window.innerWidth) * scale));
    canvas.height = Math.max(1, Math.round((canvas.offsetHeight || window.innerHeight) * scale));
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.uniform2f(uRes, canvas.width, canvas.height);
  };
  const render = (t) => {
    if (lost) return;
    gl.uniform1f(uTime, t);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };
  const onContextLost = (e) => {
    e.preventDefault();
    lost = true;
    if (onLost) onLost();
  };
  canvas.addEventListener('webglcontextlost', onContextLost);
  resize();
  return {
    // Called every animation frame; draws only as often as the fps cap allows.
    draw(t, now) {
      if (now - last < interval - 1) return;
      last = now;
      render(t);
    },
    drawStill: render,
    resize,
    dispose() {
      canvas.removeEventListener('webglcontextlost', onContextLost);
      const lose = gl.getExtension('WEBGL_lose_context');
      if (lose) lose.loseContext();
    },
  };
};
