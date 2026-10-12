// ARC-V: the pendulum fan. A bright gold plate whose right end sweeps down
// and back in a curve, a double gold rim, a pendulum (ring, chain and cyan
// crystal) on the left and a scale of ticks along the bottom that lights up
// to the life left; low dims the gold and runs the ticks red. White heavy numerals with a dark outline on a deeper
// gold band.

const W = 156;
const H = 31;

// low: the same plate, desaturated and dimmed.
const plate = (svg, low = false) =>
  svg(
    W,
    H,
    `<defs>
<filter id="z"><feColorMatrix type="saturate" values=".35"/><feComponentTransfer><feFuncR type="linear" slope=".72"/><feFuncG type="linear" slope=".72"/><feFuncB type="linear" slope=".72"/></feComponentTransfer></filter>
<radialGradient id="g" cx=".45" cy=".35" r=".8"><stop offset="0" stop-color="#fff7a8"/><stop offset=".55" stop-color="#f2d24a"/><stop offset="1" stop-color="#c79a16"/></radialGradient>
<linearGradient id="r" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff2a0"/><stop offset=".5" stop-color="#c8961c"/><stop offset="1" stop-color="#8a6210"/></linearGradient>
<linearGradient id="c" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#e8fdff"/><stop offset=".5" stop-color="#40c8e8"/><stop offset="1" stop-color="#1a6e9a"/></linearGradient>
<linearGradient id="d" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#7a5204" stop-opacity="0"/><stop offset=".3" stop-color="#5a3a00" stop-opacity=".72"/><stop offset="1" stop-color="#5a3a00" stop-opacity=".85"/></linearGradient>
</defs>
<g${low ? ' filter="url(#z)"' : ''}>
<path d="M2 1H148Q155.5 1 155 8.5Q151 27.5 120 30H2Z" fill="url(#g)" stroke="#7a5608"/>
<path d="M4 3H147.4Q153.2 3 152.8 8.6Q149 25.6 120 28H4Z" fill="none" stroke="url(#r)" stroke-width="1.2"/>
<path d="M62 5H147Q152.4 5 151.9 9Q148.6 24.4 121 26.6H62Z" fill="url(#d)"/>
<path d="M5 4.2H130" stroke="#fffbe0" stroke-opacity=".8" stroke-width=".7"/>
<circle cx="9" cy="6.5" r="3.2" fill="none" stroke="url(#r)" stroke-width="1.6"/>
<circle cx="9" cy="6.5" r="1.3" fill="#fff2a0"/>
<path d="M9.4 9.6L13.4 19.5" stroke="#8a6210" stroke-width="1.1" stroke-dasharray="1.2 .6"/>
<path d="M13.8 18.5L17 22.8L13.8 28.6L10.6 22.8Z" fill="url(#c)" stroke="#0e4a6a" stroke-width=".6"/>
<path d="M13.8 19.6L15.6 22.8L13.8 24Z" fill="#fff" fill-opacity=".7"/>
<text x="22" y="12.5" font-family="Arial Black, Arial, sans-serif" font-weight="900" font-size="8" fill="#fff" stroke="#404040" stroke-width="1.6" paint-order="stroke">LP</text>
<path d="M22 24.5H118" stroke="#6a4a08" stroke-opacity=".7" stroke-width="3" stroke-dasharray="1.2 2.8"/>
</g>`,
  );

export default (k) => `
${k.bar} { opacity: 0 !important; }
${k.border} { background: ${k.svgUrl(plate(k.svg))} 0 0 / 100% 100% border-box no-repeat !important; filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.6)) !important; }
${k.border}::before {
  content: "" !important; ${k.box(22, 22.6, 96, 3.8)}
  background: repeating-linear-gradient(90deg, #b8f4ff 0 1.2px, transparent 1.2px 4px);
  -webkit-mask: ${k.fill('#000000')}; mask: ${k.fill('#000000')};
  filter: drop-shadow(0 0 1px #1aa8d8) drop-shadow(0 0 2px #40c8e8);
}
${k.when('low', 'life_border')}, ${k.when('zero', 'life_border')} { background-image: ${k.svgUrl(plate(k.svg, true))} !important; }
${k.when('low', 'life_border')}::before, ${k.when('zero', 'life_border')}::before {
  background: repeating-linear-gradient(90deg, #ffb0a8 0 1.2px, transparent 1.2px 4px);
  filter: drop-shadow(0 0 1px #d81a1a) drop-shadow(0 0 2px #ff3b2f);
}
${k.txt} {
  font-family: "Arial Black", Arial, sans-serif !important; color: #ffffff !important;
  text-shadow: ${k.outline('#2a1c00', 1.4, '0 2px 2px rgba(60, 40, 0, 0.7)')} !important;
}
`;
