import { useState } from 'react';
import { updateSettings, useSettings } from '../lib/settings';
import { useLocal } from '../lib/localStore';
import { contrast } from '../lib/color';
import { AREAS, FONTS, PRESETS, TOKEN_GROUPS, TOKENS, presetById } from '../features/theme/presets';
import { MAX_CODE_LENGTH, MAX_CUSTOM_CSS, decodeTheme, encodeTheme } from '../features/theme/share';
import { ColorRow, Disclosure, Group, SliderRow, ToggleRow } from './controls';

const SWATCH_KEYS = ['bg', 'surface', 'raised', 'accent', 'accent2', 'self', 'opp'];

const sameTokens = (a, b) => TOKENS.every(({ key }) => (a[key] || '').toLowerCase() === (b[key] || '').toLowerCase());

const PresetGallery = ({ s }) => {
  const base = presetById(s.themePreset);
  const edited = !sameTokens(s.themeTokens, base.tokens) || s.themeRadius !== base.radius;
  const pick = (p) => updateSettings({ themePreset: p.id, themeTokens: { ...p.tokens }, themeRadius: p.radius });
  return (
    <>
      <div className="preset-grid" role="group" aria-label="Theme presets">
        {PRESETS.map((p) => {
          const active = s.themePreset === p.id && !edited;
          return (
            <button
              key={p.id}
              type="button"
              className="preset"
              aria-pressed={active}
              onClick={() => pick(p)}
              style={{ '--p-bg': p.tokens.bg, '--p-surface': p.tokens.surface, '--p-text': p.tokens.text, '--p-accent': p.tokens.accent }}
            >
              <span className="preset-swatches" aria-hidden="true">
                {SWATCH_KEYS.map((k) => (
                  <i key={k} style={{ background: p.tokens[k] }} />
                ))}
              </span>
              <span className="preset-name">{p.name}</span>
              <span className="preset-blurb">{p.blurb}</span>
            </button>
          );
        })}
      </div>
      <p className="note">
        <span aria-live="polite">{edited ? `Custom colours, based on ${base.name}.` : `Using ${base.name}.`}</span>
        {edited && (
          <>
            {' '}
            <button type="button" className="link-btn" onClick={() => pick(base)}>
              Reset to {base.name}
            </button>
          </>
        )}
      </p>
    </>
  );
};

const CHECKS = [
  { a: 'text', b: 'surface', min: 4.5, label: 'Text on panels' },
  { a: 'text', b: 'raised', min: 4.5, label: 'Text on buttons' },
  { a: 'muted', b: 'surface', min: 3, label: 'Secondary text on panels' },
  { a: 'accentText', b: 'accent', min: 4.5, label: 'Text on accent' },
  { a: 'link', b: 'surface', min: 4.5, label: 'Links on panels' },
];

