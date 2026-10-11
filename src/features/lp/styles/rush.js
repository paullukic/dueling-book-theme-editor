// Rush Duel (SEVENS, Go Rush!!): a chunky lime-glass panel in a silver and
// white double frame with chamfered right corners, an orange inner line and
// an orange faceted gem badge carrying "LP". The inner line along the bottom
// fills to the life left. Blocky white numerals with a dark double outline.

const W = 156;
const H = 31;

const plate = (svg) =>
  svg(
    W,
    H,
    `<defs>
<linearGradient id="l" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#eefaa8"/><stop offset=".5" stop-color="#c8ea78"/><stop offset="1" stop-color="#9ccc54"/></linearGradient>
<linearGradient id="o" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ffd23a"/><stop offset="1" stop-color="#f08a1a"/></linearGradient>
<linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe060"/><stop offset=".5" stop-color="#f7a21c"/><stop offset="1" stop-color="#e06a10"/></linearGradient>
</defs>
<path d="M14 1H149L155 7V24L149 30H14Z" fill="#8a9098"/>
<path d="M15 2H148.6L154 7.4V23.6L148.6 29H15Z" fill="#f6f8fa"/>
<path d="M17 4H147.4L151.6 8.2V22.8L147.4 27H17Z" fill="url(#l)" stroke="url(#o)" stroke-width="1"/>
<path d="M18 5H147L150.6 8.6V12C120 10 70 13 18 11Z" fill="#fff" fill-opacity=".35"/>
<path d="M13 2L24 7.5V23.5L13 29L2 23.5V7.5Z" fill="url(#g)" stroke="#ffffff" stroke-width="1.6"/>
<path d="M13 2L24 7.5V23.5L13 29L2 23.5V7.5Z" fill="none" stroke="#a04a08" stroke-width=".5"/>
<path d="M13 4.6L21.6 8.9L13 13.2L4.4 8.9Z" fill="#fff" fill-opacity=".38"/>
<path d="M2.6 13H23.4V19H2.6Z" fill="#e8600c"/>
<text x="13" y="18.2" text-anchor="middle" font-family="Arial Black, Arial, sans-serif" font-weight="900" font-size="6.2" fill="#ffffff">LP</text>`,
  );

export default (k) => `
${k.bar} { opacity: 0 !important; }
${k.border} { background: ${k.svgUrl(plate(k.svg))} 0 0 / 100% 100% border-box no-repeat !important; filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.6)) !important; }
${k.border}::before {
  content: "" !important; ${k.box(27, 24.4, 120, 2)}
  background: ${k.fill('#f08a1a', 'rgba(240, 138, 26, 0.18)')};
  border-radius: 1px;
}
${k.txt} {
  font-family: "Arial Black", Arial, sans-serif !important; color: #ffffff !important;
  text-shadow: ${k.outline('#55606c', 0.9)}, ${k.outline('#1f2a12', 1.8)} !important;
}
`;
