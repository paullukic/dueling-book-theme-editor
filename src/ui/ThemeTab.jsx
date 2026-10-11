import { useState } from 'react';
import { updateSettings, useSettings } from '../lib/settings';
import { useLocal } from '../lib/localStore';
import { contrast } from '../lib/color';
import { CARD_TEXT_SIZES, DEFAULT_PSCT_COLORS } from '../lib/defaults';
import { AREAS, FONTS, PRESETS, PRESET_GROUPS, TOKEN_GROUPS, TOKENS, presetById } from '../features/theme/presets';
import { MAX_CODE_LENGTH, MAX_CUSTOM_CSS, THEME_KEYS, decodeTheme, encodeTheme } from '../features/theme/share';
import { ColorRow, Disclosure, Group, SliderRow, ToggleRow } from './controls';
import BackgroundPicker from './BackgroundPicker';

// The Theme tab, split into four short views so nothing is buried:
// Style (presets, shape, lettering, colours), Background, Card text, More.
const VIEWS = [
  { id: 'style', label: 'Style' },
  { id: 'background', label: 'Background' },
  { id: 'cards', label: 'Text' },
  { id: 'more', label: 'More' },
];
// Remembered while the page is open, so reopening the panel keeps the view.
let lastView = 'style';

const set = (key) => (value) => updateSettings({ [key]: value });
const SWATCH_KEYS = ['bg', 'surface', 'accent', 'accent2', 'self', 'opp'];

const sameTokens = (a, b) => TOKENS.every(({ key }) => (a[key] || '').toLowerCase() === (b[key] || '').toLowerCase());
const isEdited = (s) => {
  const base = presetById(s.themePreset);
  return !sameTokens(s.themeTokens, base.tokens) || s.themeRadius !== base.radius;
};
const snapshot = (s) => Object.fromEntries(['themeEnabled', ...THEME_KEYS].map((k) => [k, s[k]]));

const PresetPicker = ({ s, onPick }) => (
  <>
    {PRESET_GROUPS.map((g) => (
      <div key={g.id} className="preset-group">
        <h3 className="preset-group-title" id={`dbte-presets-${g.id}`}>
          {g.label}
        </h3>
        <div className="preset-chips" role="group" aria-labelledby={`dbte-presets-${g.id}`}>
          {PRESETS.filter((p) => p.group === g.id).map((p) => (
            <button
              key={p.id}
              type="button"
              className="preset-chip"
              aria-pressed={s.themeEnabled && s.themePreset === p.id && !isEdited(s)}
              title={p.blurb}
              onClick={() => onPick(p)}
              style={{ '--p-surface': p.tokens.surface, '--p-text': p.tokens.text, '--p-accent': p.tokens.accent }}
            >
              <span className="preset-chip-swatches" aria-hidden="true">
                {SWATCH_KEYS.map((k) => (
                  <i key={k} style={{ background: p.tokens[k] }} />
                ))}
              </span>
              <span className="preset-chip-name">{p.name}</span>
            </button>
          ))}
        </div>
      </div>
    ))}
  </>
);

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

