import React, { useState, useEffect } from 'react';

const applyDarkMode = (enabled) => {
  const cell1s = document.querySelectorAll('.cell1');
  cell1s.forEach(el => {
    if (enabled) {
      el.style.backgroundImage = 'none';
      el.style.backgroundColor = '#23272a'; // dark gray
      el.style.color = '#f1f1f1'; // light gray/white
    } else {
      el.style.backgroundImage = '';
      el.style.backgroundColor = '';
      el.style.color = '';
    }
  });
  const admins = document.querySelectorAll('.isAdmin');
  admins.forEach(el => {
    if (enabled) {
      el.style.color = '#4be04b'; // soft green
    } else {
      el.style.color = '';
    }
  });
  const chatBgs = document.querySelectorAll('.chat_background');
  chatBgs.forEach(el => {
    if (enabled) {
      el.style.backgroundColor = '#23272a'; // slightly darker gray
    } else {
      el.style.backgroundColor = '';
    }
  });
  const searchTxts = document.querySelectorAll('.search_txt');
  searchTxts.forEach(el => {
    if (enabled) {
      el.style.backgroundColor = '#23272a';
      el.style.color = '#f1f1f1';
      el.style.borderColor = '#444';
    } else {
      el.style.backgroundColor = '';
      el.style.color = '';
      el.style.borderColor = '';
    }
  });
  const totalTexts = document.querySelectorAll('.total_txt');
    totalTexts.forEach(el => {
        if (enabled) {
            el.style.color = '#f1f1f1';
        } else {
            el.style.color = '';
        }
    });
};

const DarkMode = () => {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    chrome.storage.sync.get(['darkModeEnabled'], (result) => {
      const isEnabled = result.darkModeEnabled || false;
      setEnabled(isEnabled);
      applyDarkMode(isEnabled);
    });
  }, []);

  const handleChange = (e) => {
    const newValue = e.target.checked;
    setEnabled(newValue);
    chrome.storage.sync.set({ darkModeEnabled: newValue });
    applyDarkMode(newValue);
  };

  return (
    <div className="setting-item">
      <label className="setting-toggle">
        <input
          type="checkbox"
          checked={enabled}
          onChange={handleChange}
        />
        Dark Mode (cell1 + admin)
      </label>
    </div>
  );
};

export default DarkMode;
