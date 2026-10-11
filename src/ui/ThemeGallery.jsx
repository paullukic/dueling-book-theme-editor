import { useRef } from 'react';
import { updateSettings } from '../lib/settings';
import { toggleId } from '../lib/favourites';
import { PRESETS, PRESET_GROUPS, presetById } from '../features/theme/presets';
import { searchThemes } from './search';
import { setNav, useNav } from './nav';
import { CHIP_LOOKS } from './chipLooks';
import { CloseIcon, SearchIcon, StarIcon } from './icons';

const GROUPS = PRESET_GROUPS.filter((g) => PRESETS.some((p) => p.group === g.id));
const known = (ids) => ids.map(presetById).filter(Boolean);

const toggleFavourite = (s, id) => updateSettings({ themeFavourites: toggleId(s.themeFavourites, id) });

// The theme in use, big, with what can be done to it.
export const ThemeHero = ({ s, base, edited, onPick }) => {
  const on = s.themeEnabled;
  const fav = s.themeFavourites.includes(base.id);
  const group = PRESET_GROUPS.find((g) => g.id === base.group);
  let status = 'Theme is off: DuelingBook looks as usual.';
  let shown = 'Theme is off';
  if (on) {
    status = edited ? `Custom colours, based on ${base.name}.` : `Using ${base.name}.`;
    shown = edited ? 'Custom colours' : (group && group.label) || '';
  }
  return (
    <section className={`theme-hero${on ? '' : ' is-off'}`} data-place="theme" aria-label="Current theme">
      <div className="theme-hero-art" style={on ? CHIP_LOOKS[base.id].style : undefined}>
        {on && <img className="theme-hero-icon" src={CHIP_LOOKS[base.id].icon} alt="" />}
        <div className="theme-hero-text">
          <h2>{on ? base.name : 'DuelingBook’s own look'}</h2>
          <p>{on ? base.blurb : 'No theme. Pick one below to restyle every screen.'}</p>
        </div>
      </div>
      <div className="theme-hero-bar">
        <span className="theme-hero-status" aria-hidden="true">
          {shown}
        </span>
        <span className="sr-only" aria-live="polite">
          {status}
        </span>
        {on && edited && (
          <button type="button" className="link-btn" onClick={() => onPick(base)}>
            Reset
          </button>
        )}
        {on ? (
          <>
            <button type="button" className="btn btn-quiet btn-sm" onClick={() => updateSettings({ themeEnabled: false })}>
              Turn off
            </button>
            <button
              type="button"
              className="icon-btn star-btn"
              aria-pressed={fav}
              aria-label={fav ? `Remove ${base.name} from favourites` : `Add ${base.name} to favourites`}
              title={fav ? 'Remove from favourites' : 'Add to favourites'}
              onClick={() => toggleFavourite(s, base.id)}
            >
              <StarIcon filled={fav} />
            </button>
          </>
        ) : (
          <button type="button" className="btn btn-sm" onClick={() => updateSettings({ themeEnabled: true })}>
            {edited ? 'Turn on your colours' : `Turn on ${base.name}`}
          </button>
        )}
      </div>
    </section>
  );
};

const Chip = ({ p, s, pressed, onPick }) => {
  const fav = s.themeFavourites.includes(p.id);
  return (
    <div className="preset-cell">
      <button
        type="button"
        className="preset-chip"
        data-theme-id={p.id}
        aria-pressed={pressed}
        title={p.blurb}
        onClick={() => onPick(p)}
        style={CHIP_LOOKS[p.id].style}
      >
        <img className="preset-chip-icon" src={CHIP_LOOKS[p.id].icon} alt="" />
        <span className="preset-chip-name">{p.name}</span>
        {fav && <span className="sr-only">, favourite</span>}
      </button>
      {/* Mouse shortcut; keyboard users press F on the chip or use the star above. */}
      <button
        type="button"
        className={`preset-star${fav ? ' is-fav' : ''}`}
        tabIndex={-1}
        aria-hidden="true"
        title={fav ? 'Remove from favourites' : 'Add to favourites'}
        onClick={() => toggleFavourite(s, p.id)}
      >
        <StarIcon filled={fav} />
      </button>
    </div>
  );
};

const rowTop = (el) => el.getBoundingClientRect().top;

// Arrow keys walk the grid by position, so sections with short rows still work.
const nextChip = (chips, cur, key) => {
  const i = chips.indexOf(cur);
  if (key === 'ArrowRight') return chips[i + 1];
  if (key === 'ArrowLeft') return chips[i - 1];
  if (key === 'Home') return chips[0];
  if (key === 'End') return chips[chips.length - 1];
  const down = key === 'ArrowDown';
  const top = rowTop(cur);
  const rows = chips.filter((c) => (down ? rowTop(c) > top + 4 : rowTop(c) < top - 4));
  if (!rows.length) return null;
  const target = down ? Math.min(...rows.map(rowTop)) : Math.max(...rows.map(rowTop));
  const left = cur.getBoundingClientRect().left;
  return rows
    .filter((c) => Math.abs(rowTop(c) - target) < 4)
    .reduce((best, c) => (Math.abs(c.getBoundingClientRect().left - left) < Math.abs(best.getBoundingClientRect().left - left) ? c : best));
};

const scrollInto = (box, el) => {
  const r = el.getBoundingClientRect();
  const b = box.getBoundingClientRect();
  if (r.top < b.top + 24) box.scrollTop -= b.top + 24 - r.top;
  else if (r.bottom > b.bottom) box.scrollTop += r.bottom - b.bottom + 4;
};