const TokenEditor = ({ s }) => {
  const setToken = (key) => (value) => updateSettings({ themeTokens: { ...s.themeTokens, [key]: value } });
  const failing = CHECKS.map((c) => ({ ...c, ratio: contrast(s.themeTokens[c.a], s.themeTokens[c.b]) })).filter((c) => c.ratio < c.min);
  return (
    <>
      <div role="status">
        {failing.length > 0 && (
          <div className="warn-list">
            <strong>Hard to read:</strong>
            <ul>
              {failing.map((c) => (
                <li key={c.label}>
                  {c.label} ({c.ratio.toFixed(1)}:1, aim for {c.min}:1)
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      {TOKEN_GROUPS.map((group) => (
        <div className="token-group" key={group}>
          <h3>{group}</h3>
          {TOKENS.filter((t) => t.group === group).map((t) => (
            <ColorRow key={t.key} label={t.label} value={s.themeTokens[t.key]} onChange={setToken(t.key)} />
          ))}
        </div>
      ))}
    </>
  );
};

// Custom CSS from a theme code waits here until the user chooses to use it;
// it is never applied and never replaces their own CSS on its own.
const ImportedCss = ({ setSaved }) => {
  const [imported, setImported] = useLocal('customCssImported', '');
  if (!imported) return null;
  return (
    <div className="card-callout">
      <h3>A shared theme included custom CSS</h3>
      <p>It is not applied. Read it first: CSS can hide or rearrange anything on the page.</p>
      <label className="sr-only" htmlFor="dbte-imported-css">
        Custom CSS from a theme code
      </label>
      <textarea id="dbte-imported-css" className="field code-box" rows={5} readOnly value={imported} />
      <div className="btn-row">
        <button
          type="button"
          className="btn"
          onClick={() => {
            setSaved(imported);
            setImported('');
          }}
        >
          Use this CSS (replaces mine)
        </button>
        <button type="button" className="btn btn-quiet" onClick={() => setImported('')}>
          Discard
        </button>
      </div>
    </div>
  );
};

const CustomCss = ({ s }) => {
  const [saved, setSaved] = useLocal('customCss', '');
  const value = saved || '';
  return (
    <>
      <ImportedCss setSaved={setSaved} />
      <ToggleRow
        label="Use my CSS"
        description="Applied on top of everything else, on this computer only. Turn it off if the page looks broken."
        checked={s.customCssEnabled}
        onChange={(v) => updateSettings({ customCssEnabled: v })}
      />
      <label className="sr-only" htmlFor="dbte-custom-css">
        Custom CSS
      </label>
      <textarea
        id="dbte-custom-css"
        className="field code-box"
        rows={7}
        spellCheck={false}
        autoCapitalize="off"
        autoComplete="off"
        maxLength={MAX_CUSTOM_CSS}
        placeholder={'#main_menu .menu_btn .content {\n  border-radius: 999px !important;\n}'}
        value={value}
        onChange={(e) => setSaved(e.target.value.slice(0, MAX_CUSTOM_CSS))}
      />
      <p className="note">
        {value.length.toLocaleString()} / {MAX_CUSTOM_CSS.toLocaleString()} characters. Theme colours are available as
        variables, for example <code>var(--dbt-accent)</code>.
      </p>
    </>
  );
};

const ShareTheme = ({ s }) => {
  const [customCss] = useLocal('customCss', '');
  const [, setImported] = useLocal('customCssImported', '');
  const [withCss, setWithCss] = useState(false);
  const [code, setCode] = useState('');
  const [copied, setCopied] = useState('');
  const [paste, setPaste] = useState('');
  const [result, setResult] = useState(null);

  const create = async () => {
    const next = encodeTheme(s, withCss ? customCss : '');
    if (next.length > MAX_CODE_LENGTH) {
      setCode('');
      setCopied('');
      setResult({ error: 'Your custom CSS makes the code too long to share. Untick “Include my custom CSS” or shorten it.' });
      return;
    }
    setResult(null);
    setCode(next);
    try {
      await navigator.clipboard.writeText(next);
      setCopied('Copied. Paste it anywhere to share your theme.');
    } catch (e) {
      setCopied('Select the code below and copy it.');
    }
  };

  const apply = () => {
    const { patch, customCss: css, error } = decodeTheme(paste);
    if (error) {
      setResult({ error });
      return;
    }
    updateSettings(patch);
    if (css) setImported(css);
    setPaste('');
    setResult({
      ok: css ? 'Theme applied. It also included custom CSS: open Custom CSS to read it and choose whether to use it.' : 'Theme applied.',
    });
  };

  return (
    <>
      <p className="note">Copy your colours as a code anyone can paste into their Theme Editor.</p>
      <label className="check-row">
        <input type="checkbox" checked={withCss} onChange={(e) => setWithCss(e.target.checked)} disabled={!customCss} />
        Include my custom CSS
      </label>
      <div className="btn-row">
        <button type="button" className="btn" onClick={create}>
          Copy theme code
        </button>
      </div>
      {copied && (
        <p className="note note-ok" role="status">
          {copied}
        </p>
      )}
      {code && (
        <>
          <label className="sr-only" htmlFor="dbte-theme-code">
            Your theme code
          </label>
          <textarea id="dbte-theme-code" className="field code-box" rows={3} readOnly value={code} onFocus={(e) => e.target.select()} />
        </>
      )}
      <label className="field-label" htmlFor="dbte-theme-paste">
        Paste a theme code
      </label>
      <textarea
        id="dbte-theme-paste"
        className="field code-box"
        rows={3}
        spellCheck={false}
        placeholder="DBTE1:…"
        value={paste}
        onChange={(e) => {
          setPaste(e.target.value);
          setResult(null);
        }}
      />
      <div className="btn-row">
        <button type="button" className="btn" onClick={apply} disabled={!paste.trim()}>
          Apply code
        </button>
      </div>
      {result && (
        <p className={`note ${result.error ? 'note-error' : 'note-ok'}`} role={result.error ? 'alert' : 'status'}>
          {result.error || result.ok}
        </p>
      )}
    </>
  );
};

const ThemeSection = () => {
  const s = useSettings();
  const setAreas = (id) => (v) => updateSettings({ themeAreas: { ...s.themeAreas, [id]: v } });
  return (
    <Group>
      <ToggleRow
        label="Full theme"
        description="Restyles every DuelingBook screen: menus, duel room, deck builder, duels, chat, pop-ups and profiles."
        checked={s.themeEnabled}
        onChange={(v) => updateSettings({ themeEnabled: v })}
      />
      {s.themeEnabled && (
        <>
          <PresetGallery s={s} />
          <SliderRow
            label="Corner roundness"
            value={s.themeRadius}
            min={0}
            max={16}
            step={1}
            format={(v) => (v === 0 ? 'Square' : `${v}px`)}
            onChange={(v) => updateSettings({ themeRadius: v })}
          />
          <SliderRow
            label="Background art"
            value={s.themeBackdrop}
            min={0}
            max={1}
            step={0.05}
            format={(v) => (v === 0 ? 'Hidden' : `${Math.round(v * 100)}%`)}
            onChange={(v) => updateSettings({ themeBackdrop: v })}
          />
          <div className="segmented-row">
            <span id="dbte-font-label">Lettering</span>
            <div className="segmented" role="group" aria-labelledby="dbte-font-label">
              {FONTS.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  aria-pressed={s.themeFont === f.id}
                  onClick={() => updateSettings({ themeFont: f.id })}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
          <Disclosure title="Colours">
            <TokenEditor s={s} />
          </Disclosure>
          <Disclosure title="What to restyle">
            <p className="note">Switch an area off to keep DuelingBook’s own look there.</p>
            {AREAS.map((a) => (
              <ToggleRow key={a.id} label={a.label} description={a.description} checked={!!s.themeAreas[a.id]} onChange={setAreas(a.id)} />
            ))}
          </Disclosure>
        </>
      )}
      <Disclosure title="Custom CSS">
        <CustomCss s={s} />
      </Disclosure>
      <Disclosure title="Share a theme">
        <ShareTheme s={s} />
      </Disclosure>
    </Group>
  );
};

export default ThemeSection;
