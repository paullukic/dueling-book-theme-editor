import { mix } from '../../../lib/color.js';
import { H, n1, polar, rng, W } from './kit.js';

// Shaddoll: El Shaddoll Construct hangs in a stage light over the void, a
// porcelain-masked marionette in navy and gold with violet core lenses at
// every joint. Its threads run up to a cross-shaped control bar; the whole
// figure sways slowly on them, the mask tilts a little against the sway, and
// light runs down the threads. Fans of violet thread spread like wings
// behind it. Black shards of Shaddoll Fusion drift in the void.

const cx = 1270;

const scene = (t) => {
  const rand = rng(77);
  const violet = t.accent;
  const thread = mix(t.accent, t.text, 0.35);
  const gold = t.accent2;
  const goldLit = mix(t.accent2, '#ffffff', 0.45);
  const goldDim = mix(t.accent2, t.bg, 0.45);
  const navy = mix(t.bg, t.accent, 0.22);
  const navyLit = mix(navy, t.text, 0.16);
  const navyDark = mix(t.bg, '#000000', 0.3);
  const ink = mix(t.bg, '#000000', 0.5);

  // Control bar: a long bar, a short foreshortened cross bar, an upright.
  const bar = `<path d="M${cx - 150} 34h300v11h-300Z" fill="url(#dbtefx-sd-wood)"/><path d="M${cx - 62} 58h124v8h-124Z" fill="url(#dbtefx-sd-wood)"/><path d="M${cx - 7} -40h14v118h-14Z" fill="url(#dbtefx-sd-wood)"/>
<g fill="url(#dbtefx-sd-gold)"><path d="M${cx - 160} 31h12v17h-12ZM${cx + 148} 31h12v17h-12ZM${cx - 70} 55h10v14h-10ZM${cx + 60} 55h10v14h-10ZM${cx - 10} 74h20v10h-20Z"/></g>
<circle cx="${cx}" cy="40" r="9" fill="url(#dbtefx-sd-orb)" stroke="${gold}" stroke-width="2"/>`;

  // Attachment points: [from on the bar, to on the puppet].
  const strings = [
    [[cx, 84], [cx, 102]],
    [[cx - 154], [cx - 146, 466]],
    [[cx + 154], [cx + 146, 466]],
    [[cx - 65, 66], [cx - 62, 290]],
    [[cx + 65, 66], [cx + 62, 290]],
  ].map(([[x0, y0 = 48], [x1, y1]]) => `M${x0} ${y0}L${x1} ${y1}`);
  const above = `M${cx - 154} 34L${cx - 120} -20M${cx + 154} 34L${cx + 120} -20M${cx} -40V-60`;
  const glints = strings.map((d, i) => `<path d="${d}" style="animation: dbtefx-sd-glint 7s ease-in-out ${n1(-i * 1.3)}s infinite;"/>`).join('');

  // Thread wings fanning from the shoulders, held inside the figure's band.
  let wings = '';
  for (let side = -1; side <= 1; side += 2) {
    for (let i = 0; i < 20; i++) {
      const a = side < 0 ? -172 + i * 4.4 : -8 - i * 4.4;
      const rad = (a * Math.PI) / 180;
      const len = Math.min(180 + i * 9 + (i % 3) * 22, (side < 0 ? 150 : 210) / Math.max(0.2, Math.abs(Math.cos(rad))));
      const [sx, sy] = [cx + side * 64, 300];
      const [ex, ey] = polar(sx, sy, len, a);
      const [qx, qy] = polar(sx, sy + 40, len * 0.6, a + side * 12);
      wings += `M${sx} ${sy}Q${qx} ${qy} ${ex} ${ey}`;
    }
  }

  // An arm: upper arm, elbow lens, gauntlet flaring to the wrist, a limp hand.
  const arm = (s) => {
    const el = [cx + s * 112, 380];
    const wr = [cx + s * 146, 462];
    const fingers = [-9, -3, 3, 9].map((o, i) => `M${n1(wr[0] + o * 0.9)} ${wr[1] + 18}q${n1(o * 0.15)} ${16 + (i === 1 || i === 2 ? 6 : 0)} ${n1(o * 0.3 + s * 1)} ${26 + (i === 1 || i === 2 ? 8 : 0)}`).join('');
    const P = (pts) => pts.map(([x, y]) => `${n1(cx + s * x)} ${n1(y)}`).join('L');
    return `<path d="M${P([[58, 292], [80, 290], [122, 372], [104, 390], [62, 318]])}Z" fill="url(#dbtefx-sd-navy)" stroke="${navyDark}" stroke-width="1.5" stroke-linejoin="round"/>
<path d="M${P([[106, 384], [124, 376], [176, 452], [168, 470], [126, 478]])}Z" fill="url(#dbtefx-sd-navy)" stroke="${navyDark}" stroke-width="1.5" stroke-linejoin="round"/>
<path d="M${P([[124, 376], [176, 452], [168, 470]])}" fill="none" stroke="${gold}" stroke-width="3" stroke-linejoin="round"/>
<path d="M${P([[134, 410], [118, 428]])}M${P([[150, 432], [134, 450]])}" stroke="${goldDim}" stroke-width="2.4"/>
<path d="M${P([[44, 280], [92, 282], [104, 318], [80, 334], [52, 314]])}Z" fill="url(#dbtefx-sd-gold)" stroke="${goldDim}" stroke-width="1"/>
<ellipse cx="${wr[0]}" cy="${wr[1] + 12}" rx="10" ry="12" fill="url(#dbtefx-sd-china)"/>
<path d="${fingers}" fill="none" stroke="url(#dbtefx-sd-china)" stroke-width="5" stroke-linecap="round"/>
<circle cx="${el[0]}" cy="${el[1]}" r="11" fill="url(#dbtefx-sd-orb)" stroke="${gold}" stroke-width="2"/>`;
  };

  // Skirt: two tiers of long pleated panels fanning from the waist.
  const panel = (deg, len, w0, w1, shade, slit) => {
    const r = (deg * Math.PI) / 180;
    const [dx, dy] = [Math.sin(r), Math.cos(r)];
    const [px, py] = [dy, -dx];
    const top = [cx + dx * 4, 434];
    const bot = [top[0] + dx * len, top[1] + dy * len];
    const p = (base, w, k) => `${n1(base[0] + px * w * k)} ${n1(base[1] + py * w * k)}`;
    const along = (f, w) => [top[0] + dx * len * f + px * w, top[1] + dy * len * f + py * w];
    const band = (f) => `M${along(f, -w0 - (w1 - w0) * f).map(n1).join(' ')}L${along(f, w0 + (w1 - w0) * f).map(n1).join(' ')}`;
    const [lx, ly] = along(0.52, 0);
    const lit = along(0.04, -w0 - 1).concat(along(0.98, -w1 - 1)).map(n1);
    const sl = slit ? `<path d="M${lit[0]} ${lit[1]}L${lit[2]} ${lit[3]}" stroke="${thread}" stroke-opacity="0.55" stroke-width="1.5"/><circle cx="${n1(lx)}" cy="${n1(ly)}" r="7" fill="url(#dbtefx-sd-orb)" stroke="${gold}" stroke-width="2"/>` : '';
    return `<path d="M${p(top, w0, -1)}L${p(top, w0, 1)}L${p(bot, w1, 1)}L${n1(bot[0] + dx * 22)} ${n1(bot[1] + dy * 22)}L${p(bot, w1, -1)}Z" fill="${shade}" stroke="${navyDark}" stroke-width="1.5" stroke-linejoin="round"/><path d="${band(0.12)}${band(0.9)}" stroke="${gold}" stroke-width="3"/>${sl}`;
  };
  const back = [-30, -18, -6, 6, 18, 30].map((d, i) => panel(d, 300, 13, 26, i % 2 ? navyDark : navy, false)).join('');
  const front = [-21, -7, 7, 21].map((d) => panel(d, 340, 16, 32, `url(#dbtefx-sd-navy)`, true)).join('');

  // The masked head: hood, three crest blades, porcelain mask with shaded sockets and a hairline crack.
  const head = `<path d="M${cx - 9} 150L${cx} 98L${cx + 9} 150ZM${cx - 30} 160L${cx - 34} 118L${cx - 16} 152ZM${cx + 30} 160L${cx + 34} 118L${cx + 16} 152Z" fill="url(#dbtefx-sd-gold)"/>
<path d="M${cx - 46} 236C${cx - 54} 176 ${cx - 32} 140 ${cx} 138C${cx + 32} 140 ${cx + 54} 176 ${cx + 46} 236L${cx + 34} 244C${cx + 38} 192 ${cx + 22} 166 ${cx} 164C${cx - 22} 166 ${cx - 38} 192 ${cx - 34} 244Z" fill="url(#dbtefx-sd-navy)" stroke="${gold}" stroke-width="2"/>
<path d="M${cx - 30} 196C${cx - 30} 162 ${cx + 30} 162 ${cx + 30} 196C${cx + 30} 230 ${cx + 13} 252 ${cx} 254C${cx - 13} 252 ${cx - 30} 230 ${cx - 30} 196Z" fill="url(#dbtefx-sd-china)"/>
<ellipse cx="${cx - 12}" cy="204" rx="10" ry="6" fill="url(#dbtefx-sd-socket)"/><ellipse cx="${cx + 12}" cy="204" rx="10" ry="6" fill="url(#dbtefx-sd-socket)"/>
<path d="M${cx - 19} 205Q${cx - 12} 209 ${cx - 5} 205M${cx + 5} 205Q${cx + 12} 209 ${cx + 19} 205" fill="none" stroke="${ink}" stroke-opacity="0.75" stroke-width="1.3"/>
<path d="M${cx - 2} 212Q${cx + 1} 224 ${cx - 3} 230" fill="none" stroke="${mix(t.muted, t.bg, 0.3)}" stroke-opacity="0.45" stroke-width="1.4"/>
<path d="M${cx + 13} 168L${cx + 17} 184L${cx + 13} 196L${cx + 20} 214L${cx + 16} 232" fill="none" stroke="${ink}" stroke-opacity="0.7" stroke-width="1.1"/>
<path d="M${cx} 176l5 8l-5 8l-5 -8Z" fill="url(#dbtefx-sd-orb)" stroke="${gold}" stroke-width="1"/>`;

  // Torso: gorget, shoulder lenses, a tapering cuirass with the core lens, belt.
  const torso = `<path d="M${cx - 9} 250h18v30h-18Z" fill="url(#dbtefx-sd-china)"/><path d="M${cx - 9} 260h18M${cx - 9} 270h18" stroke="${mix(t.muted, t.bg, 0.4)}" stroke-width="1.2"/>
<path d="M${cx - 56} 298L${cx + 56} 298L${cx + 40} 422Q${cx} 440 ${cx - 40} 422Z" fill="url(#dbtefx-sd-navy)" stroke="${navyDark}" stroke-width="1.5"/>
<path d="M${cx - 40} 314Q${cx} 300 ${cx + 40} 314M${cx - 30} 396Q${cx} 410 ${cx + 30} 396" fill="none" stroke="${goldDim}" stroke-width="2"/>
<path d="M${cx} 360V430" stroke="${gold}" stroke-width="2.4"/>
<path d="M${cx - 66} 294Q${cx} 266 ${cx + 66} 294L${cx + 52} 314Q${cx} 292 ${cx - 52} 314Z" fill="url(#dbtefx-sd-gold)"/>
<path d="M${cx - 42} 420Q${cx} 444 ${cx + 42} 420L${cx + 44} 434Q${cx} 458 ${cx - 44} 434Z" fill="url(#dbtefx-sd-gold)"/>
<circle cx="${cx}" cy="350" r="34" fill="url(#dbtefx-sd-aura)" style="animation: dbtefx-sd-beat 4.5s ease-in-out infinite; transform-box: fill-box; transform-origin: center;"/>
<circle cx="${cx}" cy="350" r="15" fill="url(#dbtefx-sd-orb)" stroke="${gold}" stroke-width="3"/>
<circle cx="${cx - 64}" cy="300" r="15" fill="url(#dbtefx-sd-orb)" stroke="${gold}" stroke-width="2.4"/><circle cx="${cx + 64}" cy="300" r="15" fill="url(#dbtefx-sd-orb)" stroke="${gold}" stroke-width="2.4"/>`;

  // Black shards of Shaddoll Fusion drifting in the void.
  const shard = (x, y, s, rot, i) => `<g transform="translate(${n1(x)} ${n1(y)}) rotate(${rot}) scale(${n1(s)})"><g style="animation: dbtefx-drift ${n1(14 + i * 2.3)}s ease-in-out ${n1(-i * 3.1)}s infinite;"><path d="M0 -22L10 -4L6 20L-8 14L-11 -6Z" fill="${ink}"/><path d="M0 -22L10 -4L2 2Z" fill="${navyLit}" fill-opacity="0.6"/><path d="M0 -22L-11 -6M10 -4L6 20" fill="none" stroke="${violet}" stroke-opacity="0.55" stroke-width="1.2"/></g></g>`;
  const shards = [[180, 210, 1.6, 20], [330, 120, 0.9, -30], [120, 520, 1.1, 60], [360, 640, 1.4, -12], [1500, 150, 1.2, 40], [1520, 560, 0.9, -50], [250, 380, 0.7, 10]].map(([x, y, s, r], i) => shard(x, y, s, r, i)).join('');

  // Far void: a faint harlequin lattice and indigo cloud banks.
  let lattice = '';
  for (let y = -40; y < H; y += 120) for (let x = (y / 120) % 2 ? 0 : 80; x < W; x += 160) lattice += `M${x} ${y}l80 60l-80 60l-80 -60Z`;
  let clouds = '';
  for (let i = 0; i < 6; i++) clouds += `<ellipse cx="${n1(rand() * W)}" cy="${n1(560 + rand() * 360)}" rx="${n1(320 + rand() * 260)}" ry="${n1(90 + rand() * 60)}"/>`;

  return `<style>@keyframes dbtefx-sd-hang { 0%, 100% { transform: rotate(-1.4deg); } 50% { transform: rotate(1.4deg); } }
@keyframes dbtefx-sd-nod { 0%, 100% { transform: rotate(3deg); } 50% { transform: rotate(-3.5deg); } }
@keyframes dbtefx-sd-glint { 0%, 70%, 100% { opacity: 0; } 82% { opacity: 1; } }
@keyframes dbtefx-sd-beat { 0%, 100% { transform: scale(0.85); opacity: 0.55; } 50% { transform: scale(1.15); opacity: 1; } }
@keyframes dbtefx-sd-wing { 0%, 100% { opacity: 0.45; } 50% { opacity: 0.9; } }</style>
<defs>
<linearGradient id="dbtefx-sd-void" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${mix(t.bg, violet, 0.16)}"/><stop offset="0.6" stop-color="${t.bg}"/><stop offset="1" stop-color="${navyDark}"/></linearGradient>
<linearGradient id="dbtefx-sd-cone" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${thread}" stop-opacity="0.3"/><stop offset="1" stop-color="${violet}" stop-opacity="0.02"/></linearGradient>
<radialGradient id="dbtefx-sd-fog"><stop offset="0" stop-color="${mix(t.bg, violet, 0.3)}" stop-opacity="0.45"/><stop offset="1" stop-color="${mix(t.bg, violet, 0.3)}" stop-opacity="0"/></radialGradient>
<radialGradient id="dbtefx-sd-burst"><stop offset="0" stop-color="#ffffff" stop-opacity="0.3"/><stop offset="0.25" stop-color="${thread}" stop-opacity="0.2"/><stop offset="1" stop-color="${violet}" stop-opacity="0"/></radialGradient>
<radialGradient id="dbtefx-sd-pool" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="${violet}" stop-opacity="0.28"/><stop offset="1" stop-color="${violet}" stop-opacity="0"/></radialGradient>
<radialGradient id="dbtefx-sd-fade" cx="0.75" cy="0.35" r="0.7"><stop offset="0" stop-color="#ffffff" stop-opacity="0.9"/><stop offset="1" stop-color="#ffffff" stop-opacity="0"/></radialGradient>
<mask id="dbtefx-sd-lmask"><rect width="${W}" height="${H}" fill="url(#dbtefx-sd-fade)"/></mask>
<linearGradient id="dbtefx-sd-navy" x1="0" y1="0" x2="1" y2="0.3"><stop offset="0" stop-color="${navyLit}"/><stop offset="0.45" stop-color="${navy}"/><stop offset="1" stop-color="${navyDark}"/></linearGradient>
<linearGradient id="dbtefx-sd-wood" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${navyLit}"/><stop offset="1" stop-color="${ink}"/></linearGradient>
<linearGradient id="dbtefx-sd-gold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${goldLit}"/><stop offset="0.5" stop-color="${gold}"/><stop offset="1" stop-color="${goldDim}"/></linearGradient>
<radialGradient id="dbtefx-sd-china" cx="0.35" cy="0.3" r="0.8"><stop offset="0" stop-color="#ffffff"/><stop offset="0.45" stop-color="${t.text}"/><stop offset="1" stop-color="${mix(t.muted, t.bg, 0.35)}"/></radialGradient>
<radialGradient id="dbtefx-sd-socket"><stop offset="0" stop-color="${mix(t.muted, t.bg, 0.45)}" stop-opacity="0.85"/><stop offset="1" stop-color="${t.muted}" stop-opacity="0"/></radialGradient>
<radialGradient id="dbtefx-sd-orb" cx="0.38" cy="0.32" r="0.75"><stop offset="0" stop-color="#ffffff"/><stop offset="0.25" stop-color="${mix(violet, '#ffffff', 0.4)}"/><stop offset="0.7" stop-color="${violet}"/><stop offset="1" stop-color="${mix(violet, t.bg, 0.6)}"/></radialGradient>
<radialGradient id="dbtefx-sd-aura"><stop offset="0" stop-color="${violet}" stop-opacity="0.75"/><stop offset="1" stop-color="${violet}" stop-opacity="0"/></radialGradient>
</defs>
<rect width="${W}" height="${H}" fill="url(#dbtefx-sd-void)" fill-opacity="0.85"/>
<path d="${lattice}" fill="none" stroke="${violet}" stroke-opacity="0.16" mask="url(#dbtefx-sd-lmask)"/>
<g fill="url(#dbtefx-sd-fog)">${clouds}</g>
<path d="M${cx - 70} 0H${cx + 70}L${cx + 300} ${H}H${cx - 300}Z" fill="url(#dbtefx-sd-cone)"/>
<ellipse cx="${cx}" cy="150" rx="260" ry="240" fill="url(#dbtefx-sd-burst)"/>
<ellipse cx="${cx}" cy="880" rx="300" ry="60" fill="url(#dbtefx-sd-pool)"/>
${shards}
<!--mid-->
<g style="transform-origin: ${cx}px 40px; animation: dbtefx-sd-hang 13s ease-in-out infinite;">
<g fill="none" stroke="${thread}" style="animation: dbtefx-sd-wing 9s ease-in-out infinite;"><path d="${wings}" stroke="${violet}" stroke-opacity="0.12" stroke-width="5"/><path d="${wings}" stroke-opacity="0.6" stroke-width="1"/></g>
<g fill="none" stroke="${violet}"><path d="${strings.join('')}" stroke-opacity="0.16" stroke-width="5"/><path d="${strings.join('')}" stroke="${thread}" stroke-opacity="0.8" stroke-width="1.2"/><path d="${above}" stroke="${thread}" stroke-opacity="0.5" stroke-width="1.2"/></g>
<g fill="none" stroke="#ffffff" stroke-width="1.6" stroke-opacity="0.85">${glints}</g>
${bar}
${back}
${arm(-1)}${arm(1)}
${front}
<path d="M${cx} 840l7 12l-7 14l-7 -14Z" fill="url(#dbtefx-sd-orb)" stroke="${gold}" stroke-width="1.4"/><path d="M${cx} 790V840" stroke="${thread}" stroke-opacity="0.7"/>
${torso}
<g style="transform-origin: ${cx}px 262px; animation: dbtefx-sd-nod 11s ease-in-out -3s infinite;">${head}</g>
</g>
<!--near-->
<g fill="none" stroke="${thread}" stroke-width="1.1" stroke-opacity="0.5">
<g style="transform-origin: 90px 0px; animation: dbtefx-reed 9s ease-in-out infinite;"><path d="M90 -10V300"/><circle cx="90" cy="306" r="5" fill="url(#dbtefx-sd-orb)" stroke="${gold}"/></g>
<g style="transform-origin: 1560px 0px; animation: dbtefx-reed 11s ease-in-out -4s infinite;"><path d="M1560 -10V210"/><circle cx="1560" cy="216" r="4" fill="url(#dbtefx-sd-orb)" stroke="${gold}"/></g>
</g>
<path d="M-20 ${H + 20}L40 790L110 830L150 760L230 ${H + 20}Z" fill="${ink}"/><path d="M40 790L110 830L150 760" fill="none" stroke="${violet}" stroke-opacity="0.45" stroke-width="1.5"/>`;
};

export default scene;

// Particle systems (particles.js): violet thread dust drifting up, faint stars.
export const particles = [{ kind: 'mote', count: 46, colors: ['accent', 'text'], rise: true, speed: 0.6 }, { kind: 'star', count: 60, colors: ['muted'] }];