export const ThemeGallery = ({ s, isPressed, onPick }) => {
  const { galleryFilter, galleryQuery: query } = useNav();
  const inputRef = useRef(null);
  const scrollRef = useRef(null);
  const favourites = known(s.themeFavourites);
  const recent = known(s.themeRecent);
  const filter = galleryFilter === 'all' || galleryFilter === 'favourites' || galleryFilter === 'recent' || GROUPS.some((g) => g.id === galleryFilter) ? galleryFilter : 'all';

  const pills = [
    { id: 'all', label: 'All', count: PRESETS.length },
    { id: 'favourites', label: 'Favourites', count: favourites.length, star: true },
    { id: 'recent', label: 'Recent', count: recent.length },
    ...GROUPS.map((g) => ({ id: g.id, label: g.label, count: PRESETS.filter((p) => p.group === g.id).length })),
  ];
  let pool = PRESETS;
  if (filter === 'favourites') pool = favourites;
  else if (filter === 'recent') pool = recent;
  else if (filter !== 'all') pool = PRESETS.filter((p) => p.group === filter);

  const searching = query.trim().length > 0;
  const results = searching ? searchThemes(query, pool, PRESET_GROUPS) : pool;
  let sections;
  if (searching || filter !== 'all') sections = [{ id: 'list', items: results }];
  else {
    sections = [
      favourites.length && { id: 'fav', title: 'Favourites', items: favourites },
      recent.length && { id: 'recent', title: 'Recently used', items: recent },
      ...GROUPS.map((g) => ({ id: g.id, title: g.label, items: PRESETS.filter((p) => p.group === g.id) })),
    ].filter(Boolean);
  }

  const setQuery = (q) => setNav({ galleryQuery: q });
  const chips = () => [...scrollRef.current.querySelectorAll('.preset-chip')];
  const focusChip = (el) => {
    if (!el) return;
    el.focus({ preventScroll: true });
    scrollInto(scrollRef.current, el);
  };

  const onFieldKey = (e) => {
    if (e.key === 'Escape' && query) {
      e.preventDefault();
      setQuery('');
    } else if (e.key === 'Enter' && searching && results.length) {
      e.preventDefault();
      onPick(results[0]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      focusChip(chips()[0]);
    }
  };

  const onGridKey = (e) => {
    const cur = e.target.closest && e.target.closest('.preset-chip');
    if (!cur) return;
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.key === 'f' || e.key === 'F') {
      e.preventDefault();
      toggleFavourite(s, cur.dataset.themeId);
      return;
    }
    if (!['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(e.key)) return;
    e.preventDefault();
    const next = nextChip(chips(), cur, e.key);
    if (next) focusChip(next);
    else if (e.key === 'ArrowUp' && inputRef.current) inputRef.current.focus();
  };

  let empty = null;
  if (!results.length) {
    if (searching) {
      empty = (
        <>
          <p>No theme matches “{query.trim()}”{filter !== 'all' ? ' here' : ''}.</p>
          <div className="btn-row">
            <button type="button" className="btn btn-sm" onClick={() => setQuery('')}>
              Clear search
            </button>
            {filter !== 'all' && (
              <button type="button" className="btn btn-quiet btn-sm" onClick={() => setNav({ galleryFilter: 'all' })}>
                Search all themes
              </button>
            )}
          </div>
        </>
      );
    } else if (filter === 'favourites') {
      empty = <p>No favourites yet. Star the theme you are using in the card above, hover a theme and click its star, or press F on a theme.</p>;
    } else {
      empty = <p>Themes you pick show up here.</p>;
    }
  }

  return (
    <section className="gallery" data-place="themeGallery" aria-label="Theme gallery">
      <div className="gallery-search">
        <SearchIcon />
        <input
          ref={inputRef}
          type="text"
          className="gallery-search-input"
          aria-label="Filter themes"
          aria-describedby="dbte-gallery-count dbte-gallery-keys"
          placeholder={`Filter ${PRESETS.length} themes…`}
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
          maxLength={40}
          data-clear-on-escape=""
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={onFieldKey}
        />
        {query && (
          <button
            type="button"
            className="panel-search-clear"
            aria-label="Clear theme filter"
            onClick={() => {
              setQuery('');
              if (inputRef.current) inputRef.current.focus();
            }}
          >
            <CloseIcon />
          </button>
        )}
      </div>
      <div className="pills" role="group" aria-label="Theme categories">
        {pills.map((p) => (
          <button key={p.id} type="button" className="pill" aria-pressed={filter === p.id} onClick={() => setNav({ galleryFilter: p.id })}>
            {p.star && <StarIcon filled={filter === p.id} />}
            {p.label}
            <span className="pill-count">{p.count}</span>
          </button>
        ))}
      </div>
      <p className="sr-only" id="dbte-gallery-keys">
        Down arrow moves into the themes. Arrow keys move between them, Enter applies one, F adds or removes a favourite.
      </p>
      <p className="sr-only" id="dbte-gallery-count" role="status">
        {searching ? `${results.length} ${results.length === 1 ? 'theme' : 'themes'}` : ''}
      </p>
      {/* Keyboard: Down from the filter enters the grid, arrows move, F stars. */}
      <div className="gallery-scroll" ref={scrollRef} onKeyDown={onGridKey}>
        {empty ? (
          <div className="gallery-empty">{empty}</div>
        ) : (
          sections.map((sec) => (
            <div key={sec.id} className="preset-group">
              {sec.title && (
                <h3 className="preset-group-title" id={`dbte-presets-${sec.id}`}>
                  {sec.title}
                </h3>
              )}
              <div className="preset-chips" role="group" aria-labelledby={sec.title ? `dbte-presets-${sec.id}` : undefined} aria-label={sec.title ? undefined : 'Matching themes'}>
                {sec.items.map((p) => (
                  <Chip key={p.id} p={p} s={s} pressed={isPressed(p)} onPick={onPick} />
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
};
