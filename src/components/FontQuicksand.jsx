import React, { useState, useEffect } from 'react';

const FONT_LINK_ID = 'quicksand-font-link';

const applyQuicksandFont = (enabled) => {
  if (enabled) {
    if (!document.getElementById(FONT_LINK_ID)) {
      const link = document.createElement('link');
      link.id = FONT_LINK_ID;
      link.rel = 'stylesheet';
      link.href = 'https://fonts.googleapis.com/css?family=Quicksand:400,500,700&display=swap';
      document.head.appendChild(link);
    }
    document.documentElement.style.setProperty('font-family', "'Quicksand', Arial, sans-serif", 'important');
  } else {
    document.documentElement.style.removeProperty('font-family');
    const link = document.getElementById(FONT_LINK_ID);
    if (link) link.remove();
  }
};

const FontQuicksand = () => {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    chrome.storage.sync.get(['fontQuicksandEnabled'], (result) => {
      const isEnabled = result.fontQuicksandEnabled || false;
      setEnabled(isEnabled);
      applyQuicksandFont(isEnabled);
    });
  }, []);

  const handleChange = (e) => {
    const newValue = e.target.checked;
    setEnabled(newValue);
    chrome.storage.sync.set({ fontQuicksandEnabled: newValue });
    applyQuicksandFont(newValue);
  };

  return (
    <div className="setting-item">
      <label className="setting-toggle">
        <input
          type="checkbox"
          checked={enabled}
          onChange={handleChange}
        />
        Use Quicksand font for website
      </label>
    </div>
  );
};

export default FontQuicksand;
