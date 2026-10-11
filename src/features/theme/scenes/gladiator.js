import { mix } from '../../../lib/color.js';
import { anim, H, n1, rng, W } from './kit.js';

// Gladiator Beast: inside the Colosseum at the hour of the games. Sunlight
// rakes the arena; tiers of arches and the crowd ring the sand; the beasts
// wait in the glowing gate to tag in, under an eagle standard and crimson
// banners. The podium carries the archetype's glowing armour lines.
const gladiator = (t) => {
  const rand = rng(29);
  const stone = mix(t.accent, t.bg, 0.58);
  const shade = mix(t.bg, '#000000', 0.35);
  const ink = mix(t.bg, '#000000', 0.6);
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

  // Banners hanging over the arcade, sized by their distance.
  const banner = (x, scale, delay, emblem) => {
    const y = top(x) + 8;
    const w = 34 * scale;
    const h = 150 * scale;
    return `<g style="transform-origin: ${n1(x)}px ${n1(y)}px; animation: dbtefx-reed ${n1(6 + delay)}s ease-in-out ${-delay}s infinite;">
<path d="M${n1(x - w)} ${n1(y)}H${n1(x + w)}V${n1(y + h)}L${n1(x)} ${n1(y + h - w * 0.7)}L${n1(x - w)} ${n1(y + h)}Z" fill="url(#dbtefx-gb-cloth)"/>
<path d="M${n1(x - w * 0.82)} ${n1(y)}V${n1(y + h * 0.9)}M${n1(x + w * 0.82)} ${n1(y)}V${n1(y + h * 0.9)}" stroke="${bronze}" stroke-width="${n1(2 * scale)}"/>
<rect x="${n1(x - w - 4)}" y="${n1(y - 4)}" width="${n1(w * 2 + 8)}" height="${n1(6 * scale)}" fill="${bronze}"/>
${emblem ? `<circle cx="${n1(x)}" cy="${n1(y + h * 0.36)}" r="${n1(w * 0.5)}" fill="none" stroke="${bronze}" stroke-width="${n1(2.4 * scale)}"/><path d="M${n1(x)} ${n1(y + h * 0.2)}v${n1(h * 0.32)}M${n1(x - w * 0.36)} ${n1(y + h * 0.36)}h${n1(w * 0.72)}" stroke="${bronze}" stroke-width="${n1(2 * scale)}"/>` : ''}
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

  // Beast gladiators, front-on silhouettes: greaves, pteruges, cuirass,
  // pauldrons. Heraklinos: lion mane, honeycomb shield, spear. Gyzarus:
  // eagle head with a crest, great wings.
  const figure = (x, y, s, kind) => {
    const lion = kind === 'lion';
    let mane = '';
    for (let i = 0; i < 18; i++) {
      const r = i % 2 ? 26 : 40 + (i % 4) * 4;
      const a = (i / 18) * Math.PI * 2 - Math.PI / 2;
      mane += `${i ? 'L' : 'M'}${n1(Math.cos(a) * r)} ${n1(-262 + Math.sin(a) * r)}`;
    }
    const wing = 'M40 -220C90 -250 140 -300 168 -360L164 -326L186 -320L160 -298L180 -288L150 -268L170 -256L132 -244L146 -230L104 -222L110 -206L60 -200Z';
    const arm = 'M-56 -214C-82 -200 -88 -170 -82 -150L-78 -126H-62L-64 -150C-66 -170 -60 -190 -50 -200Z';
    return `<g transform="translate(${x} ${y}) scale(${s})">
${lion ? '' : `<path d="${wing}" transform="matrix(0.62 0 0 0.62 15 -84)"/><path d="${wing}" transform="matrix(-0.62 0 0 0.62 -15 -84)"/>`}
<path d="M0 -104C-4 -80 -8 -50 -10 -24L-12 -4L-6 0H-30L-28 -6C-30 -40 -36 -70 -34 -96C-36 -116 -40 -128 -38 -140L-46 -128L-42 -150C-36 -170 -40 -186 -50 -200C-58 -206 -66 -210 -68 -216C-72 -230 -60 -242 -44 -240C-34 -238 -22 -234 -12 -232L-10 -244H10L12 -232C22 -234 34 -238 44 -240C60 -242 72 -230 68 -216C66 -210 58 -206 50 -200C40 -186 36 -170 42 -150L46 -128L38 -140C40 -128 36 -116 34 -96C36 -70 30 -40 28 -6L30 0H6L12 -4L10 -24C8 -50 4 -80 0 -104Z"/>
<path d="${arm}"/><path d="${arm}" transform="scale(-1 1)"/>
${lion
  ? `<path d="${mane}Z"/><path d="M-70 -330l6 -26l6 26v330h-12Z"/><path d="M28 -196l40 -23l40 23v46l-40 23l-40 -23Z"/><path d="M68 -205l26 15v30l-26 15l-26 -15v-30Z" fill="none" stroke="${mix(t.warning, ink, 0.55)}" stroke-width="2.5"/>`
  : `<path d="M-14 -240C-18 -262 -8 -282 6 -284C20 -282 26 -270 24 -260L44 -252L22 -246C20 -238 12 -234 4 -232Z"/><path d="M-4 -280L-22 -316L2 -292L8 -326L16 -290L36 -312L22 -278Z" fill="${t.danger}" fill-opacity="0.85"/><path d="M-36 -40L-60 -300l-4 -18l10 14l6 4Z"/>`}
<circle cx="${lion ? -9 : 8}" cy="${lion ? -262 : -266}" r="3" fill="${t.danger}"/>${lion ? `<circle cx="9" cy="-262" r="3" fill="${t.danger}"/>` : ''}
</g>`;
  };

  // The gate: the Porta where the beasts wait to tag in, lit from inside.
  const [gx, gy] = [1272, 644];
  const opening = `M${gx - 120} ${gy}V${gy - 190}A120 120 0 0 1 ${gx + 120} ${gy - 190}V${gy}Z`;
  let bars = '';
  for (let i = 0; i < 11; i++) {
    const x = gx - 115 + i * 23;
    bars += `M${x} ${gy - 170}V${n1(gy - 190 - Math.sqrt(Math.max(0, 120 ** 2 - (x - gx) ** 2)))}`;
  }
  const gate = `<path d="M${gx - 150} ${gy}V${gy - 196}A150 150 0 0 1 ${gx + 150} ${gy - 196}V${gy}Z" fill="${stone}"/>
<path d="${opening}" fill="url(#dbtefx-gb-gate)"/>
<clipPath id="dbtefx-gb-door"><path d="${opening}"/></clipPath>
<ellipse cx="${gx}" cy="${gy - 80}" rx="190" ry="200" fill="url(#dbtefx-gb-glow)" ${anim('pulse', 5, 0, 'ease-in-out')}/>
<g clip-path="url(#dbtefx-gb-door)" fill="${ink}">${figure(gx + 60, gy - 2, 0.8, 'eagle')}${figure(gx - 46, gy - 2, 0.86, 'lion')}
<path d="${bars}" stroke="${shade}" stroke-width="5" fill="none"/><path d="M${gx - 120} ${gy - 170}h240M${gx - 120} ${gy - 250}h240" stroke="${shade}" stroke-width="7"/>
<path d="${Array.from({ length: 11 }, (_, i) => `M${gx - 114 + i * 23} ${gy - 170}l4 14l4 -14`).join('')}" fill="${shade}"/></g>
<path d="M${gx - 150} ${gy}V${gy - 196}A150 150 0 0 1 ${gx + 150} ${gy - 196}V${gy}M${gx - 120} ${gy}V${gy - 190}A120 120 0 0 1 ${gx + 120} ${gy - 190}V${gy}" fill="none" stroke="${mix(stone, sun, 0.5)}" stroke-width="3"/>
<path d="M${gx - 16} ${gy - 348}h32l-5 18h-22Z" fill="${bronze}"/>
<ellipse cx="${gx}" cy="${gy + 10}" rx="150" ry="22" fill="${t.warning}" fill-opacity="0.18"/>`;

  // Aquila: the eagle standard planted in the sand.
  const [sx, sy] = [1080, 850];
  const eagleWing = 'M4 0C14 -30 34 -62 58 -84L54 -66L66 -64L52 -52L62 -46L48 -38L56 -30L40 -26L44 -16L28 -14C18 -8 10 -4 4 0Z';
  const aquila = `<path d="M${sx - 3} ${sy}V${sy - 520}h6V${sy}Z" fill="${mix(bronze, t.bg, 0.4)}"/>
<path d="M${sx - 70} ${sy - 470}h140" stroke="${bronze}" stroke-width="5"/>
<path d="M${sx - 64} ${sy - 470}h128v130l-64 -18l-64 18Z" fill="url(#dbtefx-gb-cloth)"/>
<path d="M${sx - 64} ${sy - 340}l16 30M${sx - 32} ${sy - 330}l8 30M${sx} ${sy - 322}v30M${sx + 32} ${sy - 330}l-8 30M${sx + 64} ${sy - 340}l-16 30" stroke="${bronze}" stroke-width="3" stroke-linecap="round"/>
<circle cx="${sx}" cy="${sy - 410}" r="26" fill="none" stroke="${bronze}" stroke-width="3"/>
<path d="M${sx - 14} ${sy - 410}h28M${sx} ${sy - 424}v28" stroke="${bronze}" stroke-width="2.5"/>
<circle cx="${sx}" cy="${sy - 500}" r="20" fill="none" stroke="${bronze}" stroke-width="6" stroke-dasharray="5 3"/>
<g fill="url(#dbtefx-gb-gold)" transform="translate(${sx} ${sy - 540})"><path d="${eagleWing}"/><path d="${eagleWing}" transform="scale(-1 1)"/>
<path d="M-10 4C-12 -12 -8 -26 2 -30C10 -30 14 -24 14 -18L22 -14L12 -12C10 -4 8 2 10 8Z"/><path d="M-16 2h32l-6 10h-20Z"/></g>`;

  // God rays from the opening in the velarium, high on the right.
  let rays = '';
  for (let i = 0; i < 5; i++) {
    const x0 = 1180 + i * 70 + rand() * 30;
    const spread = 60 + rand() * 60;
    const x1 = 260 + i * 170 + rand() * 60;
    rays += `<path d="M${n1(x0)} -20L${n1(x0 + 26)} -20L${n1(x1 + spread)} ${H}L${n1(x1)} ${H}Z" ${anim('pulse', n1(7 + i * 1.3), i * 1.7, 'ease-in-out')}/>`;
  }

  // Velarium: the striped awning edge along the top, scalloped, with ropes.
  let awn = 'M-40 -10H1640V40';
  for (let x = 1640; x > -40; x -= 80) awn += `Q${x - 40} ${n1(70 + Math.abs(x - 800) / 40)} ${x - 80} 40`;
  awn += 'Z';

  let sandMarks = '';
  for (let i = 0; i < 18; i++) {
    const y = 680 + rand() * 210;
    const x = rand() * W;
    sandMarks += `M${n1(x)} ${n1(y)}q${n1(40 + rand() * 60)} ${n1(-4 + rand() * 8)} ${n1(90 + rand() * 120)} ${n1(-2 + rand() * 4)}`;
  }


  return `<defs>
<linearGradient id="dbtefx-gb-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${mix(t.accent2, t.bg, 0.75)}"/><stop offset="0.3" stop-color="${mix(t.warning, t.bg, 0.55)}"/><stop offset="0.6" stop-color="${t.bg}"/></linearGradient>
<linearGradient id="dbtefx-gb-wall" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${mix(stone, sun, 0.25)}"/><stop offset="0.55" stop-color="${stone}"/><stop offset="1" stop-color="${mix(stone, t.bg, 0.65)}"/></linearGradient>
<linearGradient id="dbtefx-gb-sand" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${mix(t.warning, t.bg, 0.6)}"/><stop offset="1" stop-color="${mix(t.warning, t.bg, 0.9)}"/></linearGradient>
<linearGradient id="dbtefx-gb-ray" x1="1" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${sun}" stop-opacity="0.24"/><stop offset="1" stop-color="${sun}" stop-opacity="0"/></linearGradient>
<linearGradient id="dbtefx-gb-cloth" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${mix(red, t.bg, 0.45)}"/><stop offset="0.45" stop-color="${red}"/><stop offset="1" stop-color="${mix(red, t.bg, 0.55)}"/></linearGradient>
<linearGradient id="dbtefx-gb-gold" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${mix(bronze, '#ffffff', 0.45)}"/><stop offset="1" stop-color="${mix(bronze, t.bg, 0.3)}"/></linearGradient>
<radialGradient id="dbtefx-gb-gate" cx="0.5" cy="0.75" r="0.8"><stop offset="0" stop-color="${sun}"/><stop offset="0.5" stop-color="${t.warning}"/><stop offset="1" stop-color="${mix(t.warning, t.bg, 0.6)}"/></radialGradient>
<radialGradient id="dbtefx-gb-glow"><stop offset="0" stop-color="${t.warning}" stop-opacity="0.4"/><stop offset="1" stop-color="${t.warning}" stop-opacity="0"/></radialGradient>
<linearGradient id="dbtefx-gb-cdepth" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${shade}" stop-opacity="0.7"/><stop offset="1" stop-color="${shade}" stop-opacity="0"/></linearGradient>
<pattern id="dbtefx-gb-awn" width="80" height="10" patternUnits="userSpaceOnUse"><rect width="80" height="10" fill="${mix(t.text, t.warning, 0.45)}"/><rect width="3" height="10" fill="${mix(red, t.bg, 0.3)}"/></pattern>
<linearGradient id="dbtefx-gb-awnshade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000000" stop-opacity="0.5"/><stop offset="1" stop-color="#000000" stop-opacity="0.1"/></linearGradient>
<radialGradient id="dbtefx-gb-pool"><stop offset="0" stop-color="${sun}" stop-opacity="0.16"/><stop offset="1" stop-color="${sun}" stop-opacity="0"/></radialGradient>
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
${banner(330, 0.8, 0, true)}${banner(560, 0.6, 2, false)}${banner(1040, 0.6, 1, false)}${banner(1270, 0.8, 3, true)}
<!--mid-->
<path d="${edge(0)}L${W + 40} ${H}H-40Z" fill="url(#dbtefx-gb-sand)"/>
<path d="${edge(0)}" stroke="${shade}" stroke-width="6" fill="none"/>
<path d="${sandMarks}" stroke="${shade}" stroke-opacity="0.25" stroke-width="2" fill="none"/>
<ellipse cx="760" cy="760" rx="560" ry="110" fill="url(#dbtefx-gb-pool)"/>
${gate}
<g fill="url(#dbtefx-gb-ray)">${rays}</g>
${aquila}
<!--near-->
<path d="${awn}" fill="url(#dbtefx-gb-awn)" transform="skewX(0)"/>
<path d="${awn}" fill="url(#dbtefx-gb-awnshade)"/>`;
};

export default gladiator;

// Particle systems for this theme (kinds and options: particles.js).
export const particles = [{ kind: 'mote', count: 60, colors: ['warning', 'accent'] }, { kind: 'ash', count: 40, colors: ['muted'], light: true }];
