import { useState } from 'react';
import { updateSettings, useSettings } from '../lib/settings';
import { useLocal } from '../lib/localStore';
import { contrast } from '../lib/color';
import { CARD_TEXT_FONTS, CARD_TEXT_SIZES, DEFAULT_PSCT_COLORS } from '../lib/defaults';
import { pushRecent } from '../lib/favourites';
import { AREAS, FONTS, TOKEN_GROUPS, TOKENS, presetById } from '../features/theme/presets';
import { MAX_CODE_LENGTH, MAX_CUSTOM_CSS, THEME_KEYS, decodeTheme, encodeTheme } from '../features/theme/share';
import { ColorRow, Disclosure, Group, SliderRow, ToggleRow } from './controls';
import BackgroundPicker from './BackgroundPicker';
import { ThemeGallery, ThemeHero } from './ThemeGallery';
import { THEME_VIEWS, placeById } from './places';
import { setNav, useNav } from './nav';

// The Theme tab, split into four short views so nothing is buried:
// Style (current theme, gallery, theme options), Background, Card text, More.

const set = (key) => (value) => updateSettings({ [key]: value });

const sameTokens = (a, b) => TOKENS.every(({ key }) => (a[key] || '').toLowerCase() === (b[key] || '').toLowerCase());
const isEdited = (s) => {
  const base = presetById(s.themePreset);
  return !sameTokens(s.themeTokens, base.tokens) || s.themeRadius !== base.radius;
};
const snapshot = (s) => Object.fromEntries(['themeEnabled', ...THEME_KEYS].map((k) => [k, s[k]]));

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
            <ColorRow key={t.key} place={`token-${t.key}`} value={s.themeTokens[t.key]} onChange={setToken(t.key)} />
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
        place="customCssEnabled"
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
  const isPressed = (p) => s.themeEnabled && s.themePreset === p.id && !edited;
  return (
    <>
      <ThemeHero s={s} base={base} edited={edited} onPick={onPick} />
      <ThemeGallery s={s} isPressed={isPressed} onPick={onPick} />
      {s.themeEnabled && (
        <Group place="themeOptions">
          <ToggleRow place="themeEffects" checked={s.themeEffects} onChange={set('themeEffects')} />
          {s.themeEffects && <ToggleRow place="themeMotif" checked={s.themeMotif} onChange={set('themeMotif')} />}
          {s.themeEffects && s.themeMotif && <ToggleRow place="themeMotion" checked={s.themeMotion} onChange={set('themeMotion')} />}
          {s.themeEffects && s.themeMotif && s.themeMotion && (
            <div className="segmented-row" data-place="themeQuality">
              <span id="dbte-quality-label">Visual quality</span>
              <div className="segmented" role="group" aria-labelledby="dbte-quality-label">
                {[
                  ['off', 'Off'],
                  ['low', 'Low'],
                  ['high', 'High'],
                ].map(([id, label]) => (
                  <button key={id} type="button" aria-pressed={s.themeQuality === id} onClick={() => updateSettings({ themeQuality: id })}>
                    {label}
                  </button>
                ))}
              </div>
            </div>
          )}
          <SliderRow
            place="themeRadius"
            value={s.themeRadius}
            min={0}
            max={16}
            step={1}
            format={(v) => (v === 0 ? 'Square' : `${v}px`)}
            onChange={set('themeRadius')}
          />
          <div className="segmented-row" data-place="themeFont">
            <span id="dbte-font-label">Lettering</span>
            <div className="segmented" role="group" aria-labelledby="dbte-font-label">
              {FONTS.map((f) => (
                <button key={f.id} type="button" aria-pressed={s.themeFont === f.id} onClick={() => updateSettings({ themeFont: f.id })}>
                  {f.label}
                </button>
              ))}
            </div>
          </div>
          <Disclosure place="themeColours">
            <TokenEditor s={s} />
          </Disclosure>
        </Group>
      )}
    </>
  );
};

