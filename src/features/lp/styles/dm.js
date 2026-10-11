// Duel Monsters: the Battle City era counter. A brushed-steel plate with a
// thin light inset frame, "LP" and the number in chrome bold-italic serif
// with a dark outline. A slim engraved rail under "LP", lit in the Battle
// City disk's red, carries the life left.

const W = 156;
const H = 31;

const plate = (svg) =>
  svg(
    W,
    H,
    `<defs>
<linearGradient id="m" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d6d3cb"/><stop offset=".45" stop-color="#a7a49b"/><stop offset=".55" stop-color="#99968d"/><stop offset="1" stop-color="#bdb9b0"/></linearGradient>
<linearGradient id="r" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#000" stop-opacity="0"/><stop offset=".5" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".22"/></linearGradient>
<pattern id="b" width="6" height="31" patternUnits="userSpaceOnUse" patternTransform="skewX(-35)"><rect width="1" height="31" fill="#fff" fill-opacity=".16"/><rect x="3" width=".6" height="31" fill="#000" fill-opacity=".07"/></pattern>
<linearGradient id="c" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset=".5" stop-color="#c9c9c9"/><stop offset=".56" stop-color="#8d8d8d"/><stop offset="1" stop-color="#f2f2f2"/></linearGradient>
</defs>
<rect x=".5" y=".5" width="155" height="30" rx="3" fill="url(#m)" stroke="#45433d"/>
<rect x=".5" y=".5" width="155" height="30" rx="3" fill="url(#b)"/>
<rect x=".5" y=".5" width="155" height="30" rx="3" fill="url(#r)"/>
<rect x="2.5" y="2.5" width="151" height="26" rx="1.5" fill="none" stroke="#f4f1e8" stroke-opacity=".85"/>
<rect x="3.5" y="3.5" width="149" height="24" rx="1" fill="none" stroke="#5a5850" stroke-opacity=".55"/>
<text x="8" y="16" font-family="Times New Roman, Georgia, serif" font-weight="700" font-style="italic" font-size="14" fill="url(#c)" stroke="#1f1e1a" stroke-width="1.1" paint-order="stroke">LP</text>
<rect x="8.5" y="20.5" width="56" height="4" rx="1" fill="#2a2926" stroke="#f4f1e8" stroke-opacity=".7"/>`,
  );

export default (k) => `
${k.bar} { opacity: 0 !important; }
${k.border} { background: ${k.svgUrl(plate(k.svg))} 0 0 / 100% 100% border-box no-repeat !important; filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.6)) !important; }
${k.border}::before {
  content: "" !important; ${k.box(9, 21, 55, 3)}
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.55), rgba(255, 255, 255, 0) 60%), ${k.fill('#c8202a', 'transparent')};
}
${k.txt} {
  font-family: "Times New Roman", Georgia, serif !important; font-style: italic !important; font-weight: 700 !important;
  background: linear-gradient(180deg, #ffffff 0%, #e2e2e2 46%, #8a8a8a 54%, #f4f4f4 100%) !important; -webkit-background-clip: text !important; background-clip: text !important;
  color: transparent !important; -webkit-text-fill-color: transparent; -webkit-text-stroke: 0.8px #26251f;
  filter: drop-shadow(1px 1px 0 rgba(0, 0, 0, 0.55)) drop-shadow(0 0 1px rgba(0, 0, 0, 0.6)) !important;
}
${k.when('zero', 'life_txt')} { -webkit-text-fill-color: currentColor; }
`;
