import { mix } from '../../../lib/color.js';
import { H, n1, rng, W } from './kit.js';

// GX Tag Force (PSP, 2006-11): Duel Academy's island at dusk, framed like the
// PSP's glossy menus. On the right the island: the smoking volcano, the
// academy's long hall crowned by its glass pyramid between two pylons, and
// the lighthouse on its rock in the far left gutter, its beam sweeping the sky. Across the sea run
// three glossy light ribbons in the dorm colours (red, yellow, blue), like
// the menu waves of the handheld. Signature: the beam's slow sweep.
const tagForce = (t) => {
  const rand = rng(2006);
  const night = mix(t.bg, t.opp, 0.12);
  const dusk = mix(t.accent, t.warning, 0.25);
  const rock = mix(t.bg, t.surface, 0.55);
  const rockLit = mix(rock, t.accent, 0.22);
  const glass = t.accent2;
  const lamp = mix(t.warning, '#ffffff', 0.35);

  // Faint stars in the upper sky.
  let stars = '';
  for (let i = 0; i < 70; i++) stars += `<circle cx="${n1(rand() * W)}" cy="${n1(rand() * 360)}" r="${n1(0.5 + rand() * 1.1)}" fill-opacity="${n1(0.15 + rand() * 0.5)}"/>`;

  // Glossy ribbons: long soft waves, each a bright core over a wide haze.
  const ribbon = (y, amp, k2, dur, delay, k) => {
    const d = `M-200 ${y}C${200 + k} ${y - amp} ${500 + k} ${y + amp} ${900 + k} ${y}S${1500 + k} ${y - amp} ${W + 200} ${y + amp * 0.5}`;
    return `<g style="transform-origin: 800px ${y}px; animation: dbtefx-tf-wave ${dur}s ease-in-out ${n1(-delay)}s infinite;"><path d="${d}" stroke="url(#dbtefx-tf-r${k2})" stroke-opacity="0.22" stroke-width="30"/><path d="${d}" stroke="url(#dbtefx-tf-r${k2})" stroke-width="4"/><path d="${d}" stroke="url(#dbtefx-tf-rib)" stroke-width="1.6"/></g>`;
  };


  // Academy windows: rows of warm lights, a few blinking. The west wing's rows are their own group
  // (in a duel they would show in the gap between the field and the avatar column).
  let windows = '';
  let westWing = '';
  let blink = 0;
  const row = (x0, x1, y, step) => {
    for (let x = x0; x <= x1; x += step) {
      const on = rand() > 0.25;
      if (!on) continue;
      const anim = blink < 6 && rand() > 0.82 ? ` style="animation: dbtefx-pulse ${n1(3 + rand() * 4)}s ease-in-out ${n1(-rand() * 5)}s infinite;"` : '';
      if (anim) blink++;
      const ww = rand() > 0.7 ? 10 : 6;
      const win = `<rect x="${n1(x)}" y="${y}" width="${ww}" height="${rand() > 0.8 ? 6 : 9}" fill="${lamp}" fill-opacity="${n1(0.55 + rand() * 0.4)}"${anim}/>`;
      if (x0 === 1046) westWing += win;
      else windows += win;
    }
  };
  row(1046, 1112, 600, 13);
  row(1250, 1318, 600, 13);
  row(1046, 1112, 618, 13);
  row(1250, 1318, 618, 13);
  row(1142, 1222, 520, 14);
  row(1142, 1222, 545, 14);
  row(1142, 1222, 570, 14);




  // Sea glints near the shore.
  let glints = '';
  for (let i = 0; i < 26; i++) {
    const y = 680 + rand() * 200;
    const x = 980 + rand() * 520;
    glints += `<path d="M${n1(x)} ${n1(y)}h${n1(14 + rand() * 40)}" stroke-opacity="${n1(0.15 + rand() * 0.3)}"/>`;
  }

  // The beam: a cone from the lantern, swept slowly back and forth.
  const LX = 104;
  const LY = 548;

  return `<style>@keyframes dbtefx-tf-wave { 0%, 100% { transform: translateX(0) scaleY(1); } 50% { transform: translateX(-60px) scaleY(1.35); } }
@keyframes dbtefx-tf-beam { 0%, 100% { transform: rotate(-160deg); opacity: 0.5; } 50% { transform: rotate(-70deg); opacity: 0.9; } }
@keyframes dbtefx-tf-smoke { 0% { transform: translate(0, 0) scale(0.7); opacity: 0; } 20% { opacity: 0.5; } 100% { transform: translate(-90px, -150px) scale(1.6); opacity: 0; } }</style>
<defs>
<linearGradient id="dbtefx-tf-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${night}"/><stop offset="0.45" stop-color="${mix(t.bg, t.accent2, 0.18)}"/><stop offset="0.66" stop-color="${mix(t.accent2, t.bg, 0.8)}"/><stop offset="0.72" stop-color="${mix(t.accent2, t.bg, 0.78)}"/><stop offset="1" stop-color="${mix(t.bg, t.accent2, 0.1)}"/></linearGradient>
<radialGradient id="dbtefx-tf-sun" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="${mix(dusk, '#ffffff', 0.4)}" stop-opacity="0.75"/><stop offset="0.35" stop-color="${dusk}" stop-opacity="0.3"/><stop offset="1" stop-color="${dusk}" stop-opacity="0"/></radialGradient>
<linearGradient id="dbtefx-tf-rib" x1="1050" y1="0" x2="1750" y2="0" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#ffffff" stop-opacity="0"/><stop offset="0.5" stop-color="#ffffff" stop-opacity="0.75"/><stop offset="1" stop-color="#ffffff" stop-opacity="0"/></linearGradient>
${[t.self, t.warning, t.opp].map((c, i) => `<linearGradient id="dbtefx-tf-r${i}" x1="1000" y1="0" x2="1300" y2="0" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="${c}" stop-opacity="0"/><stop offset="1" stop-color="${c}" stop-opacity="0.6"/></linearGradient>`).join('')}
<linearGradient id="dbtefx-tf-glass" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${mix(glass, '#ffffff', 0.55)}"/><stop offset="0.45" stop-color="${glass}"/><stop offset="1" stop-color="${mix(glass, t.bg, 0.6)}"/></linearGradient>
<linearGradient id="dbtefx-tf-sea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${mix(t.accent2, t.bg, 0.82)}" stop-opacity="0.9"/><stop offset="0.3" stop-color="${mix(t.accent2, t.bg, 0.8)}" stop-opacity="0.7"/><stop offset="1" stop-color="${t.bg}" stop-opacity="0.9"/></linearGradient>
<linearGradient id="dbtefx-tf-cone" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${lamp}" stop-opacity="0.7"/><stop offset="1" stop-color="${lamp}" stop-opacity="0"/></linearGradient>
<radialGradient id="dbtefx-tf-plume" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="${mix(t.muted, t.accent, 0.2)}" stop-opacity="0.35"/><stop offset="1" stop-color="${mix(t.muted, t.accent, 0.2)}" stop-opacity="0"/></radialGradient>
<linearGradient id="dbtefx-tf-slope" x1="0" y1="0" x2="1" y2="0.3"><stop offset="0" stop-color="${mix(rock, dusk, 0.32)}"/><stop offset="0.45" stop-color="${mix(rock, t.bg, 0.2)}"/><stop offset="1" stop-color="${mix(rock, t.bg, 0.45)}"/></linearGradient>
<linearGradient id="dbtefx-tf-gloss" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff" stop-opacity="0.07"/><stop offset="1" stop-color="#ffffff" stop-opacity="0"/></linearGradient>
</defs>
<rect width="${W}" height="${H}" fill="url(#dbtefx-tf-sky)"/>
<g fill="${t.text}">${stars}</g>
<ellipse cx="1360" cy="630" rx="340" ry="200" fill="url(#dbtefx-tf-sun)"/><ellipse cx="1360" cy="636" rx="240" ry="56" fill="url(#dbtefx-tf-sun)"/>
<path d="M0 0H${W}V340Q800 250 0 330Z" fill="url(#dbtefx-tf-gloss)"/>
<!--mid-->
<g transform="translate(100 4) translate(1330 650) scale(1.1) translate(-1330 -650)">
<g fill="url(#dbtefx-tf-plume)">
<ellipse cx="1340" cy="292" rx="46" ry="30" style="animation: dbtefx-tf-smoke 12s ease-out 0s infinite; transform-box: fill-box; transform-origin: center;"/>
<ellipse cx="1346" cy="296" rx="50" ry="32" style="animation: dbtefx-tf-smoke 12s ease-out -4s infinite; transform-box: fill-box; transform-origin: center;"/>
<ellipse cx="1336" cy="294" rx="42" ry="28" style="animation: dbtefx-tf-smoke 12s ease-out -8s infinite; transform-box: fill-box; transform-origin: center;"/>
</g>
<path d="M1110 640L1250 440Q1300 360 1330 332H1372Q1400 360 1450 430L1600 600V660H1110Z" fill="url(#dbtefx-tf-slope)"/>
<path d="M1330 332H1372Q1400 360 1450 430L1600 600V610L1440 450Q1400 400 1372 340Z" fill="${rockLit}" fill-opacity="0.55"/>
<path d="M960 652Q1000 618 1060 628L1100 640L1440 628Q1520 624 1600 640V700H940Z" fill="${rock}"/>
<path d="M960 652Q1000 618 1060 628L1100 640L1440 628Q1520 624 1600 640" fill="none" stroke="${rockLit}" stroke-width="2.5"/>
<path d="M975 664Q1040 652 1120 660T1300 656M990 678Q1080 668 1200 674T1460 668" fill="none" stroke="${rockLit}" stroke-opacity="0.35" stroke-width="1.5"/>
<path d="M1110 640L1250 440Q1300 360 1330 332" fill="none" stroke="${dusk}" stroke-opacity="0.55" stroke-width="2.5"/>
<g fill="${mix(rock, t.surface, 0.35)}" stroke="${mix(rock, t.text, 0.25)}" stroke-width="1.5">
<path d="M1036 640V590H1124V640Z"/><path d="M1240 640V590H1328V640Z"/>
<path d="M1132 640V506H1232V640Z"/>
<path d="M1102 640V470L1110 444L1118 470V640Z"/><path d="M1246 640V470L1254 444L1262 470V640Z"/>
</g>
<path d="M1124 506L1182 404L1240 506Z" fill="url(#dbtefx-tf-glass)" stroke="${mix(glass, '#ffffff', 0.5)}" stroke-width="2"/>
<path d="M1182 404L1240 506H1196Z" fill="${mix(glass, t.bg, 0.55)}" fill-opacity="0.75"/>
<path d="M1182 404L1124 506H1150Z" fill="${mix(dusk, '#ffffff', 0.3)}" fill-opacity="0.35"/>
<path d="M1182 404L1182 506M1165 434H1199M1153 455H1211M1141 476H1223M1130 497H1234M1182 404L1152 506M1182 404L1212 506" stroke="${mix(glass, '#ffffff', 0.6)}" stroke-opacity="0.45" stroke-width="1.2"/>
<path d="M1124 506H1240" stroke="${dusk}" stroke-width="3"/>
<path d="M1130 498L1182 410L1170 498Z" fill="#ffffff" fill-opacity="0.18"/>
<path d="M1036 590H1328" stroke="${dusk}" stroke-opacity="0.7" stroke-width="2"/>
<path d="M1036 640V590H1124M1132 640V506M1102 640V470L1110 444M1246 640V470L1254 444M1240 640V590" fill="none" stroke="${dusk}" stroke-opacity="0.75" stroke-width="2"/>
${windows}<g class="dbtefx-tf-westwing">${westWing}</g>

</g>
<path d="M${LX - 60} 660Q${LX - 34} 626 ${LX - 6} 636L${LX + 24} 642Q${LX + 44} 650 ${LX + 56} 664V700H${LX - 66}Z" fill="${rock}"/><path d="M${LX - 60} 660Q${LX - 34} 626 ${LX - 6} 636L${LX + 24} 642Q${LX + 44} 650 ${LX + 56} 664" fill="none" stroke="${rockLit}" stroke-width="2"/>
<g transform="translate(${LX} ${LY})"><path d="M-9 92L-6 6H6L9 92Z" fill="${mix(t.text, rock, 0.35)}"/><path d="M-8 30H8M-8 58H8" stroke="${t.self}" stroke-width="7"/><rect x="-9" y="-6" width="18" height="13" fill="${lamp}"/><path d="M-12 -6L0 -20L12 -6Z" fill="${mix(rock, t.text, 0.2)}"/></g>
<g transform="translate(${LX} ${LY})"><g style="animation: dbtefx-tf-beam 14s ease-in-out infinite; transform-origin: 0 0;"><path d="M0 0L120 -18L120 18Z" fill="url(#dbtefx-tf-cone)"/></g><circle r="16" fill="${lamp}" fill-opacity="0.45"/></g>
<!--near-->
<rect y="660" width="${W}" height="${H - 660}" fill="url(#dbtefx-tf-sea)"/>
<path d="M1110 668H1340" stroke="${lamp}" stroke-opacity="0.3" stroke-width="3"/>
<g stroke="${mix(dusk, '#ffffff', 0.5)}" stroke-width="2" stroke-linecap="round">${glints}</g>
<g fill="none">
${ribbon(770, 26, 0, 17, 0, 0)}
${ribbon(800, 22, 1, 21, 6, -120)}
${ribbon(832, 30, 2, 19, 11, 90)}
</g>`;
};

export default tagForce;

// Particle systems for this theme (kinds and options: particles.js).
export const particles = [{ kind: 'star', count: 40, colors: ['text'] }, { kind: 'mote', count: 14, colors: ['warning', 'accent2'], rise: true, speed: 0.5 }];