const BackgroundView = ({ s }) => (
  <>
    <Group place="ownBackground">
      <div className="segmented-row" data-place="backgroundMode">
        <span id="dbte-bg-mode-label">Use</span>
        <div className="segmented" role="group" aria-labelledby="dbte-bg-mode-label">
          {[
            ['image', 'Picture'],
            ['color', 'Solid colour'],
          ].map(([id, label]) => (
            <button key={id} type="button" aria-pressed={s.backgroundMode === id} onClick={() => updateSettings({ backgroundMode: id, backgroundEnabled: true })}>
              {label}
            </button>
          ))}
        </div>
      </div>
      {s.backgroundMode === 'color' ? (
        <ColorRow place="backgroundColor" value={s.backgroundColor} onChange={set('backgroundColor')} />
      ) : (
        <div data-place="backgroundImage">
          <p className="note">{placeById.backgroundImage.desc}</p>
          <BackgroundPicker />
        </div>
      )}
      <ToggleRow place="backgroundEnabled" checked={s.backgroundEnabled} onChange={set('backgroundEnabled')}>
        <SliderRow
          place="backgroundOpacity"
          label={s.backgroundMode === 'color' ? 'Colour strength' : 'Image strength'}
          value={s.backgroundOpacity}
          min={0.1}
          max={1}
          step={0.05}
          format={(v) => `${Math.round(v * 100)}%`}
          onChange={set('backgroundOpacity')}
        />
        {s.themeEnabled && s.themeEffects && s.themeMotif && (
          <ToggleRow
            place="backgroundThemeOverlay"
            checked={s.backgroundThemeOverlay}
            onChange={set('backgroundThemeOverlay')}
          />
        )}
      </ToggleRow>
    </Group>
  </>
);

const CardTextView = ({ s }) => {
  const setPsctColor = (k) => (v) => updateSettings({ psctColors: { ...s.psctColors, [k]: v } });
  return (
    <>
    <Group place="cardText">
      <ToggleRow
        place="psctEnabled"
        checked={s.psctEnabled}
        onChange={set('psctEnabled')}
      >
        <ColorRow place="psctCondition" value={s.psctColors.condition} onChange={setPsctColor('condition')} />
        <ColorRow place="psctCost" value={s.psctColors.cost} onChange={setPsctColor('cost')} />
        <ColorRow place="psctEffect" value={s.psctColors.effect} onChange={setPsctColor('effect')} />
        <ColorRow place="psctRestriction" value={s.psctColors.restriction} onChange={setPsctColor('restriction')} />
        <button type="button" className="btn btn-quiet" onClick={() => updateSettings({ psctColors: DEFAULT_PSCT_COLORS })}>
          Reset colours
        </button>
      </ToggleRow>
      <ToggleRow
        place="psctLineBreaks"
        checked={s.psctLineBreaks}
        onChange={set('psctLineBreaks')}
      />
      <SliderRow
        place="cardTextSize"
        value={s.cardTextSize}
        values={CARD_TEXT_SIZES}
        format={(v) => (v === 0 ? 'Default' : `${v}px`)}
        onChange={set('cardTextSize')}
      />
      <div className="segmented-row" data-place="cardTextFont">
        <span id="dbte-card-font-label">Card text font</span>
        <div className="segmented" role="group" aria-labelledby="dbte-card-font-label">
          {CARD_TEXT_FONTS.map((f) => (
            <button key={f.id} type="button" aria-pressed={s.cardTextFont === f.id} onClick={() => updateSettings({ cardTextFont: f.id })}>
              {f.label}
            </button>
          ))}
        </div>
      </div>
    </Group>
    <Group place="readingText">
      <SliderRow
        place="readingTextScale"
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
      <Group place="themeExtras">
        <Disclosure place="shareTheme">
          <ShareTheme s={s} onBeforeApply={onBeforeApply} />
        </Disclosure>
        {s.themeEnabled && (
          <Disclosure place="themeAreas">
            <p className="note">{placeById.themeAreas.desc}</p>
            {AREAS.map((a) => (
              <ToggleRow key={a.id} place={`area-${a.id}`} checked={!!s.themeAreas[a.id]} onChange={setAreas(a.id)} />
            ))}
          </Disclosure>
        )}
        <Disclosure place="customCss">
          <CustomCss s={s} />
        </Disclosure>
      </Group>
      <Group place="mainMenu">
        <ToggleRow
          place="smallerMenu"
          checked={s.smallerMenu}
          onChange={set('smallerMenu')}
        />
        {!(s.themeEnabled && s.themeAreas.menu) && (
        <ToggleRow
          place="menuColorsEnabled"
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
        )}
      </Group>
      {!s.themeEnabled && (
        <Group place="withoutTheme">
          <ToggleRow
            place="darkMode"
            checked={s.darkMode}
            onChange={set('darkMode')}
          />
        </Group>
      )}
    </>
  );
};

const ThemeTab = () => {
  const s = useSettings();
  const [, setImported] = useLocal('customCssImported', '');
  const { themeView: view } = useNav();
  const [undo, setUndo] = useState(null);
  const show = (id) => setNav({ themeView: id });
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
    updateSettings({ ...patch, themeRecent: pushRecent(s.themeRecent, p.id) });
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
          {THEME_VIEWS.map((v) => (
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
