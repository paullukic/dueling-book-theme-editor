import { mix } from '../../../lib/color.js';
import { H, n1, rng, W } from './kit.js';

// Mermail: the drowned halls of Atlantis. Light falls in shafts from a
// rippling surface far above (the shader layer); the seabed holds a domed
// temple and broken colonnades; Abyssmegalo, the armoured shark of the
// Mermail, glides past the temple on the right, a Mermail gold trident
// planted before the steps. Kelp sways at the edges and bubbles climb.
const mermail = (t) => {
  const rand = rng(53);
  const deep = mix(t.bg, '#000000', 0.25);
  const water = mix(t.bg, t.accent, 0.2);
  const stone = mix(t.bg, t.accent, 0.3);
  const stoneLit = mix(t.accent, t.text, 0.35);
  const silver = mix(t.text, t.accent, 0.25);
  const gold = t.accent2;
  const gem = t.danger;

  // Seabed ridge and a far colonnade on the left.
  const ridge = (y0, amp, seed) => {
    const r = rng(seed);
    let d = `M-40 ${H + 40}V${y0}`;
    for (let x = -40; x <= W + 40; x += 80) d += `L${x} ${n1(y0 + (r() - 0.5) * amp)}`;
    return `${d}V${H + 40}Z`;
  };
  const column = (x, base, h, w, broken) => {
    const top = base - h;
    const cap = broken ? '' : `<path d="M${n1(x - w * 0.9)} ${n1(top)}h${n1(w * 1.8)}v${n1(-w * 0.35)}h${n1(-w * 1.8)}Z"/>`;
    const brk = broken ? `L${n1(x + w / 2)} ${n1(top + 8)}L${n1(x + w * 0.1)} ${n1(top - 6)}L${n1(x - w * 0.2)} ${n1(top + 4)}` : `L${n1(x + w / 2)} ${n1(top)}L${n1(x - w / 2)} ${n1(top)}`;
    const flutes = `<path d="M${n1(x - w * 0.18)} ${n1(base)}V${n1(top + 10)}M${n1(x + w * 0.18)} ${n1(base)}V${n1(top + 10)}" stroke="${deep}" stroke-opacity="0.45" stroke-width="${n1(w * 0.08)}"/>`;
    return `<path d="M${n1(x - w / 2)} ${base}L${n1(x - w / 2)} ${n1(top)}${brk}L${n1(x + w / 2)} ${base}Z"/>${cap}${flutes}<path d="M${n1(x - w * 0.36)} ${base}V${n1(top + 6)}" stroke="${stoneLit}" stroke-opacity="0.22" stroke-width="${n1(w * 0.14)}"/>`;
  };

  // The domed temple on the right, lit from above.
  const temple = (cx, base, k) => {
    const s = (v) => n1(v * k);
    let cols = '';
    [-150, -90, -30, 30, 90, 150].forEach((dx, i) => {
      cols += column(cx + s(dx), base - s(24), s(i === 5 ? 120 : 190), s(26), i === 5);
    });
    let ribs = '';
    for (let i = -2; i <= 2; i++) ribs += `M${n1(cx + s(i * 34))} ${n1(base - s(262))}Q${n1(cx + s(i * 22))} ${n1(base - s(330))} ${cx} ${n1(base - s(358))}`;
    return `<path d="M${n1(cx - s(96))} ${n1(base - s(234))}V${n1(base - s(262))}A${s(96)} ${s(96)} 0 0 1 ${n1(cx + s(96))} ${n1(base - s(262))}V${n1(base - s(234))}Z"/>
<path d="${ribs}" fill="none" stroke="${stoneLit}" stroke-opacity="0.22" stroke-width="2"/>
<path d="M${n1(cx - s(8))} ${n1(base - s(356))}h${s(16)}v${s(-22)}h${s(-16)}Z"/>
<path d="M${n1(cx - s(200))} ${base}h${s(400)}v${s(-12)}h${s(-14)}v${s(-12)}h${s(-372)}v${s(12)}h${s(-14)}Z"/>
<path d="M${n1(cx - s(190))} ${n1(base - s(214))}h${s(310)}l${s(-30)} ${s(-20)}h${s(-250)}Z"/>
<path d="M${n1(cx - s(170))} ${n1(base - s(234))}L${cx} ${n1(base - s(300))}L${n1(cx + s(60))} ${n1(base - s(270))}L${n1(cx + s(40))} ${n1(base - s(252))}L${n1(cx + s(90))} ${n1(base - s(234))}Z"/>
${cols}
<path d="M${n1(cx - s(96))} ${n1(base - s(262))}A${s(96)} ${s(96)} 0 0 1 ${n1(cx + s(96))} ${n1(base - s(262))}M${n1(cx - s(170))} ${n1(base - s(234))}L${cx} ${n1(base - s(300))}M${n1(cx - s(200))} ${base}h${s(400)}" fill="none" stroke="${stoneLit}" stroke-opacity="0.35" stroke-width="2"/>`;
  };

  // Abyssmegalo: an armoured shark, side view, swimming left. Local units,
  // snout at 0,0; the tail turns from the peduncle at 460,0.
  const shark = (x, y, k) => `<g transform="translate(${x} ${y}) scale(${k})">
<g style="animation: dbtefx-mm-glide 14s ease-in-out infinite;">
<g style="transform-origin: 456px 0px; animation: dbtefx-mm-tail 3.2s ease-in-out infinite;"><path d="M452 -7C478 -42 502 -92 532 -126C526 -84 520 -44 522 -4C528 12 538 32 552 58C522 44 490 22 452 7Z" fill="${mix(deep, t.accent, 0.14)}"/><path d="M452 -7C478 -42 502 -92 532 -126" fill="none" stroke="${stoneLit}" stroke-opacity="0.5" stroke-width="2"/></g>
<path d="M186 -66C204 -110 226 -140 254 -150C246 -120 252 -86 276 -58Z" fill="${mix(deep, t.accent, 0.12)}"/><path d="M186 -66C204 -110 226 -140 254 -150" fill="none" stroke="${stoneLit}" stroke-opacity="0.6" stroke-width="2"/>
<path d="M380 -22C388 -36 396 -42 406 -46C402 -34 404 -24 412 -16ZM300 38C316 56 332 64 348 68C342 52 336 42 330 34ZM372 22C382 34 392 40 404 42C398 30 394 22 390 14Z" fill="${mix(deep, t.accent, 0.14)}"/>
<path d="M0 4C8 -22 56 -56 140 -64C220 -70 310 -50 380 -22C410 -14 440 -8 460 -6V6C420 12 360 36 280 54C210 68 140 66 80 46C40 34 14 20 0 4Z" fill="url(#dbtefx-mm-skin)"/>
<path d="M0 4C14 20 40 34 80 46C140 66 210 68 280 54C330 42 380 26 420 12C360 16 300 30 240 36C170 40 100 34 60 24C34 18 14 10 0 4Z" fill="${mix(t.text, t.accent, 0.45)}" fill-opacity="0.38"/>
<path d="M0 4C8 -22 56 -56 140 -64C220 -70 310 -50 380 -22C410 -14 440 -8 460 -6" fill="none" stroke="${stoneLit}" stroke-opacity="0.6" stroke-width="2.4"/>
<path d="M14 14L76 30" fill="none" stroke="${deep}" stroke-width="3.4" stroke-linecap="round"/><path d="M24 17l4 5l3 -4l4 5l3 -4l4 5l3 -4l4 5l3 -4" fill="none" stroke="${silver}" stroke-opacity="0.55" stroke-width="1.4"/>
<path d="M104 -6q-5 14 0 30M114 -8q-5 15 0 32M124 -9q-5 16 0 34M134 -9q-5 16 0 34M144 -8q-5 15 0 32" fill="none" stroke="${deep}" stroke-opacity="0.7" stroke-width="2.4" stroke-linecap="round"/>
<path d="M140 44C164 76 190 106 226 128C212 98 206 72 206 48Z" fill="${mix(deep, t.accent, 0.15)}"/>
<path d="M140 44C164 76 190 106 226 128" fill="none" stroke="${stoneLit}" stroke-opacity="0.45" stroke-width="1.6"/>
<path d="M6 -4C20 -30 62 -56 128 -64L140 -22C100 -18 60 -12 26 0Z" fill="url(#dbtefx-mm-steel)"/>
<path d="M26 0C60 -12 100 -18 136 -22" fill="none" stroke="${gold}" stroke-width="3"/>
<path d="M84 -56C92 -78 106 -94 128 -102C120 -84 118 -70 122 -60Z" fill="url(#dbtefx-mm-gold)"/>
<path d="M78 -30q8 -12 20 -6q-4 10 6 12" fill="none" stroke="${gold}" stroke-opacity="0.8" stroke-width="2"/>
<circle cx="56" cy="-12" r="9" fill="${deep}" stroke="${gold}" stroke-width="2.4"/><circle cx="56" cy="-12" r="5" fill="${gem}"/><circle cx="54.4" cy="-13.6" r="1.6" fill="#ffffff" fill-opacity="0.85"/>
<path d="M150 -10C176 -24 214 -24 236 -8C232 18 206 40 168 40C154 30 148 10 150 -10Z" fill="url(#dbtefx-mm-steel)" stroke="${gold}" stroke-width="2.4"/>
<path d="M170 0q16 -12 34 -2q-10 14 6 20" fill="none" stroke="${gold}" stroke-width="2"/><circle cx="196" cy="10" r="5" fill="${gem}" stroke="${gold}" stroke-width="1.6"/>
<path d="M296 -56l16 -8l-2 18M344 -38l14 -8l0 16" fill="${gold}"/>
</g></g>`;

  // The trident planted before the temple steps.
  const trident = (x, y, k) => `<g transform="translate(${x} ${y}) rotate(-8) scale(${k})" fill="url(#dbtefx-mm-gold)">
<path d="M-5 0V-250h10V0Z"/><path d="M-9 -150h18v8h-18ZM-9 -60h18v8h-18Z"/><path d="M-30 -250Q-30 -270 -16 -276Q-24 -262 -20 -252H20Q24 -262 16 -276Q30 -270 30 -250Q16 -244 0 -244Q-16 -244 -30 -250Z"/>
<path d="M-4 -270L0 -330L4 -270ZM-24 -268L-30 -318L-16 -276ZM24 -268L30 -318L16 -276Z"/><circle cx="0" cy="-252" r="5" fill="${gem}"/></g>`;

  // Kelp at both edges: tall fronds rooted below the frame.
  const kelp = (x, h, lean, delay) => {
    let d = `M${x} ${H + 20}`;
    let leaves = '';
    for (let i = 1; i <= 6; i++) {
      const y = H + 20 - (h * i) / 6;
      const xx = x + Math.sin(i * 0.9) * 18 + lean * i * 6;
      d += `L${n1(xx)} ${n1(y)}`;
      if (i > 1) leaves += `M${n1(xx)} ${n1(y)}q${i % 2 ? 26 : -26} -10 ${i % 2 ? 34 : -34} -36q${i % 2 ? -14 : 14} 18 ${i % 2 ? -34 : 34} 36Z`;
    }
    return `<g style="transform-origin: ${x}px ${H + 20}px; animation: dbtefx-reed ${n1(7 + delay)}s ease-in-out ${n1(-delay * 2)}s infinite;"><path d="${d}" fill="none" stroke="url(#dbtefx-mm-kelp)" stroke-width="7" stroke-linecap="round"/><path d="${leaves}" fill="url(#dbtefx-mm-kelp)"/></g>`;
  };

  // Bubble trains rising from the ruins.
  let bubbles = '';
  for (let i = 0; i < 12; i++) {
    const x = i < 6 ? 1120 + rand() * 260 : 80 + rand() * 300;
    const y = 760 + rand() * 80;
    const r = n1(3 + rand() * 7);
    bubbles += `<g style="animation: dbtefx-mm-rise ${n1(9 + rand() * 7)}s linear ${n1(-rand() * 16)}s infinite;"><circle cx="${n1(x)}" cy="${n1(y)}" r="${r}" fill="url(#dbtefx-mm-bub)" stroke="${t.text}" stroke-opacity="0.45" stroke-width="1"/><circle cx="${n1(x - r * 0.35)}" cy="${n1(y - r * 0.35)}" r="${n1(r * 0.25)}" fill="#ffffff" fill-opacity="0.7"/></g>`;
  }

  // Soft light shafts (the shader adds the moving ones; these hold the read without WebGL).
  let rays = '';
  for (let i = 0; i < 6; i++) {
    const x0 = 860 + i * 70;
    const x1 = 240 + i * 260 + rand() * 60;
    rays += `<path d="M${x0} -20h${n1(22 + rand() * 20)}L${n1(x1 + 90 + rand() * 60)} ${H}H${n1(x1)}Z" style="animation: dbtefx-pulse ${n1(6 + i * 1.4)}s ease-in-out ${n1(-i * 1.9)}s infinite;"/>`;
  }

  return `<style>@keyframes dbtefx-mm-glide { 0%, 100% { transform: translate(0, 0) rotate(0deg); } 50% { transform: translate(-46px, 14px) rotate(-1.5deg); } }
@keyframes dbtefx-mm-tail { 0%, 100% { transform: scaleX(1) skewY(-6deg); } 50% { transform: scaleX(0.8) skewY(7deg); } }
@keyframes dbtefx-mm-rise { 0% { transform: translate(0, 0); opacity: 0; } 10% { opacity: 1; } 100% { transform: translate(24px, -860px); opacity: 0; } }</style>
<defs>
<linearGradient id="dbtefx-mm-sea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${mix(t.bg, t.accent, 0.35)}" stop-opacity="0.55"/><stop offset="0.5" stop-color="${water}" stop-opacity="0.25"/><stop offset="1" stop-color="${deep}" stop-opacity="0.7"/></linearGradient>
<linearGradient id="dbtefx-mm-ray" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${mix(t.accent, '#ffffff', 0.5)}" stop-opacity="0.2"/><stop offset="1" stop-color="${t.accent}" stop-opacity="0"/></linearGradient>
<linearGradient id="dbtefx-mm-skin" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${mix(deep, t.accent, 0.12)}"/><stop offset="0.55" stop-color="${mix(t.bg, t.accent, 0.3)}"/><stop offset="1" stop-color="${mix(t.bg, t.accent, 0.5)}"/></linearGradient>
<linearGradient id="dbtefx-mm-steel" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="0.4" stop-color="${silver}"/><stop offset="1" stop-color="${mix(silver, t.bg, 0.55)}"/></linearGradient>
<linearGradient id="dbtefx-mm-gold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${mix(gold, '#ffffff', 0.5)}"/><stop offset="0.5" stop-color="${gold}"/><stop offset="1" stop-color="${mix(gold, t.bg, 0.45)}"/></linearGradient>
<linearGradient id="dbtefx-mm-kelp" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="${deep}"/><stop offset="1" stop-color="${mix(t.bg, t.success, 0.35)}"/></linearGradient>
<linearGradient id="dbtefx-mm-stone" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${stone}"/><stop offset="1" stop-color="${mix(stone, t.bg, 0.7)}"/></linearGradient>
<radialGradient id="dbtefx-mm-bub" cx="0.35" cy="0.35"><stop offset="0" stop-color="#ffffff" stop-opacity="0.05"/><stop offset="0.8" stop-color="${t.accent}" stop-opacity="0.12"/><stop offset="1" stop-color="#ffffff" stop-opacity="0.45"/></radialGradient>
<radialGradient id="dbtefx-mm-glow"><stop offset="0" stop-color="${t.accent}" stop-opacity="0.22"/><stop offset="1" stop-color="${t.accent}" stop-opacity="0"/></radialGradient>
</defs>
<rect width="${W}" height="${H}" fill="url(#dbtefx-mm-sea)"/>
<g fill="url(#dbtefx-mm-ray)">${rays}</g>
<g fill="${mix(stone, t.bg, 0.55)}" fill-opacity="0.8">${column(120, 760, 260, 30, false)}${column(210, 770, 180, 30, true)}${column(330, 780, 90, 30, true)}<path d="M60 506h200v-18H60Z"/></g>
<path d="${ridge(780, 50, 3)}" fill="${mix(stone, t.bg, 0.6)}"/>
<!--mid-->
<ellipse cx="1240" cy="520" rx="420" ry="300" fill="url(#dbtefx-mm-glow)"/>
<g fill="url(#dbtefx-mm-stone)">${temple(1250, 836, 0.9)}</g>
<path d="${ridge(840, 30, 9)}" fill="${mix(stone, t.bg, 0.72)}"/>
${trident(1092, 880, 0.78)}
${shark(1046, 300, 0.68)}
${bubbles}
<!--near-->
${kelp(30, 520, 0.6, 0)}${kelp(90, 380, 0.9, 1.5)}${kelp(1560, 560, -0.7, 0.8)}${kelp(1500, 360, -0.5, 2.2)}`;
};

