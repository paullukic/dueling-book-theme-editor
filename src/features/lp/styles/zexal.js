// ZEXAL: the D-Gazer overlay. A flattened violet glass hexagon in a pale
// metal frame, red-and-gold rivet lenses on its ends, "LP" and the number in
// pale yellow. A crystal bar under "LP" carries the life left.

const W = 156;
const H = 31;

const rivet = (x, y) =>
  `<circle cx="${x}" cy="${y}" r="2.6" fill="#e0c060" stroke="#5a4a20" stroke-width=".5"/><circle cx="${x}" cy="${y}" r="1.6" fill="#c0302a"/><circle cx="${x - 0.5}" cy="${y - 0.5}" r=".55" fill="#fff" fill-opacity=".8"/>`;

const plate = (svg) =>
  svg(
    W,
    H,
    `<defs>
<linearGradient id="v" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c25ae6"/><stop offset=".35" stop-color="#9a28c8"/><stop offset="1" stop-color="#5c107e"/></linearGradient>
<linearGradient id="f" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f4f4fa"/><stop offset=".5" stop-color="#b8b8c6"/><stop offset="1" stop-color="#e2e2ec"/></linearGradient>
</defs>
<path d="M9 1H147L155 15.5L147 30H9L1 15.5Z" fill="url(#f)" stroke="#5e5e70" stroke-width=".8"/>
<path d="M10.6 3.4H145.4L152.2 15.5L145.4 27.6H10.6L3.8 15.5Z" fill="url(#v)" stroke="#8a8a9a" stroke-width=".8"/>
<path d="M11.4 4.4H144.6L147.6 9.8H8.4Z" fill="#fff" fill-opacity=".16"/>
<path d="M4.5 15.5L10.6 3.4" stroke="#fff" stroke-opacity=".35" stroke-width=".6"/>
${rivet(6, 9)}${rivet(6, 22)}${rivet(150, 9)}${rivet(150, 22)}
<text x="15" y="13" font-family="Arial Black, Arial, sans-serif" font-weight="900" font-size="7.5" fill="#f4eea0">LP</text>
<rect x="14.5" y="17" width="54" height="5" rx="1" fill="#2c0640" stroke="#d8b8f0" stroke-opacity=".5" stroke-width=".6"/>`,
  );

export default (k) => `
${k.root} { --lp-hit: #ff3355; }
${k.bar} { opacity: 0 !important; }
${k.border} { background: ${k.svgUrl(plate(k.svg))} 0 0 / 100% 100% border-box no-repeat !important; filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.65)) drop-shadow(0 0 4px rgba(190, 80, 255, 0.45)) !important; }
${k.border}::before {
  content: "" !important; ${k.box(15.5, 18, 52, 3)}
  background: repeating-linear-gradient(90deg, transparent 0 5px, rgba(44, 6, 64, 0.9) 5px 6px), ${k.fill('#f4eea0', 'transparent')};
  box-shadow: 0 0 4px rgba(244, 238, 160, 0.6);
}
${k.txt} {
  font-family: "Arial Black", Arial, sans-serif !important; color: #f6f0a8 !important;
  text-shadow: ${k.outline('#3c0a58', 1, '0 0 6px rgba(255, 240, 140, 0.75)')} !important;
}
`;
