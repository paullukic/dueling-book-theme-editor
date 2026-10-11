// OLED: true black, drawn with light. Tiles are outlines only (white
// hairlines on black), hover fills them with a breath of white, pop-ups get a
// hairline frame, and the deck bands are neutral grey. No colour, no glow.

export default (t, { SEL, sel, alpha }) => `
${SEL.tile} { background: transparent !important; box-shadow: inset 0 0 0 1px ${alpha(t.text, 0.5)} !important; }
${SEL.tileHover} { background: ${alpha(t.text, 0.07)} !important; box-shadow: inset 0 0 0 1px ${t.text} !important; }
${sel(['#main_menu .menu_btn:active .content'])} { background: ${alpha(t.text, 0.14)} !important; box-shadow: inset 0 0 0 1px ${t.text} !important; }
${SEL.dialog} { box-shadow: 0 0 0 1px ${alpha(t.text, 0.55)}, 0 24px 60px -20px #000000 !important; }
${sel(['#deck_constructor', '#siding'])} { --dbt-band: ${t.text}; }
`;
