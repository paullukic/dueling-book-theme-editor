import React, { useState, useEffect } from 'react';
import './SmallerMainMenu.css';

const SmallerMainMenu = () => {
  const [smallerMainMenu, setSmallerMainMenu] = useState(false);

  const applySmallerMenu = (enabled) => {
    const menuContent = document.getElementById('menu_content');
    if (menuContent) {
      const secondChild = menuContent.children[1]; // 2nd child (0-indexed)
      if (secondChild) {
        const divs = secondChild.querySelectorAll('div');
        divs.forEach(div => {
          if (enabled) {
            div.classList.add('smaller-main-menu');
            // Remove <br> tags and replace with space
            const brs = div.querySelectorAll('br');
            brs.forEach(br => {
              const space = document.createTextNode(' ');
              br.parentNode.replaceChild(space, br);
            });
          } else {
            div.classList.remove('smaller-main-menu');
          }
        });
      }
    }
  };

  useEffect(() => {
    // Load settings from storage
    chrome.storage.sync.get(['smallerMainMenu'], (result) => {
      const enabled = result.smallerMainMenu || false;
      setSmallerMainMenu(enabled);
      applySmallerMenu(enabled);
    });
  }, []);

  const handleSmallerMainMenuChange = (e) => {
    const newValue = e.target.checked;
    setSmallerMainMenu(newValue);
    chrome.storage.sync.set({ smallerMainMenu: newValue });
    applySmallerMenu(newValue);
  };

  return (
    <div className="setting-item">
      <label className="setting-toggle">
        <input
          type="checkbox"
          checked={smallerMainMenu}
          onChange={handleSmallerMainMenuChange}
        />
        Smaller main menu
      </label>
    </div>
  );
};

export default SmallerMainMenu;