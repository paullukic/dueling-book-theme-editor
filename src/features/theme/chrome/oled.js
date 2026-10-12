// OLED: true black, drawn with light. Tiles are outlines only (white
// hairlines on black), hover fills them with a breath of white, pop-ups get a
// hairline frame, and the deck bands are neutral grey. No glow; the only
// colour is the side colour on the lit phase disc and the teal OK plate.
import { deepForWhite } from '../../../lib/color.js';

// Pop-up OK / Yes: a flat teal plate (the link colour) with black lettering.
const popBtn = (t, text) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 153.4 78.47"><rect x="6" y="10" width="141.4" height="58.5" rx="4" fill="${t.link}"/><text x="76.7" y="40" dominant-baseline="central" text-anchor="middle" font-family="Segoe UI, system-ui, Roboto, Arial, sans-serif" font-weight="700" font-size="26" fill="#000000">${text}</text></svg>`;

export default (t, { SEL, sel, alpha, svgUrl }) => {
  const popImg = (name) => sel([`#content img[src*="/svg/${name}"]`, `#content img[data-src*="/svg/${name}"]`]);
  const popCss = [['ok_btn', 'OK'], ['yes_btn', 'Yes']].map(([n, text]) => `${popImg(n)} { content: ${svgUrl(popBtn(t, text))} !important; }`).join('\n');
  return `
${SEL.tile} { background: transparent !important; box-shadow: inset 0 0 0 1px ${alpha(t.text, 0.4)} !important; }
${SEL.tileHover} { background: ${alpha(t.text, 0.07)} !important; box-shadow: inset 0 0 0 1px #d8d8d8 !important; }
${sel(['#main_menu .menu_btn:active .content'])} { background: ${alpha(t.text, 0.14)} !important; box-shadow: inset 0 0 0 1px #d8d8d8 !important; }
${SEL.dialog} { box-shadow: 0 0 0 1px ${alpha(t.text, 0.55)}, 0 24px 60px -20px #000000 !important; }
${sel(['#deck_constructor', '#siding'])} { --dbt-band: ${t.text}; }
${sel(['#content .cout_txt', '#chats .chat .chat_background', '#chats .chat .chat_bottom'])} { background: #000000 !important; border-color: #222222 !important; }
${sel(['#duel .phase .background'])} { background: #d8d8d8 !important; }
${SEL.life} { border-color: #d8d8d8 !important; }
${sel(['#duel .phase .background .background_top'])} { background: none !important; }
${sel(['#duel .phase .background .background_inner', '#duel .phase .phase_inner.red', '#duel .phase .phase_inner.blue'])} { background: #000000 !important; }
${sel(['#duel .phase span'])} { color: ${t.text} !important; text-shadow: none !important; }
${sel(['#duel .phase.active .phase_inner.red'])} { background: ${deepForWhite(t.self)} !important; }
${sel(['#duel .phase.active .phase_inner.blue'])} { background: ${deepForWhite(t.opp)} !important; }
${sel(['#duel .phase.active span'])} { color: #ffffff !important; }
${popCss}
`;
};
