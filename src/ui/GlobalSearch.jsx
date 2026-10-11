import { forwardRef } from 'react';
import { PRESETS, PRESET_GROUPS } from '../features/theme/presets';
import { PLACES, placeFields, placePath } from './places';
import { markParts, rank, searchThemes } from './search';
import { CHIP_LOOKS } from './chipLooks';
import { CloseIcon, SearchIcon } from './icons';

export const RESULTS_ID = 'dbte-search-results';
const MAX_SETTINGS = 30;
const MAX_THEMES = 6;
const SUGGESTIONS = ['Alerts', 'Background', 'Shortcuts', 'Mute', 'Text size'];

const optionId = (i) => `dbte-search-${i}`;

// Settings first (most searches look for a switch), then themes.
export const searchAll = (q) => {
  if (!q.trim()) return [];
  const places = rank(q, PLACES, placeFields, MAX_SETTINGS).map((p) => ({ kind: 'place', key: p.id, place: p }));
  const themes = searchThemes(q, PRESETS, PRESET_GROUPS, MAX_THEMES).map((p) => ({ kind: 'theme', key: p.id, theme: p }));
  return [...places, ...themes];
};

const Marked = ({ text, q }) =>
  markParts(text, q).map((part, i) => (part.hit ? <mark key={i}>{part.text}</mark> : <span key={i}>{part.text}</span>));

// Keeps the active row visible inside the panel body without scrolling the page.
const keepVisible = (el) => {
  const box = el && el.closest('.panel-body');
  if (!box || el.matches(':hover')) return;
  const r = el.getBoundingClientRect();
  const b = box.getBoundingClientRect();
  if (r.top < b.top) box.scrollTop -= b.top - r.top + 8;
  else if (r.bottom > b.bottom) box.scrollTop += r.bottom - b.bottom + 8;
};

export const SearchField = forwardRef(({ query, onQuery, results, active, onActive, onOpen }, ref) => {
  const open = query.trim().length > 0;
  const onKeyDown = (e) => {
    if (e.key === 'Escape' && query) {
      e.preventDefault();
      onQuery('');
      return;
    }
    if (!open || !results.length) return;
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      const step = e.key === 'ArrowDown' ? 1 : -1;
      onActive((active + step + results.length) % results.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      onOpen(results[active]);
    }
  };
  return (
    <div className="panel-search" role="search">
      <SearchIcon />
      <input
        ref={ref}
        type="text"
        className="panel-search-input"
        role="combobox"
        aria-label="Search settings and themes"
        aria-autocomplete="list"
        aria-expanded={open}
        aria-controls={open ? RESULTS_ID : undefined}
        aria-activedescendant={open && results.length ? optionId(active) : undefined}
        placeholder="Search settings and themes…"
        autoComplete="off"
        autoCapitalize="off"
        spellCheck={false}
        maxLength={60}
        data-clear-on-escape=""
        value={query}
        onChange={(e) => onQuery(e.target.value)}
        onKeyDown={onKeyDown}
      />
      {query ? (
        <button type="button" className="panel-search-clear" aria-label="Clear search" onClick={() => onQuery('', true)}>
          <CloseIcon />
        </button>
      ) : (
        <kbd className="kbd panel-search-key" aria-hidden="true">
          /
        </kbd>
      )}
    </div>
  );
});

export const SearchResults = ({ query, results, active, onActive, onOpen, onQuery }) => {
  const settings = results.filter((r) => r.kind === 'place');
  const themes = results.filter((r) => r.kind === 'theme');
  const row = (r) => {
    const i = results.indexOf(r);
    return (
      <li
        key={`${r.kind}-${r.key}`}
        id={optionId(i)}
        role="option"
        aria-selected={i === active}
        className={`search-result${r.kind === 'theme' ? ' is-theme' : ''}`}
        ref={i === active ? keepVisible : undefined}
        onMouseMove={() => i !== active && onActive(i)}
        onClick={() => onOpen(r)}
      >
        {r.kind === 'theme' ? (
          <>
            <span className="search-swatch" style={CHIP_LOOKS[r.theme.id].style} aria-hidden="true" />
            <span className="search-result-text">
              <span className="search-result-label">
                <Marked text={r.theme.name} q={query} />
              </span>
              <span className="search-result-path">
                Theme › {PRESET_GROUPS.find((g) => g.id === r.theme.group).label}
              </span>
              <span className="search-result-desc">
                <Marked text={r.theme.blurb} q={query} />
              </span>
            </span>
          </>
        ) : (
          <span className="search-result-text">
            <span className="search-result-label">
              <Marked text={r.place.label} q={query} />
            </span>
            <span className="search-result-path">{placePath(r.place)}</span>
            {r.place.desc && (
              <span className="search-result-desc">
                <Marked text={r.place.desc} q={query} />
              </span>
            )}
          </span>
        )}
      </li>
    );
  };
  return (
    <div className="search-results">
      <p className="search-count" role="status">
        {results.length
          ? `${results.length} ${results.length === 1 ? 'result' : 'results'} for “${query.trim()}”`
          : `Nothing matches “${query.trim()}”.`}
      </p>
      <ul id={RESULTS_ID} role="listbox" aria-label="Search results">
        {settings.length > 0 && (
          <li role="presentation" className="search-section">
            Settings
          </li>
        )}
        {settings.map(row)}
        {themes.length > 0 && (
          <li role="presentation" className="search-section">
            Themes
          </li>
        )}
        {themes.map(row)}
      </ul>
      {!results.length && (
        <div className="search-empty">
          <p className="note">Try a broader word, or one of these:</p>
          <div className="search-suggestions">
            {SUGGESTIONS.map((s) => (
              <button key={s} type="button" className="pill" onClick={() => onQuery(s, true)}>
                {s}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
