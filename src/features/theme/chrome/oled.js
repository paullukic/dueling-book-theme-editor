// OLED: true black, drawn with light. Tiles are outlines only (white
// hairlines on black), hover fills them with a breath of white, pop-ups get a
// hairline frame, and the deck bands are neutral grey. No colour, no glow.

export default (t, { SEL, sel, alpha }) => `
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
${sel(['#duel .phase.active .phase_inner.red', '#duel .phase.active .phase_inner.blue'])} { background: #e6e6e6 !important; }
${sel(['#duel .phase.active span'])} { color: #000000 !important; }
`;