export default mermail;

// Particle systems for this theme (kinds and options: particles.js).
export const particles = [{ kind: 'mote', count: 70, colors: ['text', 'accent'], rise: true, speed: 0.8 }, { kind: 'mote', count: 30, colors: ['muted'], light: true, speed: 0.4 }];

// WebGL layer (shader.js): sunlight through deep water. Shafts fan from a sun
// above the frame, drifting with the swell; caustic ripples near the surface.
export const shader = {
  uniforms: ['bg', 'accent', 'text'],
  frag: `
void main() {
  vec2 uv = gl_FragCoord.xy / u_res;
  float asp = u_res.x / u_res.y;
  float t = u_time;
  vec3 col = mix(u_bg * 0.7, mix(u_bg, u_accent, 0.42), smoothstep(0.0, 1.0, uv.y));
  vec2 d = vec2((uv.x - 0.62) * asp, uv.y - 1.35);
  float a = atan(d.x, -d.y);
  float sw = noise(vec2(a * 16.0 + sin(t * 0.21) * 0.6, t * 0.18)) * noise(vec2(a * 41.0 - t * 0.12, 3.0 + t * 0.1));
  float shafts = smoothstep(0.18, 0.75, sw) * smoothstep(-0.05, 0.85, uv.y) * exp(-length(d) * 0.55);
  col += mix(u_accent, u_text, 0.5) * shafts * 0.42;
  vec2 cp = vec2(uv.x * asp, uv.y) * 7.0;
  float c1 = noise(cp + vec2(t * 0.35, t * 0.22));
  float c2 = noise(cp * 1.3 - vec2(t * 0.27, -t * 0.3));
  float caus = pow(1.0 - abs(c1 - c2), 7.0) * smoothstep(0.6, 1.0, uv.y);
  col += u_text * caus * 0.18;
  float surf = smoothstep(0.93, 1.0, uv.y) * (0.6 + 0.4 * fbm(vec2(uv.x * asp * 3.0 + t * 0.1, t * 0.15)));
  col = mix(col, mix(u_accent, u_text, 0.6), surf * 0.35);
  col *= 1.0 - 0.35 * dot(uv - vec2(0.5, 0.6), uv - vec2(0.5, 0.6));
  gl_FragColor = vec4(dither(col), 1.0);
}`,
};
