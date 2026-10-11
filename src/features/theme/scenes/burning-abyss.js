import { mix } from '../../../lib/color.js';
import { n1, rng } from './kit.js';

// Burning Abyss: the Inferno seen from its rim. On the far rim stands the
// Gate of Hell, its inscription glowing; below it nine terraced circles fall
// away to a sulphur-white pit. Smoke climbs out of the abyss and Malebranche
// glide over it; one crouches on the gate's apex like a gargoyle, wings
// spread. In the foreground Dante the Pilgrim, seen from behind on a rock,
// laurel-crowned, holds his book out like a lamp toward the Gate.
const burningAbyss = (t) => {
  const rand = rng(77);
  const sulphur = t.accent;
  const sulphurLit = mix(t.accent, '#ffffff', 0.55);
  const ember = t.accent2;
  const bone = t.text;
  const ash = t.muted;
  const ink = mix(t.bg, '#000000', 0.55);
  const rock = mix(t.bg, t.raised, 0.7);

  // The funnel: nine circles, outer first, so each inner (lower) one hides
  // the near wall of the one above and only the far walls show, brighter the
  // deeper they go.
  const [fx, fy] = [1250, 566];
  const level = (i) => {
    const f = i / 8;
    const rx = 300 - f * 262;
    const ry = rx * 0.44;
    // The near (lower) edges stay nested inside the rim: a hole, not a stack.
    return { f, rx: n1(rx), ry: n1(ry), cy: n1(fy + (132 - ry) - i * 4) };
  };
  let circles = '';
  let ledges = '';
  let cracks = '';
  let walls = '';
  for (let i = 0; i < 9; i++) {
    const { f, rx, ry, cy } = level(i);
    const next = level(Math.min(8, i + 1));
    const wall = mix(mix(rock, ember, 0.1 + f * 0.3), sulphur, f * f * 0.45);
    walls += `<linearGradient id="dbtefx-ba-w${i}" gradientUnits="userSpaceOnUse" x1="0" y1="${n1(cy - ry)}" x2="0" y2="${i < 8 ? n1(next.cy - next.ry) : n1(cy + ry)}"><stop offset="0" stop-color="${mix(wall, ink, 0.45)}"/><stop offset="1" stop-color="${wall}"/></linearGradient>`;
    circles += `<ellipse cx="${fx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="url(#dbtefx-ba-w${i})"/>`;
    ledges += `<path d="M${n1(fx - rx)} ${cy}A${rx} ${ry} 0 0 1 ${n1(fx + rx)} ${cy}" stroke-opacity="${n1(0.2 + f * 0.6)}"/>`;
    for (let k = 0; k < 5; k++) {
      const an = Math.PI * (1.1 + rand() * 0.8);
      const x0 = n1(fx + Math.cos(an) * rx * 0.98);
      const y0 = n1(cy + Math.sin(an) * ry * 0.98);
      cracks += `M${x0} ${y0}l${n1((rand() - 0.5) * 4)} ${n1(5 + rand() * 6)}l${n1((rand() - 0.5) * 5)} ${n1(4 + rand() * 5)}`;
    }
  }
  const pitY = level(8).cy;

  // Smoke plumes rising out of the pit and fading.
  const smoke = Array.from({ length: 6 }, (_, i) => {
    const x = n1(fx - 40 + i * 16 + (rand() - 0.5) * 20);
    const s = n1(46 + rand() * 36);
    return `<ellipse cx="${x}" cy="${pitY - 16}" rx="${s}" ry="${n1(s * 0.7)}" fill="url(#dbtefx-ba-smoke)" style="animation: dbtefx-ba-rise ${n1(14 + i * 2.2)}s ease-out ${n1(-i * 3.1)}s infinite; transform-box: fill-box; transform-origin: center;"/>`;
  }).join('');

  // A Malebranche in flight, seen from below: bat wings flapping slowly, horns, a whip tail.
  const flyer = (x, y, s, dur, delay) => {
    const wing = (d) => `<path d="M0 0C${n1(d * 14 * s)} ${n1(-16 * s)} ${n1(d * 34 * s)} ${n1(-20 * s)} ${n1(d * 52 * s)} ${n1(-12 * s)}L${n1(d * 46 * s)} ${n1(-4 * s)}L${n1(d * 40 * s)} ${n1(2 * s)}L${n1(d * 30 * s)} ${n1(-1 * s)}L${n1(d * 22 * s)} ${n1(5 * s)}L${n1(d * 12 * s)} ${n1(2 * s)}Z"/>`;
    return `<g transform="translate(${x} ${y})"><g style="animation: dbtefx-ba-glide ${dur}s ease-in-out ${n1(-delay)}s infinite;"><g style="animation: dbtefx-ba-flap ${n1(1.8 + s * 0.4)}s ease-in-out ${n1(-delay)}s infinite;">${wing(1)}${wing(-1)}</g><path d="M0 ${n1(-9 * s)}L${n1(2.6 * s)} ${n1(-4 * s)}L${n1(2 * s)} ${n1(9 * s)}L0 ${n1(16 * s)}L${n1(-2 * s)} ${n1(9 * s)}L${n1(-2.6 * s)} ${n1(-4 * s)}Z"/><path d="M${n1(-1.6 * s)} ${n1(-8 * s)}L${n1(-4 * s)} ${n1(-14 * s)}M${n1(1.6 * s)} ${n1(-8 * s)}L${n1(4 * s)} ${n1(-14 * s)}M0 ${n1(15 * s)}Q${n1(5 * s)} ${n1(24 * s)} ${n1(-2 * s)} ${n1(32 * s)}" fill="none" stroke="${ink}" stroke-width="${n1(1.4 * s)}"/></g></g>`;
  };
  const flyers = flyer(1120, 560, 1.5, 17, 0) + flyer(1330, 610, 1.1, 21, 7) + flyer(1240, 500, 1.9, 25, 13);

  // Jagged ridges.
  const ridge = (y0, amp, seed, step, x0 = -20, x1 = 1620) => {
    const r = rng(seed);
    let d = `M${x0} 900V${y0}`;
    for (let x = x0; x <= x1; x += step) d += `L${x} ${n1(y0 - r() * amp)}`;
    return `${d}L${x1} ${y0}V900Z`;
  };

  // The Gate of Hell on the far rim: a pointed arch of dark stone, its
  // jambs and voussoirs lit from below, the inscription a sulphur band.
  const [gx, gy] = [1250, 448];
  let voussoirs = '';
  for (let i = 0; i <= 14; i++) {
    const a = Math.PI * (1 + i / 14);
    const side = i < 7 ? -1 : 1;
    const ox = gx + side * 40;
    const r1 = 112;
    const r2 = 140;
    const [x1, y1] = [n1(ox + Math.cos(a) * r1), n1(gy - 200 + Math.sin(a) * r1)];
    const [x2, y2] = [n1(ox + Math.cos(a) * r2), n1(gy - 200 + Math.sin(a) * r2)];
    if ((side < 0 && x1 < gx + 2) || (side > 0 && x1 > gx - 2)) voussoirs += `M${x1} ${y1}L${x2} ${y2}`;
  }
  const gate = `<g transform="translate(${gx} ${gy}) scale(0.62) translate(${-gx} ${-gy})">
<path d="M${gx - 180} ${gy}V${gy - 200}C${gx - 180} ${gy - 300} ${gx - 90} ${gy - 360} ${gx} ${gy - 396}C${gx + 90} ${gy - 360} ${gx + 180} ${gy - 300} ${gx + 180} ${gy - 200}V${gy}Z" fill="${ink}"/>
<path d="M${gx - 152} ${gy}V${gy - 200}C${gx - 152} ${gy - 282} ${gx - 76} ${gy - 334} ${gx} ${gy - 364}C${gx + 76} ${gy - 334} ${gx + 152} ${gy - 282} ${gx + 152} ${gy - 200}V${gy}Z" fill="url(#dbtefx-ba-gatestone)"/>
<path d="M${gx - 112} ${gy}V${gy - 196}C${gx - 112} ${gy - 256} ${gx - 56} ${gy - 296} ${gx} ${gy - 320}C${gx + 56} ${gy - 296} ${gx + 112} ${gy - 256} ${gx + 112} ${gy - 196}V${gy}Z" fill="url(#dbtefx-ba-gatevoid)"/>
<path d="${voussoirs}" stroke="${ink}" stroke-width="3"/>
<path d="M${gx - 152} ${gy - 210}H${gx - 112}M${gx + 112} ${gy - 210}H${gx + 152}M${gx - 152} ${gy - 140}H${gx - 112}M${gx + 112} ${gy - 140}H${gx + 152}M${gx - 152} ${gy - 70}H${gx - 112}M${gx + 112} ${gy - 70}H${gx + 152}" stroke="${ink}" stroke-width="3"/>
<path d="M${gx - 128} ${gy - 236}C${gx - 112} ${gy - 296} ${gx - 52} ${gy - 334} ${gx} ${gy - 350}C${gx + 52} ${gy - 334} ${gx + 112} ${gy - 296} ${gx + 128} ${gy - 236}" fill="none" stroke="${sulphur}" stroke-width="5" stroke-dasharray="7 4 3 4 10 4 5 4" stroke-opacity="0.8" style="animation: dbtefx-pulse 7s ease-in-out infinite;"/>
<path d="M${gx - 180} ${gy}V${gy - 200}C${gx - 180} ${gy - 300} ${gx - 90} ${gy - 360} ${gx} ${gy - 396}" fill="none" stroke="${ember}" stroke-opacity="0.35" stroke-width="2"/>
</g>`;

  // Mirror a half-path (drawn for the left side) to the right.
  const mirror = (d) => d.replace(/(-?\d+(?:\.\d+)?) (-?\d+(?:\.\d+)?)/g, (m, x, y) => `${n1(-x)} ${y}`);
  const pair = (d) => d + mirror(d);

  // Dante the Pilgrim in the foreground, seen from behind on a rock above
  // the abyss: red traveller's tunic, satchel strap, sword at the hip, dark
  // braid under the laurel crown, holding his book out like a lamp toward
  // the Gate. Lit from the pit on his left, in shadow on his right.
  let wreath = '';
  for (let i = 0; i < 11; i++) {
    const an = Math.PI * (0.05 + i * 0.09);
    const lx = n1(Math.cos(an) * 26);
    const ly = n1(-372 - Math.sin(an) * 6);
    wreath += `<ellipse cx="${lx}" cy="${ly}" rx="6" ry="2.6" transform="rotate(${n1(-25 + i * 6)} ${lx} ${ly})"/>`;
  }
  const dante = `<g transform="translate(1322 892) scale(1.05)">
<ellipse cx="-128" cy="-346" rx="110" ry="110" fill="url(#dbtefx-ba-book)" style="animation: dbtefx-pulse 5s ease-in-out infinite;"/>
<path d="M-40 -244L-88 -112" stroke="${ink}" stroke-width="9" stroke-linecap="round"/><path d="M-50 -256L-30 -246" stroke="${sulphurLit}" stroke-width="4" stroke-linecap="round"/>
<path d="${pair('M-6 -150L-28 -146L-26 -64L-24 -14L-38 0H-8L-8 -14L-6 -64Z')}" fill="${ink}"/>
<path d="M-28 -146L-26 -64L-24 -14" stroke="${sulphur}" stroke-opacity="0.5" stroke-width="2"/>
<path d="${pair('M0 -252H-38C-44 -212 -52 -172 -58 -142C-30 -134 -10 -136 0 -138Z')}" fill="url(#dbtefx-ba-tunic)"/>
<path d="${pair('M0 -342H-30C-46 -340 -56 -332 -58 -318C-54 -292 -44 -270 -38 -252H0Z')}" fill="url(#dbtefx-ba-tunic)"/>
<path d="M-40 -256H40V-244H-40Z" fill="${ink}"/>
<path d="M-38 -336L42 -240" stroke="${mix(ash, ink, 0.55)}" stroke-width="8"/>
<path d="M30 -250H62V-212C62 -206 58 -202 52 -202H36C32 -202 30 -206 30 -212Z" fill="${mix(ash, ink, 0.6)}" stroke="${ink}" stroke-width="2"/>
<path d="M52 -322Q66 -290 62 -262Q60 -236 58 -214" fill="none" stroke="${ink}" stroke-width="15" stroke-linecap="round"/>
<path d="M-50 -326Q-80 -320 -94 -298" fill="none" stroke="url(#dbtefx-ba-tunic)" stroke-width="19" stroke-linecap="round"/>
<path d="M-94 -298Q-110 -316 -120 -338" fill="none" stroke="${ink}" stroke-width="13" stroke-linecap="round"/>
<path d="M-8 -352H8V-336H-8Z" fill="${ink}"/>
<ellipse cx="0" cy="-364" rx="24" ry="28" fill="${ink}"/>
<path d="M-4 -342C-6 -320 2 -300 -2 -270C2 -292 10 -318 6 -342Z" fill="${ink}"/>
<path d="M-2 -332l6 8M-2 -318l6 8M-2 -304l5 8" stroke="${mix(ink, t.accent2, 0.3)}" stroke-width="1.6"/>
<g fill="${sulphur}">${wreath}</g>
<path d="M-24 -364C-24 -384 -12 -392 0 -392M-58 -318C-54 -292 -44 -270 -38 -252C-44 -212 -52 -172 -58 -142M-50 -334Q-80 -326 -96 -306" fill="none" stroke="${sulphurLit}" stroke-opacity="0.75" stroke-width="2.2"/>
<path d="M58 -318C54 -292 44 -270 38 -252C44 -212 52 -172 58 -142" fill="none" stroke="${ember}" stroke-opacity="0.35" stroke-width="2"/>
<path d="M-142 -344L-128 -354L-114 -346L-114 -330L-128 -338L-142 -330Z" fill="${sulphurLit}"/><path d="M-128 -354V-338" stroke="${sulphur}" stroke-width="1.2"/>
</g>`;
  const outcrop = `<path d="M1240 920L1262 880L1300 862L1350 858L1400 870L1470 866L1520 852L1580 846L1640 850V920Z" fill="url(#dbtefx-ba-spire)"/><path d="M1262 880L1300 862L1350 858L1400 870L1470 866L1520 852L1580 846L1640 850" fill="none" stroke="${ember}" stroke-opacity="0.5" stroke-width="2.4"/>`;

  // The crouching Malebranche on the gate: horned bone skull, hunched
  // shoulders, long clawed arms gripping the rock, bat wings half raised.
  const [mx, my] = [1250, 156];
  const demonWing = (d) => {
    const s = (v) => n1(v * d);
    return `<g style="transform-origin: ${s(18)}px -36px; animation: dbtefx-ba-wing${d > 0 ? 'r' : 'l'} 10s ease-in-out infinite;"><path d="M${s(18)} -36C${s(60)} -110 ${s(110)} -170 ${s(170)} -206L${s(160)} -152L${s(196)} -134L${s(156)} -100L${s(180)} -72L${s(138)} -58L${s(148)} -26L${s(100)} -22L${s(28)} -10Z" fill="url(#dbtefx-ba-wing${d > 0 ? 'r' : 'l'})" stroke="${mix(ember, t.bg, 0.3)}" stroke-opacity="0.6" stroke-width="1.4"/><path d="M${s(18)} -36L${s(170)} -206M${s(76)} -110L${s(196)} -134M${s(64)} -80L${s(180)} -72M${s(50)} -52L${s(148)} -26" fill="none" stroke="${ink}" stroke-width="3" stroke-linecap="round"/></g>`;
  };
  const half = {
    // Haunch and crouched leg: thigh out to the knee, shin down to clawed toes on the rock.
    leg: 'M-20 20C-40 18 -60 34 -64 58C-66 76 -60 92 -50 100L-58 110L-46 108L-40 112L-34 106L-26 108L-30 96C-36 80 -34 62 -24 48Z',
    // Arm: shoulder cap, upper arm out to the elbow, forearm in to the claws gripping the edge.
    arm: 'M-36 -46C-58 -44 -70 -22 -70 0C-70 18 -62 34 -50 44C-44 60 -38 80 -30 96L-40 112L-28 106L-24 114L-18 104L-10 110L-14 94C-20 74 -26 54 -30 40C-36 26 -40 8 -36 -10Z',
    // Horn: thick at the temple, sweeping out, then back and up to a hooked tip.
    horn: 'M-10 -76C-26 -78 -40 -86 -46 -100C-50 -112 -46 -124 -38 -132C-42 -120 -40 -108 -32 -98C-26 -92 -16 -88 -6 -86Z',
    socket: 'M-12 -70C-8 -72 -3 -70 -2 -66C-4 -62 -10 -62 -13 -65Z',
  };
  const both = (d) => `${d}${mirror(d)}`;
  const demon = `<g transform="translate(${mx} ${my + 6}) scale(0.42)">
${demonWing(-1)}${demonWing(1)}
<path d="${both(half.leg)}" fill="url(#dbtefx-ba-body)"/>
<path d="M-36 -48C-22 -60 22 -60 36 -48C44 -30 40 0 30 22C20 36 -20 36 -30 22C-40 0 -44 -30 -36 -48Z" fill="url(#dbtefx-ba-body)"/>
<path d="${both(half.arm)}" fill="url(#dbtefx-ba-body)"/>
<path d="M-36 -46C-58 -44 -70 -22 -70 0C-70 18 -62 34 -50 44C-44 60 -38 80 -30 96" fill="none" stroke="${ember}" stroke-opacity="0.7" stroke-width="2"/>
<path d="M36 -46C58 -44 70 -22 70 0C70 18 62 34 50 44C44 60 38 80 30 96" fill="none" stroke="${sulphur}" stroke-opacity="0.5" stroke-width="2"/>
<path d="${both(half.horn)}" fill="url(#dbtefx-ba-horn)"/>
<path d="M-14 -58C-20 -70 -18 -86 0 -90C18 -86 20 -70 14 -58C10 -48 6 -40 0 -38C-6 -40 -10 -48 -14 -58Z" fill="url(#dbtefx-ba-skull)"/>
<path d="M-15 -72C-8 -76 8 -76 15 -72" fill="none" stroke="${ink}" stroke-opacity="0.6" stroke-width="2"/>
<path d="${both(half.socket)}M-2 -56L0 -50L2 -56Z" fill="${ink}"/>
<path d="M-9 -67.5h3M6 -67.5h3" stroke="${sulphurLit}" stroke-width="2" stroke-linecap="round" style="animation: dbtefx-pulse 4s ease-in-out infinite;"/>
</g>`;

  return `<style>@keyframes dbtefx-ba-rise { 0% { transform: translate(0, 0) scale(0.5); opacity: 0; } 15% { opacity: 0.9; } 100% { transform: translate(-40px, -460px) scale(2.4); opacity: 0; } }
@keyframes dbtefx-ba-flap { 0%, 100% { transform: scaleY(1); } 50% { transform: scaleY(-0.3); } }
@keyframes dbtefx-ba-glide { 0%, 100% { transform: translate(0, 0) rotate(-6deg); } 50% { transform: translate(-70px, -26px) rotate(8deg); } }
@keyframes dbtefx-ba-wingl { 0%, 100% { transform: rotate(0deg); } 50% { transform: rotate(-7deg); } }
@keyframes dbtefx-ba-wingr { 0%, 100% { transform: rotate(0deg); } 50% { transform: rotate(7deg); } }
@keyframes dbtefx-ba-breathe { 0%, 100% { opacity: 0.7; transform: scale(0.94); } 50% { opacity: 1; transform: scale(1.08); } }</style>
<defs>${walls}
<linearGradient id="dbtefx-ba-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${ink}"/><stop offset="0.5" stop-color="${t.bg}"/><stop offset="1" stop-color="${mix(t.bg, ember, 0.2)}"/></linearGradient>
<radialGradient id="dbtefx-ba-haze" cx="0.79" cy="0.62" r="0.55"><stop offset="0" stop-color="${sulphur}" stop-opacity="0.3"/><stop offset="0.45" stop-color="${ember}" stop-opacity="0.12"/><stop offset="1" stop-color="${ember}" stop-opacity="0"/></radialGradient>
<linearGradient id="dbtefx-ba-ground" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${mix(rock, ember, 0.14)}"/><stop offset="0.06" stop-color="${rock}"/><stop offset="1" stop-color="${mix(ink, rock, 0.35)}"/></linearGradient>
<linearGradient id="dbtefx-ba-gatestone" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="${mix(rock, ember, 0.45)}"/><stop offset="0.5" stop-color="${mix(rock, ember, 0.15)}"/><stop offset="1" stop-color="${rock}"/></linearGradient>
<linearGradient id="dbtefx-ba-gatevoid" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="${mix(sulphur, ember, 0.4)}" stop-opacity="0.75"/><stop offset="0.45" stop-color="${mix(t.bg, ember, 0.3)}"/><stop offset="1" stop-color="${ink}"/></linearGradient>
<radialGradient id="dbtefx-ba-pit"><stop offset="0" stop-color="#ffffff" stop-opacity="0.95"/><stop offset="0.2" stop-color="${sulphurLit}" stop-opacity="0.9"/><stop offset="0.5" stop-color="${sulphur}" stop-opacity="0.5"/><stop offset="1" stop-color="${ember}" stop-opacity="0"/></radialGradient>
<radialGradient id="dbtefx-ba-rimglow"><stop offset="0.55" stop-color="${ember}" stop-opacity="0.2"/><stop offset="1" stop-color="${ember}" stop-opacity="0"/></radialGradient>
<radialGradient id="dbtefx-ba-smoke"><stop offset="0" stop-color="${mix(ash, sulphur, 0.5)}" stop-opacity="0.55"/><stop offset="1" stop-color="${ash}" stop-opacity="0"/></radialGradient>
<radialGradient id="dbtefx-ba-book"><stop offset="0" stop-color="${sulphurLit}" stop-opacity="0.8"/><stop offset="1" stop-color="${sulphur}" stop-opacity="0"/></radialGradient>
<linearGradient id="dbtefx-ba-body" x1="0" y1="0" x2="1" y2="0.3"><stop offset="0" stop-color="${mix(ember, ink, 0.35)}"/><stop offset="0.25" stop-color="${ink}"/><stop offset="0.8" stop-color="${ink}"/><stop offset="1" stop-color="${mix(ember, ink, 0.55)}"/></linearGradient>
<linearGradient id="dbtefx-ba-horn" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="${mix(bone, ink, 0.3)}"/><stop offset="1" stop-color="${ink}"/></linearGradient>
<linearGradient id="dbtefx-ba-skull" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${mix(bone, ink, 0.5)}"/><stop offset="1" stop-color="${mix(bone, ink, 0.85)}"/></linearGradient>
<linearGradient id="dbtefx-ba-wingl" x1="1" y1="1" x2="0" y2="0"><stop offset="0" stop-color="${ink}" stop-opacity="0.95"/><stop offset="1" stop-color="${mix(ember, t.bg, 0.45)}" stop-opacity="0.9"/></linearGradient>
<linearGradient id="dbtefx-ba-wingr" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="${ink}" stop-opacity="0.95"/><stop offset="1" stop-color="${mix(ember, t.bg, 0.55)}" stop-opacity="0.9"/></linearGradient>
<linearGradient id="dbtefx-ba-tunic" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${mix(t.danger, sulphur, 0.25)}"/><stop offset="0.35" stop-color="${mix(t.danger, t.bg, 0.45)}"/><stop offset="1" stop-color="${mix(t.danger, ink, 0.75)}"/></linearGradient>
<linearGradient id="dbtefx-ba-spire" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${mix(rock, ember, 0.3)}"/><stop offset="0.3" stop-color="${ink}"/></linearGradient>
</defs>
<rect width="1600" height="900" fill="url(#dbtefx-ba-sky)"/>
<rect width="1600" height="900" fill="url(#dbtefx-ba-haze)"/>
<path d="${ridge(400, 150, 5, 52)}" fill="${mix(t.bg, rock, 0.55)}"/>
${gate}
${demon}
<!--mid-->
<path d="${ridge(fy - 136, 22, 9, 30)}" fill="url(#dbtefx-ba-ground)"/>
<ellipse cx="${fx}" cy="${fy + 20}" rx="460" ry="230" fill="url(#dbtefx-ba-rimglow)"/>
<g>${circles}</g>
<path d="${cracks}" fill="none" stroke="${ink}" stroke-opacity="0.65" stroke-width="1.4"/>
<g fill="none" stroke="${sulphur}" stroke-width="1.6">${ledges}</g>
<path d="M${fx - 300} ${fy}A300 132 0 0 0 ${fx + 300} ${fy}" fill="none" stroke="${ember}" stroke-opacity="0.5" stroke-width="2.4"/>
<ellipse cx="${fx}" cy="${pitY}" rx="96" ry="44" fill="url(#dbtefx-ba-pit)" style="animation: dbtefx-ba-breathe 6s ease-in-out infinite; transform-box: fill-box; transform-origin: center;"/>
${smoke}
<g fill="${ink}">${flyers}</g>
<!--near-->
${outcrop}
${dante}
`;
};

export default burningAbyss;

// Particle systems for this theme (kinds and options: particles.js).
export const particles = [
  { kind: 'ember', count: 46, colors: ['accent2', 'accent'] },
  { kind: 'ash', count: 40, colors: ['muted'], light: true },
];
