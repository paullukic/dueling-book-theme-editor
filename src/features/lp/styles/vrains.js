// VRAINS: the Link VRAINS HUD. A dark indigo data bar with a chevron tip, a
// metal hexagon cap with a green hex ring, and a cyan rail along its foot whose
// glow runs as far as the life left, an "LP" tab riding on it. Big white numerals
// with a navy outline.

const W = 156;
const H = 31;

const plate = (svg) =>
  svg(
    W,
    H,
    `<defs>
<linearGradient id="b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2c2556" stop-opacity=".96"/><stop offset="1" stop-color="#141232" stop-opacity=".96"/></linearGradient>
<linearGradient id="h" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d8dee6"/><stop offset=".5" stop-color="#8a94a2"/><stop offset="1" stop-color="#4c5462"/></linearGradient>
<pattern id="x" width="6" height="5.2" patternUnits="userSpaceOnUse"><path d="M0 2.6L1.5 0H4.5L6 2.6L4.5 5.2H1.5Z" fill="none" stroke="#5a7cff" stroke-opacity=".14" stroke-width=".5"/></pattern>
</defs>
<path d="M12 3.5H145L152.5 15.5L145 27.5H12Z" fill="url(#b)" stroke="#0a0a20"/>
<path d="M12 3.5H145L152.5 15.5L145 27.5H12Z" fill="url(#x)"/>
<path d="M146.5 6L153.8 15.5L146.5 25" fill="none" stroke="#e8f4ff" stroke-width="1.4"/>
<path d="M36 25.4H143" stroke="#30e8e8" stroke-opacity=".18" stroke-width="2.2"/>
<path d="M20 23.2H34L36 27.6H20Z" fill="#30e8e8"/>
<text x="22" y="27" font-family="Arial Black, Arial, sans-serif" font-weight="900" font-size="4.6" fill="#0a1030">LP</text>
<path d="M11 4.5L19.7 9.5V19.5L11 24.5L2.3 19.5V9.5Z" transform="translate(0 1)" fill="url(#h)" stroke="#2a3040" stroke-width=".8"/>
<path d="M11 11.6L14.3 13.5V17.5L11 19.4L7.7 17.5V13.5Z" fill="#0c1a12" stroke="#40c060" stroke-width="1.2"/>
<path d="M3.2 10.8L11 6.3" stroke="#fff" stroke-opacity=".6" stroke-width=".6"/>`,
  );

export default (k) => `
${k.bar} { opacity: 0 !important; }
${k.border} { background: ${k.svgUrl(plate(k.svg))} 0 0 / 100% 100% border-box no-repeat !important; filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.7)) !important; }
${k.border}::before {
  content: "" !important; ${k.box(36, 24.3, 107, 2.2)}
  background: linear-gradient(90deg, #a8ffff, #30e8e8 calc(${k.lp} * 100%), transparent calc(${k.lp} * 100%));
  filter: drop-shadow(0 0 2px #30e8e8) drop-shadow(0 0 4px rgba(48, 232, 232, 0.6));
}
${k.txt} {
  font-family: "Arial Black", Arial, sans-serif !important; color: #ffffff !important;
  text-shadow: ${k.outline('#0d1238', 1.3, '0 0 8px rgba(80, 200, 255, 0.45)')} !important;
}
`;
