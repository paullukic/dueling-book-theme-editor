// 5D's: the round counter. A rainbow medallion (red rim to magenta core) in a
// notched steel-blue bezel with "LP" at its heart, joined to a steel-blue
// plate with the D-Wheel monitor's rising LED bars (lit to the life left),
// where the number sits
// in heavy white italic with a black outline.
// The rainbow darkens clockwise as life is lost.

const W = 156;
const H = 31;

const plate = (svg) =>
  svg(
    W,
    H,
    `<defs>
<linearGradient id="p" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#a8d0e8"/><stop offset=".12" stop-color="#5f8db4"/><stop offset=".5" stop-color="#2b4a6e"/><stop offset=".88" stop-color="#1b3150"/><stop offset="1" stop-color="#4c76a0"/></linearGradient>
<linearGradient id="w" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0c1830"/><stop offset="1" stop-color="#1b2f52"/></linearGradient>
</defs>
<path d="M14 2.5H141a13 13 0 0 1 0 26H14Z" fill="url(#p)" stroke="#0e1b2e"/>
<path d="M30 6H139a9.5 9.5 0 0 1 0 19H30Z" fill="url(#w)" stroke="#a8d0e8" stroke-opacity=".55"/>
<path d="M31 24.6H139" stroke="#a8d0e8" stroke-opacity=".35"/>

<path d="M33.5 23.6H64" stroke="#a8d0e8" stroke-opacity=".4" stroke-width=".6"/>
<g fill="#a8d0e8" fill-opacity=".55"><rect x="36" y="3.6" width="5" height="1.2" rx=".6"/><rect x="44" y="3.6" width="5" height="1.2" rx=".6"/><rect x="52" y="3.6" width="5" height="1.2" rx=".6"/></g>`,
  );

// The medallion's bezel: a steel-blue ring with radial notches, open centre.
const bezel = (svg) =>
  svg(
    33,
    33,
    `<defs><linearGradient id="b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c4e2f4"/><stop offset=".45" stop-color="#5f8db4"/><stop offset="1" stop-color="#22405f"/></linearGradient></defs>
<circle cx="16.5" cy="16.5" r="14.75" fill="none" stroke="url(#b)" stroke-width="3.2"/>
<circle cx="16.5" cy="16.5" r="16" fill="none" stroke="#0e1b2e"/>
<circle cx="16.5" cy="16.5" r="13" fill="none" stroke="#0e1b2e" stroke-width=".7"/>
<g stroke="#1b3150" stroke-width="1.1" stroke-opacity=".8">${Array.from({ length: 16 }, (_, i) => {
      const a = (i * Math.PI) / 8;
      const p = (r) => `${(16.5 + r * Math.cos(a)).toFixed(2)} ${(16.5 + r * Math.sin(a)).toFixed(2)}`;
      return `<path d="M${p(13.5)}L${p(16)}"/>`;
    }).join('')}</g>`,
  );

// The D-Wheel monitor's rising bars, lit up to the life left.
const leds = (svg) => svg(30, 12, `<g fill-opacity=".95" transform="translate(-34 -11)"><rect x="34.0" y="20.0" width="2.8" height="2.6" rx=".5" fill="#e8202a"/><rect x="38.2" y="18.6" width="2.8" height="4.0" rx=".5" fill="#ff5a1c"/><rect x="42.4" y="17.2" width="2.8" height="5.4" rx=".5" fill="#ff8a1c"/><rect x="46.6" y="15.8" width="2.8" height="6.8" rx=".5" fill="#ffc21c"/><rect x="50.8" y="14.4" width="2.8" height="8.2" rx=".5" fill="#ffe23a"/><rect x="55.0" y="13.0" width="2.8" height="9.6" rx=".5" fill="#b8e83a"/><rect x="59.2" y="11.6" width="2.8" height="11.0" rx=".5" fill="#3cdc5a"/></g>`);

const RAINBOW = 'radial-gradient(circle closest-side, #e04ae0 0 18%, #3a5cff 32%, #2fd2ff 44%, #3cdc5a 56%, #ffe23a 67%, #ff8a1c 76%, #e8202a 84%)';

export default (k) => `
${k.bar} { opacity: 0 !important; }
${k.border} { background: ${k.svgUrl(plate(k.svg))} 0 0 / 100% 100% border-box no-repeat !important; filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.7)) !important; }
${k.border}::before {
  content: "LP" !important; ${k.box(-1, -1, 33, 33)} border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font: italic 900 9px "Arial Black", Arial, sans-serif; color: #ffffff; text-shadow: ${k.outline('#000000', 1)};
  background: ${k.svgUrl(bezel(k.svg))} center / 100% 100% no-repeat,
    conic-gradient(from 0deg, transparent calc(${k.lp} * 360deg), rgba(8, 16, 34, 0.86) calc(${k.lp} * 360deg)),
    ${RAINBOW};
}
${k.border}::after {
  content: "" !important; ${k.box(34, 11, 30, 12)}
  background: ${k.svgUrl(leds(k.svg))} 0 0 / 100% 100% no-repeat;
  -webkit-mask: ${k.fill('#000000', 'rgba(0, 0, 0, 0.2)')}; mask: ${k.fill('#000000', 'rgba(0, 0, 0, 0.2)')};
}
${k.txt} {
  font-family: "Arial Black", Arial, sans-serif !important; font-style: italic !important; color: #ffffff !important;
  text-shadow: ${k.outline('#000000', 1.3, '0 0 6px rgba(120, 200, 255, 0.55)')} !important;
}
`;