const ShareTheme = ({ s, onBeforeApply }) => {
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
    onBeforeApply(patch, !!css);
    updateSettings(patch);
    if (css) setImported(css);
    setPaste('');
    setResult({
      ok: css
        ? 'Theme applied (Undo is at the top). It also included custom CSS: open Custom CSS to read it and choose whether to use it.'
        : 'Theme applied. Undo is at the top if you change your mind.',
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

const StyleView = ({ s, onPick }) => {
  const base = presetById(s.themePreset);
  const edited = isEdited(s);
  let status = 'Theme is off: DuelingBook looks as usual.';
  if (s.themeEnabled) status = edited ? `Custom colours, based on ${base.name}.` : `Using ${base.name}.`;
  return (
    <>
      <Group>
        <ToggleRow
          label="Full theme"
          description="Restyles every DuelingBook screen. Pick a look below to start."
          checked={s.themeEnabled}
          onChange={set('themeEnabled')}
        />
        <PresetPicker s={s} onPick={onPick} />
        <p className="note theme-status">
          <span aria-live="polite">{status}</span>
          {s.themeEnabled && edited && (
            <button type="button" className="link-btn" onClick={() => onPick(base)}>
              Reset
            </button>
          )}
        </p>
      </Group>
      {s.themeEnabled && (
        <Group title="Shape and lettering">
          <SliderRow
            label="Corner roundness"
            value={s.themeRadius}
            min={0}
            max={16}
            step={1}
            format={(v) => (v === 0 ? 'Square' : `${v}px`)}
            onChange={set('themeRadius')}
          />
          <div className="segmented-row">
            <span id="dbte-font-label">Lettering</span>
            <div className="segmented" role="group" aria-labelledby="dbte-font-label">
              {FONTS.map((f) => (
                <button key={f.id} type="button" aria-pressed={s.themeFont === f.id} onClick={() => updateSettings({ themeFont: f.id })}>
                  {f.label}
                </button>
              ))}
            </div>
          </div>
          <Disclosure title="Edit colours">
            <TokenEditor s={s} />
          </Disclosure>
        </Group>
      )}
    </>
  );
};

const BackgroundView = ({ s }) => (
  <>
    <Group title="Your own background">
      <ToggleRow
        label="Use an image"
        description="Any picture behind DuelingBook. It is shrunk and stored on this computer only."
        checked={s.backgroundEnabled}
        onChange={set('backgroundEnabled')}
      >
        <BackgroundPicker />
        <SliderRow
          label="Image strength"
          value={s.backgroundOpacity}
          min={0.1}
          max={1}
          step={0.05}
          format={(v) => `${Math.round(v * 100)}%`}
          onChange={set('backgroundOpacity')}
        />
      </ToggleRow>
    </Group>
    <Group title="DuelingBook’s background art">
      {s.themeEnabled ? (
        <SliderRow
          label="Circuit-board art"
          value={s.themeBackdrop}
          min={0}
          max={1}
          step={0.05}
          format={(v) => (v === 0 ? 'Hidden' : `${Math.round(v * 100)}%`)}
          onChange={set('themeBackdrop')}
        />
      ) : (
        <p className="note">Turn on the Full theme (Style) to dim or hide DuelingBook’s own background art.</p>
      )}
    </Group>
  </>
);

const CardTextView = ({ s }) => {
  const setPsctColor = (k) => (v) => updateSettings({ psctColors: { ...s.psctColors, [k]: v } });
  return (
    <>
    <Group title="Card text">
      <ToggleRow
        label="Colour card text"
        description="Colours each part of an effect: when it activates, its cost or target, what it does, and its limits. Works for Pendulum and Rush Duel cards too."
        checked={s.psctEnabled}
        onChange={set('psctEnabled')}
      >
        <ColorRow label="Condition (before :)" value={s.psctColors.condition} onChange={setPsctColor('condition')} />
        <ColorRow label="Cost or target (before ;)" value={s.psctColors.cost} onChange={setPsctColor('cost')} />
        <ColorRow label="Effect" value={s.psctColors.effect} onChange={setPsctColor('effect')} />
        <ColorRow label="Limits (once per turn…)" value={s.psctColors.restriction} onChange={setPsctColor('restriction')} />
        <button type="button" className="btn btn-quiet" onClick={() => updateSettings({ psctColors: DEFAULT_PSCT_COLORS })}>
          Reset colours
        </button>
      </ToggleRow>
      <SliderRow
        label="Card text size"
        value={s.cardTextSize}
        values={CARD_TEXT_SIZES}
        format={(v) => (v === 0 ? 'Default' : `${v}px`)}
        onChange={set('cardTextSize')}
      />
    </Group>
    <Group title="Chat and log text">
      <SliderRow
        label="Text size"
        value={s.readingTextScale}
        min={0.85}
        max={1.6}
        step={0.05}
        format={(v) => (v === 1 ? 'Default' : `${Math.round(v * 100)}%`)}
        onChange={set('readingTextScale')}
      />
      <p className="note">Chat windows, the duel log, messages and the news bulletin. Buttons and menus keep their size so nothing overlaps.</p>
    </Group>
    </>
  );
};

const MoreView = ({ s, onBeforeApply }) => {
  const setAreas = (id) => (v) => updateSettings({ themeAreas: { ...s.themeAreas, [id]: v } });
  const setMenu = (k) => (v) => updateSettings({ menuColors: { ...s.menuColors, [k]: v } });
  const pct = (v) => `${Math.round(v * 100)}%`;
  return (
    <>
      <Group title="Theme extras">
        <Disclosure title="Share a theme">
          <ShareTheme s={s} onBeforeApply={onBeforeApply} />
        </Disclosure>
        {s.themeEnabled && (
          <Disclosure title="What to restyle">
            <p className="note">Switch an area off to keep DuelingBook’s own look there.</p>
            {AREAS.map((a) => (
              <ToggleRow key={a.id} label={a.label} description={a.description} checked={!!s.themeAreas[a.id]} onChange={setAreas(a.id)} />
            ))}
          </Disclosure>
        )}
        <Disclosure title="Custom CSS">
          <CustomCss s={s} />
        </Disclosure>
      </Group>
      <Group title="Main menu">
        <ToggleRow
          label="Compact buttons"
          description="Shorter main menu buttons so the whole menu fits on small screens."
          checked={s.smallerMenu}
          onChange={set('smallerMenu')}
        />
        <ToggleRow
          label="Button colours"
          description={
            s.themeEnabled && s.themeAreas.menu
              ? 'The full theme styles these buttons now. To use your own colours, switch off Main menu under What to restyle.'
              : 'Pick the fill, border and glow of the main menu buttons.'
          }
          checked={s.menuColorsEnabled}
          onChange={set('menuColorsEnabled')}
        >
          <ColorRow label="Fill" value={s.menuColors.bg} onChange={setMenu('bg')} />
          <SliderRow label="Fill opacity" value={s.menuColors.bgAlpha} min={0} max={1} step={0.05} format={pct} onChange={setMenu('bgAlpha')} />
          <ColorRow label="Border" value={s.menuColors.border} onChange={setMenu('border')} />
          <SliderRow label="Border opacity" value={s.menuColors.borderAlpha} min={0} max={1} step={0.05} format={pct} onChange={setMenu('borderAlpha')} />
          <ColorRow label="Edge glow" value={s.menuColors.edge} onChange={setMenu('edge')} />
          <SliderRow label="Glow opacity" value={s.menuColors.edgeAlpha} min={0} max={1} step={0.05} format={pct} onChange={setMenu('edgeAlpha')} />
        </ToggleRow>
      </Group>
      <Group title="Without the full theme">
        <ToggleRow
          label="Simple dark mode"
          description={
            s.themeEnabled
              ? 'The full theme already covers this. It applies again if you turn the theme off.'
              : 'Darkens only the lobby, chat, search and deck panels.'
          }
          checked={s.darkMode}
          onChange={set('darkMode')}
        />
      </Group>
    </>
  );
};

const ThemeTab = () => {
  const s = useSettings();
  const [, setImported] = useLocal('customCssImported', '');
  const [view, setView] = useState(lastView);
  const [undo, setUndo] = useState(null);
  const show = (id) => {
    lastView = id;
    setView(id);
  };
  // Keeps what was there before a preset click or a pasted code replaced
  // hand-made colours. Undo is offered only while nothing else has changed
  // since, so it can never wipe later edits.
  const remember = (patch, message, importedCss = false) =>
    setUndo({ before: snapshot(s), after: JSON.stringify({ ...snapshot(s), ...patch }), message, importedCss });
  const undoable = undo && JSON.stringify(snapshot(s)) === undo.after;
  const onPick = (p) => {
    const patch = { themeEnabled: true, themePreset: p.id, themeTokens: { ...p.tokens }, themeRadius: p.radius };
    if (isEdited(s)) remember(patch, `Switched to ${p.name}; your custom colours were replaced.`);
    else setUndo(null);
    updateSettings(patch);
  };
  const onApplyCode = (patch, importedCss) => remember(patch, 'Theme code applied.', importedCss);
  const onUndo = () => {
    updateSettings(undo.before);
    if (undo.importedCss) setImported('');
    setUndo(null);
  };
  return (
    <>
      <div className="theme-head">
        <div className="subnav" role="group" aria-label="Theme sections">
          {VIEWS.map((v) => (
            <button key={v.id} type="button" aria-pressed={view === v.id} onClick={() => show(v.id)}>
              {v.label}
            </button>
          ))}
        </div>
        {undoable && (
          <p className="note theme-status undo-bar" role="status">
            <span>{undo.message}</span>
            <button type="button" className="link-btn" onClick={onUndo}>
              Undo
            </button>
          </p>
        )}
      </div>
      {view === 'style' && <StyleView s={s} onPick={onPick} />}
      {view === 'background' && <BackgroundView s={s} />}
      {view === 'cards' && <CardTextView s={s} />}
      {view === 'more' && <MoreView s={s} onBeforeApply={onApplyCode} />}
    </>
  );
};

export default ThemeTab;
