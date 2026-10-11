// GX: the Academia duel disk counter. A chamfered gold plate, a vertical
// rainbow gauge (blue at the top, red at the bottom) that drains from the top,
// LED rails and a green dot-matrix status window, and amber seven-segment
// numerals glowing in a dark inset window; five digits are squeezed in place
// (never moved) to stay inside it.

const W = 156;
const H = 31;

const plate = (svg) =>
  svg(
    W,
    H,
    `<defs>
<linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff2b0"/><stop offset=".22" stop-color="#f2cc58"/><stop offset=".55" stop-color="#d09a2e"/><stop offset=".82" stop-color="#a26c18"/><stop offset="1" stop-color="#7a4c0c"/></linearGradient>
<linearGradient id="s" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".45" stop-color="#fff" stop-opacity=".35"/><stop offset=".55" stop-color="#fff" stop-opacity="0"/></linearGradient>
<linearGradient id="w" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#050302"/><stop offset=".6" stop-color="#1a1306"/><stop offset="1" stop-color="#2a1f0a"/></linearGradient>
<pattern id="d" width="2" height="2" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r=".45" fill="#2fbf4a" fill-opacity=".22"/></pattern>
</defs>
<path d="M6.5 .5H141l14.5 4.5V24.5L149 30.5H8L.5 23V6.5Z" fill="url(#g)" stroke="#4a2c05"/>
<path d="M6.9 1.5H140.8l13.7 4.2" fill="none" stroke="#fffbe0" stroke-opacity=".85"/>
<path d="M1.5 22.6V6.9L6.9 1.5" fill="none" stroke="#fffbe0" stroke-opacity=".6"/>
<path d="M154.5 24.2L148.6 29.5H8.4L1.5 22.6" fill="none" stroke="#5c3806" stroke-opacity=".7"/>
<path d="M6.5 .5H141l14.5 4.5V24.5L149 30.5H8L.5 23V6.5Z" fill="url(#s)" opacity=".7"/>
<rect x="3.5" y="3.5" width="17" height="24" rx="1.5" fill="url(#w)" stroke="#5a3606"/>
<path d="M4 27.5h16" stroke="#ffe9a0" stroke-opacity=".55"/>
<rect x="24" y="3.5" width="46" height="4" rx="1" fill="#2a0603" stroke="#5a3606" stroke-width=".6"/>
<path d="M26 5.5h42" stroke="#ff3b24" stroke-width="1.6" stroke-dasharray="4 1.4"/>
<rect x="24" y="9" width="46" height="4" rx="1" fill="#04200a" stroke="#5a3606" stroke-width=".6"/>
<path d="M26 11h30" stroke="#3dff6e" stroke-width="1.6" stroke-dasharray="4 1.4"/>
<path d="M57.4 11h10.6" stroke="#1d6b2c" stroke-width="1.6" stroke-dasharray="4 1.4"/>
<rect x="24" y="15" width="46" height="12.5" rx="1.2" fill="#041007" stroke="#5a3606"/>
<rect x="25" y="16" width="44" height="10.5" fill="url(#d)"/>
<path d="M27 23l2-2 2 1 2-3 2 2 2-1 2 3 2-4 2 3 2-1 2 2 2-2 2 1 2-3 2 2 2-1 2 2 2-1 2 2 2-2" fill="none" stroke="#5dff7a" stroke-width=".9" stroke-dasharray=".9 1.1" stroke-opacity=".9"/>
<path d="M24.5 27.6h45" stroke="#ffe9a0" stroke-opacity=".5"/>
<rect x="72.5" y="3.5" width="80" height="24" rx="2" fill="url(#w)" stroke="#5a3606"/>
<path d="M73 27.6h79" stroke="#ffe9a0" stroke-opacity=".55"/>
<path d="M74 5h77" stroke="#000" stroke-opacity=".6"/>`,
  );

// Band colours of the gauge, top to bottom.
const RAINBOW = 'linear-gradient(180deg, #3b2bd6 0%, #3f6cff 20%, #47b5ff 34%, #ffe94a 46%, #ffbf1f 60%, #ff7a12 76%, #e8141c 100%)';

export default (k) => `
${k.bar} { opacity: 0 !important; }
${k.border} { background: ${k.svgUrl(plate(k.svg))} 0 0 / 100% 100% border-box no-repeat !important; filter: drop-shadow(0 1px 1.5px rgba(0, 0, 0, 0.7)) !important; }
${k.border}::before {
  content: "" !important; ${k.box(5, 5, 14, 21)}
  background:
    linear-gradient(180deg, #0b0703 calc((1 - ${k.lp}) * 100%), transparent 0),
    repeating-linear-gradient(180deg, transparent 0 2.2px, rgba(0, 0, 0, 0.5) 2.2px 3px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.45), rgba(255, 255, 255, 0) 45%, rgba(0, 0, 0, 0.25)),
    ${RAINBOW};
  box-shadow: inset 0 0 2px rgba(0, 0, 0, 0.9);
}
${k.txt} {
  font-family: ${k.SEG_ITALIC} !important; font-weight: 700 !important; color: #ffd94a !important; isolation: isolate;
  text-shadow: 0 0 2px #ff9d00, 0 0 7px rgba(255, 170, 30, 0.75) !important;
}
${k.txt}::before {
  content: "8888" !important; position: absolute; right: 0; top: 0; z-index: -1; color: rgba(255, 200, 80, 0.07); text-shadow: none;
}
${k.when('wide', 'life_txt')} { transform: scaleX(0.8) !important; transform-origin: 100% 50%; }
`;
