import { useEffect } from 'react';
import { useSettings } from '../lib/settings';
import { useLocal } from '../lib/localStore';
import { removePageStyle, rgba, setPageStyle, whenElement } from '../lib/dom';
import { darkModeCSS } from './darkModeCss';
import { psctCss, unwrap, wrap } from './psct';

// Each effect applies its change while enabled and fully undoes it in cleanup,
// so turning a feature off restores DuelingBook's own look.

// Updates the <style> in place while css changes (no remove and re-insert per
// colour-picker tick); removes it when css is empty or on unmount.
export const useStyle = (id, css) => {
  useEffect(() => {
    if (css) setPageStyle(id, css);
    else removePageStyle(id);
  }, [id, css]);
  useEffect(() => () => removePageStyle(id), [id]);
};

// The full theme covers everything the simple dark mode did.
export const DarkModeEffect = () => {
  const { darkMode, themeEnabled } = useSettings();
  useStyle('dbte-dark', darkMode && !themeEnabled ? darkModeCSS : null);
  return null;
};

export const CardTextSizeEffect = () => {
  const { cardTextSize } = useSettings();
  useStyle(
    'dbte-cardtext',
    cardTextSize > 0
      ? `#preview_txt, #preview_txt * { font-size: ${cardTextSize}px !important; line-height: 1.35 !important; }`
      : null,
  );
  return null;
};

export const PsctEffect = () => {
  const { psctEnabled, psctColors } = useSettings();
  useStyle('dbte-psct', psctEnabled ? psctCss(psctColors) : null);

  useEffect(() => {
    if (!psctEnabled) return undefined;
    let preview = null;
    let observer = null;
    const rewrap = () => {
      observer.disconnect();
      unwrap(preview);
      wrap(preview);
      observer.observe(preview, { childList: true, subtree: true, characterData: true });
    };
    const cancel = whenElement('#preview_txt', (el) => {
      preview = el;
      observer = new MutationObserver(rewrap);
      rewrap();
    });
    return () => {
      cancel();
      if (observer) observer.disconnect();
      if (preview) unwrap(preview);
    };
  }, [psctEnabled]);
  return null;
};

const MENU_HOVER_CSS = `
.menu_btn .content { transition: filter 0.2s, box-shadow 0.2s; }
.menu_btn .content:hover { filter: brightness(1.18) saturate(1.4); }
.menu_btn .content:active { filter: brightness(0.95) saturate(1.3); }
`;

const SMALL_MENU_CSS = `
.dbte-small-menu { height: 30px !important; font-size: large !important; padding-bottom: 4px !important; }
.dbte-small-menu span { top: -12px !important; }
`;

export const SmallerMenuEffect = () => {
  const { smallerMenu } = useSettings();
  useStyle('dbte-small-menu', smallerMenu ? SMALL_MENU_CSS + MENU_HOVER_CSS : null);

  useEffect(() => {
    if (!smallerMenu) return undefined;
    const touched = [];
    const cancel = whenElement('#menu_content', (menu) => {
      const list = menu.children[1];
      if (!list) return;
      list.querySelectorAll('div').forEach((div) => {
        div.classList.add('dbte-small-menu');
        // Two-line labels would overflow the shorter buttons; swap each <br>
        // for a marked space so it can be put back.
        div.querySelectorAll('br').forEach((br) => {
          const space = document.createElement('span');
          space.className = 'dbte-br';
          space.textContent = ' ';
          br.replaceWith(space);
          touched.push(space);
        });
      });
    });
    return () => {
      cancel();
      document.querySelectorAll('.dbte-small-menu').forEach((d) => d.classList.remove('dbte-small-menu'));
      touched.forEach((space) => {
        if (space.isConnected) space.replaceWith(document.createElement('br'));
      });
    };
  }, [smallerMenu]);
  return null;
};

// The full theme styles the menu buttons too; it wins while its Main menu area is on.
export const MenuColorsEffect = () => {
  const { menuColorsEnabled, menuColors: c, themeEnabled, themeAreas } = useSettings();
  const edge = rgba(c.edge, c.edgeAlpha);
  useStyle(
    'dbte-menu-colors',
    menuColorsEnabled && !(themeEnabled && themeAreas.menu)
      ? `html body #main_menu .menu_btn .content {
  background-color: ${rgba(c.bg, c.bgAlpha)} !important;
  border-color: ${rgba(c.border, c.borderAlpha)} !important;
  background-image: linear-gradient(to right, ${edge}, rgba(0,0,0,0.3) 20%, rgba(0,0,0,0.3) 80%, ${edge}) !important;
}
${MENU_HOVER_CSS}`
      : null,
  );
  return null;
};

export const BackgroundEffect = () => {
  const { backgroundEnabled, backgroundOpacity } = useSettings();
  const [image] = useLocal('background', '');
  const active = backgroundEnabled && !!image;
  useStyle(
    'dbte-background',
    active ? '#greenlines, #circuit_board, #circuit_cover { display: none !important; }' : null,
  );

  useEffect(() => {
    if (!active) return undefined;
    const img = document.createElement('img');
    img.id = 'dbte-background-img';
    img.alt = '';
    img.style.cssText =
      'position:fixed;inset:0;width:100%;height:100%;object-fit:cover;z-index:0;pointer-events:none;';
    img.style.opacity = String(backgroundOpacity);
    img.src = image;
    const cancel = whenElement('#content', (content) => {
      content.parentNode.insertBefore(img, content);
    });
    return () => {
      cancel();
      img.remove();
    };
    // Opacity changes are applied by the effect below without re-inserting.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, image]);

  useEffect(() => {
    const img = document.getElementById('dbte-background-img');
    if (img) img.style.opacity = String(backgroundOpacity);
  });
  return null;
};
