import { mix } from '../../../lib/color.js';
import { anim, H, n1, rng, W } from './kit.js';
import { CARD_ART_KEYFRAMES, CARDS, cardArt } from './cardart.js';

// Gladiator Beast: inside the Colosseum at the hour of the games. Sunlight
// rakes the arena; tiers of arches and the crowd ring the sand; Heraklinos
// (the real card artwork, loaded live from DuelingBook) waits in the lit
// gate to tag in, under crimson banners.
const gladiator = (t) => {
  const rand = rng(29);
  const stone = mix(t.accent, t.bg, 0.7);
  const shade = mix(t.bg, '#000000', 0.35);
  const sun = mix(t.warning, '#ffffff', 0.35);
  const red = t.accent2;
  const bronze = t.accent;

  // The far wall as seen from the sand: arches crowd together in the middle
  // and grow toward the edges; the wall rises and its foot drops toward us.
  const foot = (x) => 560 + 70 * ((x - 800) / 800) ** 2;
  const top = (x) => 150 - 150 * ((x - 800) / 800) ** 2;
  const cols = [];
  for (let a = -64; a <= 64; a += 4) cols.push(800 + 520 * Math.tan((a * Math.PI) / 180));
  const band = (f0, f1) => (x) => {
    const [b, tp] = [foot(x), top(x)];
    return [b - (b - tp) * f0, b - (b - tp) * f1];
  };
  // Arch openings for one storey between fractions f0..f1 of the wall height.
  const arches = (f0, f1, fillW) => {
    const at = band(f0, f1);
    let d = '';
    for (let i = 0; i < cols.length - 1; i++) {
      const [x0, x1] = [cols[i], cols[i + 1]];
      const w = (x1 - x0) * fillW;
      const cx = (x0 + x1) / 2;
      const [yb, yt] = at(cx);
      const h = yb - yt;
      const r = w / 2;
      d += `M${n1(cx - r)} ${n1(yb - h * 0.08)}V${n1(yt + h * 0.12 + r)}A${n1(r)} ${n1(r)} 0 0 1 ${n1(cx + r)} ${n1(yt + h * 0.12 + r)}V${n1(yb - h * 0.08)}Z`;
    }
    return d;
  };
  const edge = (f) => {
    let d = '';
    for (let x = -40; x <= W + 40; x += 40) {
      const [b, tp] = [foot(x), top(x)];
      d += `${d ? 'L' : 'M'}${x} ${n1(b - (b - tp) * f)}`;
    }
    return d;
  };
  const wallShape = `${edge(1)}L${W + 40} ${n1(foot(W + 40))}${edge(0).replace('M', 'L').split('L').filter(Boolean).reverse().map((p) => `L${p}`).join('')}Z`;

  // Cornice lines between storeys.
  const cornices = [0.2, 0.52, 0.8, 1].map((f) => `<path d="${edge(f)}" stroke="${mix(stone, sun, 0.4)}" stroke-opacity="0.55" stroke-width="${f === 1 ? 4 : 2.5}" fill="none"/>`).join('');

  // Masts for the velarium on the attic.
  let masts = '';
  for (let i = 2; i < cols.length - 2; i += 3) {
    const x = cols[i];
    const tp = top(x);
    masts += `M${n1(x)} ${n1(tp)}v${n1(-24 - Math.abs(x - 800) / 30)}`;
  }

  // Laurel wreath of paired leaves around a centre, open at the top.
  const wreath = (cx, cy, r, k) => {
    let d = '';
    for (let side = -1; side <= 1; side += 2) {
      for (let i = 0; i < 7; i++) {
        const a = ((100 + i * 30) * Math.PI) / 180;
        const [x, y] = [cx + side * Math.cos(a) * r * -1, cy + Math.sin(a) * r];
        const rot = n1(side * (i * 30 + 10));
        d += `<ellipse cx="${n1(x)}" cy="${n1(y)}" rx="${n1(2.2 * k)}" ry="${n1(5 * k)}" transform="rotate(${rot} ${n1(x)} ${n1(y)})"/>`;
      }
    }
    return d;
  };
  // Crossed gladii over a plaque: blade, guard, grip, pommel.
  const swords = (cx, cy, k) => {
    const blade = (dir) => `M${n1(cx - dir * 12 * k)} ${n1(cy + 12 * k)}L${n1(cx + dir * 11 * k)} ${n1(cy - 11 * k)}l${n1(dir * 2 * k)} ${n1(-4 * k)}`;
    return `<path d="${blade(1)}${blade(-1)}" stroke="${mix(t.text, bronze, 0.3)}" stroke-width="${n1(2.6 * k)}" stroke-linecap="round"/><path d="M${n1(cx - 15 * k)} ${n1(cy + 8 * k)}l${n1(6 * k)} ${n1(6 * k)}M${n1(cx + 15 * k)} ${n1(cy + 8 * k)}l${n1(-6 * k)} ${n1(6 * k)}" stroke="${bronze}" stroke-width="${n1(2.6 * k)}" stroke-linecap="round"/>`;
  };

  // Banners hanging over the arcade, sized by their distance.
  const banner = (x, scale, delay, emblem) => {
    const y = top(x) + 8;
    const w = 34 * scale;
    const h = 150 * scale;
    return `<g style="transform-origin: ${n1(x)}px ${n1(y)}px; animation: dbtefx-gb-sway 4s ease-in-out ${-delay}s infinite;">
<path d="M${n1(x - w)} ${n1(y)}H${n1(x + w)}V${n1(y + h)}L${n1(x)} ${n1(y + h - w * 0.7)}L${n1(x - w)} ${n1(y + h)}Z" fill="url(#dbtefx-gb-cloth)"/>
<path d="M${n1(x - w * 0.82)} ${n1(y)}V${n1(y + h * 0.9)}M${n1(x + w * 0.82)} ${n1(y)}V${n1(y + h * 0.9)}" stroke="${bronze}" stroke-width="${n1(2 * scale)}"/>
<rect x="${n1(x - w - 4)}" y="${n1(y - 4)}" width="${n1(w * 2 + 8)}" height="${n1(6 * scale)}" fill="${bronze}"/>
${emblem ? `<g fill="${bronze}">${wreath(x, y + h * 0.36, w * 0.56, scale)}</g>${swords(x, y + h * 0.36, scale * 0.9)}<rect x="${n1(x - w * 0.5)}" y="${n1(y + h * 0.58)}" width="${n1(w)}" height="${n1(8 * scale)}" fill="${bronze}"/>` : `<rect x="${n1(x - w * 0.5)}" y="${n1(y + h * 0.4)}" width="${n1(w)}" height="${n1(8 * scale)}" fill="${bronze}"/>`}
</g>`;
  };

  // Crowd: a pattern of heads; scattered flecks of cloth in the stands.
  const crowdBand = band(0.22, 0.48);
  let flecks = '';
  for (let i = 0; i < 70; i++) {
    const x = rand() * W;
    const [b, tp] = crowdBand(x);
    flecks += `M${n1(x)} ${n1(b - rand() * (b - tp))}h${n1(2 + rand() * 3)}`;
  }

  // Dust kicked up at the gate's threshold.
  let dust = '';
  for (let i = 0; i < 6; i++) dust += `<ellipse cx="${n1(1180 + i * 36 + rand() * 14)}" cy="${n1(640 - rand() * 8)}" rx="${n1(26 + rand() * 18)}" ry="${n1(10 + rand() * 6)}" fill="url(#dbtefx-gb-dust)" style="animation: dbtefx-gb-dust ${n1(4 + rand() * 2)}s ease-out ${n1(-i * 0.9)}s infinite; transform-box: fill-box; transform-origin: center bottom;"/>`;

  // The gate: the Porta where the beasts wait to tag in. Heraklinos, the
  // real card artwork, stands in the lit opening; offline the gate still glows.
  const [gx, gy] = [1290, 660];
  const [gw, gh] = [140, 400];
  const arch = (w, h) => `M${gx - w} ${gy}V${gy - h + w}A${w} ${w} 0 0 1 ${gx + w} ${gy - h + w}V${gy}Z`;
  const gate = `<path d="${arch(gw + 30, gh + 30)}" fill="url(#dbtefx-gb-wall)"/>
<path d="${arch(gw + 30, gh + 30)}" fill="${shade}" fill-opacity="0.35"/>
<ellipse cx="${gx}" cy="${gy - 200}" rx="280" ry="320" fill="url(#dbtefx-gb-glow)" ${anim('pulse', 5, 0, 'ease-in-out')}/>
<path d="${arch(gw, gh)}" fill="url(#dbtefx-gb-gate)"/>
<path d="${arch(gw, gh)}" fill="url(#dbtefx-gb-tunnel)"/>
${cardArt(t, { id: 'dbtefx-gb-hero', card: CARDS.heraklinos, x: gx - gw, y: gy - gh, w: gw * 2, h: gh, frame: 'arch', focus: [0.47, 0.42], zoom: 0.92, feather: 0.32, fade: 0.55, backdrop: mix(t.bg, t.warning, 0.2), backdropAmt: 0.85, rim: mix(stone, sun, 0.5), glow: t.warning, breathe: 12, grade: 'sepia(0.3) saturate(0.85) contrast(1.05)' })}
<path d="${arch(gw, gh)}" fill="${t.accent}" fill-opacity="0.22" style="mix-blend-mode: color;"/>
<path d="${arch(gw, gh)}" fill="url(#dbtefx-gb-tunnel)" fill-opacity="0.35" style="mix-blend-mode: multiply;"/>
<path d="${arch(gw + 30, gh + 30)}${arch(gw, gh)}" fill="none" stroke="${mix(stone, sun, 0.5)}" stroke-width="3"/>
<path d="M${gx - 18} ${gy - gh - 32}h36l-6 22h-24Z" fill="${bronze}"/>
<ellipse cx="${gx}" cy="${gy + 10}" rx="190" ry="26" fill="${t.warning}" fill-opacity="0.2"/>
${dust}`;

  // God rays from the opening in the velarium, high on the right.
  let rays = '';
  for (let i = 0; i < 5; i++) {
    const x0 = 1180 + i * 70 + rand() * 30;
    const spread = 40 + rand() * 40;
    const x1 = 1080 + i * 80 + rand() * 30;
    rays += `<path d="M${n1(x0)} -20L${n1(x0 + 26)} -20L${n1(x1 + spread)} ${H}L${n1(x1)} ${H}Z" ${anim('pulse', n1(7 + i * 1.3), i * 1.7, 'ease-in-out')}/>`;
  }

  // Velarium: the striped awning edge along the top, scalloped, with ropes.
  let awn = 'M-40 -10H1640V40';
  for (let x = 1640; x > -40; x -= 80) awn += `Q${x - 40} ${n1(70 + Math.abs(x - 800) / 40)} ${x - 80} 40`;
  awn += 'Z';

  // Drag marks in the sand, running out from the gate.
  let sandMarks = '';
  for (let i = 0; i < 4; i++) {
    const x0 = 1180 + i * 38 + rand() * 20;
    const x1 = 120 + i * 260 + rand() * 120;
    const y1 = 930;
    sandMarks += `M${x0} 660C${n1(x0 - 120)} ${n1(720 + i * 6)} ${n1(x1 + 260)} ${n1(820 + rand() * 30)} ${n1(x1)} ${y1}`;
  }

  return `<style>${CARD_ART_KEYFRAMES}
@keyframes dbtefx-gb-sway { 0%, 100% { transform: skewX(-3deg); } 50% { transform: skewX(3deg); } }
@keyframes dbtefx-gb-dust { 0% { transform: translate(0, 0) scale(0.4); opacity: 0; } 25% { opacity: 1; } 100% { transform: translate(-30px, -40px) scale(1.6); opacity: 0; } }</style>
<defs>
<linearGradient id="dbtefx-gb-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${mix(t.accent2, t.bg, 0.75)}"/><stop offset="0.3" stop-color="${mix(t.warning, t.bg, 0.55)}"/><stop offset="0.6" stop-color="${t.bg}"/></linearGradient>
<linearGradient id="dbtefx-gb-wall" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${mix(stone, sun, 0.25)}"/><stop offset="0.55" stop-color="${stone}"/><stop offset="1" stop-color="${mix(stone, t.bg, 0.65)}"/></linearGradient>
<linearGradient id="dbtefx-gb-sand" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${mix(mix(t.warning, t.text, 0.3), t.bg, 0.5)}"/><stop offset="1" stop-color="${mix(t.warning, t.bg, 0.78)}"/></linearGradient>
<linearGradient id="dbtefx-gb-ray" x1="1" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${sun}" stop-opacity="0.36"/><stop offset="1" stop-color="${sun}" stop-opacity="0"/></linearGradient>
<linearGradient id="dbtefx-gb-cloth" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${mix(red, t.bg, 0.45)}"/><stop offset="0.45" stop-color="${red}"/><stop offset="1" stop-color="${mix(red, t.bg, 0.55)}"/></linearGradient>
<linearGradient id="dbtefx-gb-gold" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${mix(bronze, '#ffffff', 0.45)}"/><stop offset="1" stop-color="${mix(bronze, t.bg, 0.3)}"/></linearGradient>
<radialGradient id="dbtefx-gb-gate" cx="0.5" cy="0.75" r="0.8"><stop offset="0" stop-color="${sun}"/><stop offset="0.5" stop-color="${t.warning}"/><stop offset="1" stop-color="${mix(t.warning, t.bg, 0.6)}"/></radialGradient>
<linearGradient id="dbtefx-gb-tunnel" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${shade}" stop-opacity="0.95"/><stop offset="0.7" stop-color="${shade}" stop-opacity="0.75"/><stop offset="1" stop-color="${shade}" stop-opacity="0.2"/></linearGradient>
<radialGradient id="dbtefx-gb-glow"><stop offset="0" stop-color="${t.warning}" stop-opacity="0.4"/><stop offset="1" stop-color="${t.warning}" stop-opacity="0"/></radialGradient>
<linearGradient id="dbtefx-gb-cdepth" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${shade}" stop-opacity="0.7"/><stop offset="1" stop-color="${shade}" stop-opacity="0"/></linearGradient>
<pattern id="dbtefx-gb-awn" width="80" height="10" patternUnits="userSpaceOnUse"><rect width="80" height="10" fill="${mix(t.text, t.warning, 0.45)}"/><rect width="3" height="10" fill="${mix(red, t.bg, 0.3)}"/></pattern>
<linearGradient id="dbtefx-gb-awnshade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000000" stop-opacity="0.5"/><stop offset="1" stop-color="#000000" stop-opacity="0.1"/></linearGradient>
<linearGradient id="dbtefx-gb-veil" x1="0" y1="0" x2="1" y2="0"><stop offset="0.2" stop-color="${t.bg}" stop-opacity="0"/><stop offset="0.36" stop-color="${t.bg}" stop-opacity="0.6"/><stop offset="0.66" stop-color="${t.bg}" stop-opacity="0.6"/><stop offset="0.8" stop-color="${t.bg}" stop-opacity="0"/></linearGradient>
<radialGradient id="dbtefx-gb-pool"><stop offset="0" stop-color="${sun}" stop-opacity="0.16"/><stop offset="1" stop-color="${sun}" stop-opacity="0"/></radialGradient>
<radialGradient id="dbtefx-gb-dust"><stop offset="0" stop-color="${mix(t.warning, t.text, 0.4)}" stop-opacity="0.5"/><stop offset="1" stop-color="${mix(t.warning, t.text, 0.4)}" stop-opacity="0"/></radialGradient>
<pattern id="dbtefx-gb-crowd" width="26" height="16" patternUnits="userSpaceOnUse"><path d="M2 16c0 -6 2 -8 5 -8a3 3 0 1 1 2 0c3 0 5 2 5 8ZM14 10c0 -5 2 -6 4 -6a2.6 2.6 0 1 1 2 0c2 0 4 1 4 6Z" fill="${shade}" fill-opacity="0.45"/></pattern>
</defs>
<rect width="${W}" height="${H}" fill="url(#dbtefx-gb-sky)"/>
<path d="${wallShape}" fill="url(#dbtefx-gb-wall)"/>
<path d="${arches(0.52, 0.8, 0.62)}" fill="${shade}" fill-opacity="0.75"/>
<path d="${arches(0.8, 1, 0.3)}" fill="${shade}" fill-opacity="0.6"/>
<path d="${edge(0.2)}${edge(0.5).replace('M', 'L').split('L').filter(Boolean).reverse().map((p) => `L${p}`).join('')}Z" fill="${mix(stone, t.bg, 0.55)}"/>
<path d="${edge(0.2)}${edge(0.5).replace('M', 'L').split('L').filter(Boolean).reverse().map((p) => `L${p}`).join('')}Z" fill="url(#dbtefx-gb-crowd)"/>
${cornices}
<path d="${cols.map((x) => `M${n1(x)} ${n1(foot(x))}V${n1(foot(x) - (foot(x) - top(x)) * 0.2)}`).join('')}" stroke="${shade}" stroke-opacity="0.35" stroke-width="2"/>
<path d="${edge(0.2)}${edge(0.5).replace('M', 'L').split('L').filter(Boolean).reverse().map((p) => `L${p}`).join('')}Z" fill="url(#dbtefx-gb-cdepth)"/>
<path d="${masts}" stroke="${mix(stone, t.bg, 0.3)}" stroke-width="4"/>
<path d="${edge(0.1)}" stroke="${t.opp}" stroke-opacity="0.55" stroke-width="2" fill="none" ${anim('pulse', 4, 0, 'ease-in-out')}/>
<path d="${flecks}" stroke="${mix(t.text, red, 0.4)}" stroke-opacity="0.35" stroke-width="3"/>
<rect width="${W}" height="${H}" fill="url(#dbtefx-gb-veil)"/>
${banner(300, 0.8, 0, true)}${banner(1300, 0.8, 3, true)}
<!--mid-->
<path d="${edge(0)}L${W + 40} ${H}H-40Z" fill="url(#dbtefx-gb-sand)"/>
<path d="${edge(0)}" stroke="${shade}" stroke-width="6" fill="none"/>
<path d="${sandMarks}" stroke="${shade}" stroke-opacity="0.3" stroke-width="6" stroke-dasharray="220 30 90 50" fill="none"/>
<path d="${sandMarks}" stroke="${sun}" stroke-opacity="0.16" stroke-width="2" stroke-dasharray="220 30 90 50" fill="none" transform="translate(0 -5)"/>
<ellipse cx="760" cy="760" rx="560" ry="110" fill="url(#dbtefx-gb-pool)"/>
<g fill="url(#dbtefx-gb-ray)">${rays}</g>
${gate}
<!--near-->
<path d="${awn}" fill="url(#dbtefx-gb-awn)" transform="skewX(0)"/>
<path d="${awn}" fill="url(#dbtefx-gb-awnshade)"/>`;
};

export default gladiator;

// Particle systems for this theme (kinds and options: particles.js).
export const particles = [{ kind: 'mote', count: 60, colors: ['warning', 'accent'] }, { kind: 'ash', count: 40, colors: ['muted'], light: true }];
