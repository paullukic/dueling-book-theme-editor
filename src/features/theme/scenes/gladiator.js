import { mix } from '../../../lib/color.js';
import { anim, H, n1, rng, W } from './kit.js';

// Gladiator Beast: inside the Colosseum at the hour of the games. Sunlight
// rakes the arena; tiers of arches and the crowd ring the sand; the beasts
// wait in the glowing gate to tag in, under an eagle standard and crimson
// banners. The podium carries the archetype's glowing armour lines.
const gladiator = (t) => {
  const rand = rng(29);
  const stone = mix(t.accent, t.bg, 0.7);
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

  // Beast gladiators in silhouette: armoured bodies with profile beast
  // heads. Darius: horse head and mane, scutum. Bestiari: eagle head with a
  // hooked beak, half-raised wings, spear.
  const figure = (x, y, s, kind) => {
    const horse = kind === 'horse';
    const wing = 'M40 -220C90 -250 140 -300 168 -360L164 -326L186 -320L160 -298L180 -288L150 -268L170 -256L132 -244L146 -230L104 -222L110 -206L60 -200Z';
    const arm = 'M-56 -214C-82 -200 -88 -170 -82 -150L-78 -126H-62L-64 -150C-66 -170 -60 -190 -50 -200Z';
    const head = horse
      ? 'M8 -262L14 -300C14 -318 8 -330 -2 -334L-6 -350L-10 -332C-20 -330 -30 -320 -38 -306L-62 -270C-66 -262 -62 -254 -54 -254L-44 -256C-36 -262 -28 -268 -18 -272C-12 -270 -8 -266 -8 -262ZM2 -332L22 -326L12 -318L28 -310L16 -302L30 -292L18 -286L28 -274L14 -268Z'
      : 'M10 -262L14 -300C14 -320 2 -334 -14 -334C-28 -334 -40 -326 -46 -314C-58 -312 -68 -304 -70 -292C-70 -284 -66 -280 -62 -282C-62 -290 -58 -294 -52 -294L-36 -290C-30 -280 -16 -272 -8 -262ZM8 -330L30 -350L22 -330L40 -340L26 -320L44 -322L20 -308Z';
    return `<g transform="translate(${x} ${y}) scale(${s})">
${horse ? '' : `<path d="${wing}" transform="matrix(0.62 0 0 0.62 15 -84)"/><path d="${wing}" transform="matrix(-0.62 0 0 0.62 -15 -84)"/><path d="M62 -330l6 -26l6 26v330h-12Z"/>`}
<path d="M0 -104C-4 -80 -8 -50 -10 -24L-12 -4L-6 0H-30L-28 -6C-30 -40 -36 -70 -34 -96C-36 -116 -40 -128 -38 -140L-46 -128L-42 -150C-36 -170 -40 -186 -50 -200C-58 -206 -66 -210 -68 -216C-72 -230 -60 -242 -44 -240C-34 -238 -22 -234 -12 -232L-10 -244H10L12 -232C22 -234 34 -238 44 -240C60 -242 72 -230 68 -216C66 -210 58 -206 50 -200C40 -186 36 -170 42 -150L46 -128L38 -140C40 -128 36 -116 34 -96C36 -70 30 -40 28 -6L30 0H6L12 -4L10 -24C8 -50 4 -80 0 -104Z"/>
<path d="${arm}"/><path d="${arm}" transform="scale(-1 1)"/>
<rect x="-10" y="-272" width="24" height="38"/><path d="${head}"/>
${horse ? `<path d="M-108 -214h60c6 0 8 4 8 8v96c0 4 -2 8 -8 8h-60c-6 0 -8 -4 -8 -8v-96c0 -4 2 -8 8 -8Z"/><path d="M-106 -204h56v88h-56ZM-78 -204v88" fill="none" stroke="${mix(t.warning, ink, 0.55)}" stroke-width="2.5"/><circle cx="-78" cy="-160" r="9" fill="none" stroke="${mix(t.warning, ink, 0.5)}" stroke-width="2.5"/>` : ''}
<g fill="url(#dbtefx-gb-gold)" stroke="${mix(bronze, ink, 0.5)}" stroke-width="2">
<ellipse cx="-50" cy="-222" rx="22" ry="13"/><ellipse cx="50" cy="-222" rx="22" ry="13"/>
<path d="M-36 -122h72l-4 16h-64Z"/><path d="M-30 -106l-6 40h14l4 -40ZM30 -106l6 40h-14l-4 -40ZM-6 -106h12l-2 44h-8Z"/>
<path d="M-26 -236C-14 -226 14 -226 26 -236L22 -200C10 -192 -10 -192 -22 -200Z"/>
${horse ? '<path d="M2 -330L-6 -346L-10 -330C-22 -326 -34 -314 -42 -300L-58 -272L-48 -266L-34 -290C-24 -306 -10 -318 4 -318Z"/><path d="M-4 -352C6 -366 22 -368 34 -360C22 -356 12 -348 6 -338Z"/>' : '<path d="M14 -300C14 -320 2 -334 -14 -334C-28 -334 -40 -326 -46 -314L-30 -312C-22 -320 -8 -322 4 -314Z"/>'}
</g>
<path d="${horse ? 'M-30 -306L-18 -310L-22 -302Z' : 'M-36 -312L-24 -315L-27 -307Z'}" fill="${sun}" style="animation: dbtefx-gb-blink 7s ease-in-out ${horse ? 0 : -2.5}s infinite; transform-box: fill-box; transform-origin: center;"/>
</g>`;
  };

  // Dust kicked up at the gate's threshold.
  let dust = '';
  for (let i = 0; i < 6; i++) dust += `<ellipse cx="${n1(1180 + i * 36 + rand() * 14)}" cy="${n1(640 - rand() * 8)}" rx="${n1(26 + rand() * 18)}" ry="${n1(10 + rand() * 6)}" fill="url(#dbtefx-gb-dust)" style="animation: dbtefx-gb-dust ${n1(4 + rand() * 2)}s ease-out ${n1(-i * 0.9)}s infinite; transform-box: fill-box; transform-origin: center bottom;"/>`;

  // The gate: the Porta where the beasts wait to tag in, lit from inside.
  const [gx, gy] = [1272, 644];
  const opening = `M${gx - 120} ${gy}V${gy - 190}A120 120 0 0 1 ${gx + 120} ${gy - 190}V${gy}Z`;
  let bars = '';
  for (let i = 0; i < 11; i++) {
    const x = gx - 115 + i * 23;
    bars += `M${x} ${gy - 290}V${n1(gy - 190 - Math.sqrt(Math.max(0, 120 ** 2 - (x - gx) ** 2)))}`;
  }
  const gate = `<path d="M${gx - 150} ${gy}V${gy - 196}A150 150 0 0 1 ${gx + 150} ${gy - 196}V${gy}Z" fill="${stone}"/>
<path d="${opening}" fill="url(#dbtefx-gb-gate)"/>
<clipPath id="dbtefx-gb-door"><path d="${opening}"/></clipPath>
<ellipse cx="${gx}" cy="${gy - 80}" rx="190" ry="200" fill="url(#dbtefx-gb-glow)" ${anim('pulse', 5, 0, 'ease-in-out')}/>
<g clip-path="url(#dbtefx-gb-door)"><g fill="${mix(sun, '#ffffff', 0.35)}" stroke="${mix(sun, '#ffffff', 0.35)}" stroke-width="7" stroke-linejoin="round">${figure(gx + 58, gy - 2, 0.8, 'eagle').split('<g fill="url(#dbtefx-gb-gold)"')[0] + '</g>'}${figure(gx - 40, gy - 2, 0.86, 'horse').split('<g fill="url(#dbtefx-gb-gold)"')[0] + '</g>'}</g><g fill="${ink}">${figure(gx + 58, gy - 2, 0.8, 'eagle')}${figure(gx - 40, gy - 2, 0.86, 'horse')}</g>
<path d="${bars}" stroke="${shade}" stroke-width="5" fill="none"/><path d="M${gx - 120} ${gy - 290}h240" stroke="${shade}" stroke-width="7"/>
<path d="${Array.from({ length: 11 }, (_, i) => `M${gx - 114 + i * 23} ${gy - 290}l4 12l4 -12`).join('')}" fill="${shade}"/></g>
<path d="M${gx - 150} ${gy}V${gy - 196}A150 150 0 0 1 ${gx + 150} ${gy - 196}V${gy}M${gx - 120} ${gy}V${gy - 190}A120 120 0 0 1 ${gx + 120} ${gy - 190}V${gy}" fill="none" stroke="${mix(stone, sun, 0.5)}" stroke-width="3"/>
<path d="M${gx - 16} ${gy - 348}h32l-5 18h-22Z" fill="${bronze}"/>
<ellipse cx="${gx}" cy="${gy + 10}" rx="150" ry="22" fill="${t.warning}" fill-opacity="0.18"/>
${dust}`;

  // Aquila: the eagle standard planted in the sand.
  const [sx, sy] = [1404, 880];
  const eagleWing = 'M4 0C14 -30 34 -62 58 -84L54 -66L66 -64L52 -52L62 -46L48 -38L56 -30L40 -26L44 -16L28 -14C18 -8 10 -4 4 0Z';
  const aquila = `<path d="M${sx - 3} ${sy}V${sy - 520}h6V${sy}Z" fill="${mix(bronze, t.bg, 0.4)}"/>
<path d="M${sx - 54} ${sy - 470}h108" stroke="${bronze}" stroke-width="5"/>
<path d="M${sx - 48} ${sy - 470}h96v130l-48 -16l-48 16Z" fill="url(#dbtefx-gb-cloth)"/>
<path d="M${sx - 48} ${sy - 340}l12 28M${sx - 24} ${sy - 332}l6 28M${sx} ${sy - 324}v28M${sx + 24} ${sy - 332}l-6 28M${sx + 48} ${sy - 340}l-12 28" stroke="${bronze}" stroke-width="3" stroke-linecap="round"/>
<g fill="${bronze}">${wreath(sx, sy - 416, 24, 1.1)}</g>${swords(sx, sy - 416, 1)}
<rect x="${sx - 26}" y="${sy - 382}" width="52" height="11" fill="${bronze}"/><path d="M${sx - 20} ${sy - 376.5}h40" stroke="${mix(red, t.bg, 0.4)}" stroke-width="2" stroke-dasharray="8 4"/>
<circle cx="${sx}" cy="${sy - 500}" r="20" fill="none" stroke="${bronze}" stroke-width="6" stroke-dasharray="5 3"/>
<g fill="url(#dbtefx-gb-gold)" transform="translate(${sx} ${sy - 540})"><path d="${eagleWing}"/><path d="${eagleWing}" transform="scale(-1 1)"/>
<path d="M-10 4C-12 -12 -8 -26 2 -30C10 -30 14 -24 14 -18L22 -14L12 -12C10 -4 8 2 10 8Z"/><path d="M-16 2h32l-6 10h-20Z"/></g>`;

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

  return `<style>@keyframes dbtefx-gb-sway { 0%, 100% { transform: skewX(-3deg); } 50% { transform: skewX(3deg); } }
@keyframes dbtefx-gb-blink { 0%, 90%, 100% { opacity: 1; transform: scaleY(1); } 93%, 95% { opacity: 0.2; transform: scaleY(0.1); } }
@keyframes dbtefx-gb-dust { 0% { transform: translate(0, 0) scale(0.4); opacity: 0; } 25% { opacity: 1; } 100% { transform: translate(-30px, -40px) scale(1.6); opacity: 0; } }</style>
<defs>
<linearGradient id="dbtefx-gb-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${mix(t.accent2, t.bg, 0.75)}"/><stop offset="0.3" stop-color="${mix(t.warning, t.bg, 0.55)}"/><stop offset="0.6" stop-color="${t.bg}"/></linearGradient>
<linearGradient id="dbtefx-gb-wall" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${mix(stone, sun, 0.25)}"/><stop offset="0.55" stop-color="${stone}"/><stop offset="1" stop-color="${mix(stone, t.bg, 0.65)}"/></linearGradient>
<linearGradient id="dbtefx-gb-sand" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${mix(mix(t.warning, t.text, 0.3), t.bg, 0.5)}"/><stop offset="1" stop-color="${mix(t.warning, t.bg, 0.78)}"/></linearGradient>
<linearGradient id="dbtefx-gb-ray" x1="1" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${sun}" stop-opacity="0.36"/><stop offset="1" stop-color="${sun}" stop-opacity="0"/></linearGradient>
<linearGradient id="dbtefx-gb-cloth" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${mix(red, t.bg, 0.45)}"/><stop offset="0.45" stop-color="${red}"/><stop offset="1" stop-color="${mix(red, t.bg, 0.55)}"/></linearGradient>
<linearGradient id="dbtefx-gb-gold" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${mix(bronze, '#ffffff', 0.45)}"/><stop offset="1" stop-color="${mix(bronze, t.bg, 0.3)}"/></linearGradient>
<radialGradient id="dbtefx-gb-gate" cx="0.5" cy="0.75" r="0.8"><stop offset="0" stop-color="${sun}"/><stop offset="0.5" stop-color="${t.warning}"/><stop offset="1" stop-color="${mix(t.warning, t.bg, 0.6)}"/></radialGradient>
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
