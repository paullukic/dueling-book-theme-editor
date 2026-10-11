// Plain: a flat, quiet bar. Side colours from the theme when one is on,
// a warm red and a cool blue without.

export default (k) => `
${k.border} { border-color: rgba(255, 255, 255, 0.16) !important; border-radius: 7px !important; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.55), inset 0 0 0 1px rgba(0, 0, 0, 0.55) !important; }
${k.bar}, ${k.black} { background: #14161b !important; }
${k.bar} { border-radius: 6px !important; }
${k.on(k.self, 'life_bar')} { background: linear-gradient(180deg, rgba(255, 255, 255, 0.16), transparent 55%), var(--dbt-self, #d9452f) !important; }
${k.on(k.opp, 'life_bar')} { background: linear-gradient(180deg, rgba(255, 255, 255, 0.16), transparent 55%), var(--dbt-opp, #2f7fd9) !important; }
${k.txt} { color: #ffffff !important; text-shadow: 0 1px 2px rgba(0, 0, 0, 0.9), 0 0 1px #000000 !important; font-variant-numeric: tabular-nums; }
${k.when('low', 'life_border')}, ${k.when('zero', 'life_border')} { border-color: var(--dbt-danger, #ff3b2f) !important; }
`;
