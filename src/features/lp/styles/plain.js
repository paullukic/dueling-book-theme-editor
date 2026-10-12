// Plain: a flat, quiet bar in the theme's own palette (its page colour for
// the track, its side colours, its LP numeral and ink), a warm red and a cool
// blue on near-black without a theme. A theme may set its numeral face with
// --dbte-lp-font. Low and zero: a danger frame and a striped danger fill, so
// the signal holds even where a theme's danger is its own side colour.

export default (k) => `
${k.border} { border-color: rgba(255, 255, 255, 0.16) !important; border-radius: 7px !important; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.55), inset 0 0 0 1px rgba(0, 0, 0, 0.55) !important; }
${k.bar}, ${k.black} { background: var(--dbt-bg, #14161b) !important; }
${k.bar} { border-radius: 6px !important; }
${k.on(k.self, 'life_bar')} { background: linear-gradient(180deg, rgba(255, 255, 255, 0.16), transparent 55%), var(--dbt-self, #d9452f) !important; }
${k.on(k.opp, 'life_bar')} { background: linear-gradient(180deg, rgba(255, 255, 255, 0.16), transparent 55%), var(--dbt-opp, #2f7fd9) !important; }
${k.txt} { font-family: var(--dbte-lp-font, Arial, sans-serif) !important; color: var(--dbt-lp-num, #ffffff) !important; text-shadow: ${k.outline('var(--dbt-lp-ink, #000000)', 1, '0 1px 2px rgba(0, 0, 0, 0.6)')} !important; font-variant-numeric: tabular-nums; }
${k.when('low', 'life_border')}, ${k.when('zero', 'life_border')} { border-color: var(--dbt-danger, #ff3b2f) !important; }
${k.when('low', 'life_bar')}, ${k.when('zero', 'life_bar')} { background: repeating-linear-gradient(135deg, rgba(255, 255, 255, 0.3) 0 2px, transparent 2px 6px), var(--dbt-danger, #ff3b2f) !important; }
`;
