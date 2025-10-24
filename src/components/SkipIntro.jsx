import React, { useState, useEffect } from 'react';

const SkipIntro = () => {
  const [skipIntro, setSkipIntro] = useState(false);

  useEffect(() => {
    // Load settings from storage
    chrome.storage.sync.get(['skipIntro'], (result) => {
      const enabled = result.skipIntro || false;
      setSkipIntro(enabled);
      if (enabled) {
        // Try to find and click the skip intro button
        const skipButton = document.getElementById('skip_intro_btn') ||
                          document.querySelector('[data-testid="skip-intro-btn"]') ||
                          document.querySelector('.skip-intro-btn') ||
                          document.querySelector('button[title*="skip"]') ||
                          document.querySelector('button:contains("Skip")');

        if (skipButton) {
          skipButton.click();
          console.log('[DuelingBook Theme Editor] Auto-skipped intro');
          // Click duel_btn after a short delay
          setTimeout(() => {
            const duelBtn = document.getElementById('duel_btn');
            if (duelBtn) {
              duelBtn.click();
              console.log('[DuelingBook Theme Editor] Auto-clicked duel button');
            }
          }, 100);
        } else {
          // If button not found immediately, try again after a short delay
          setTimeout(() => {
            const retryButton = document.getElementById('skip_intro_btn') ||
                               document.querySelector('[data-testid="skip-intro-btn"]') ||
                               document.querySelector('.skip-intro-btn') ||
                               document.querySelector('button[title*="skip"]') ||
                               document.querySelector('button:contains("Skip")');

            if (retryButton) {
              retryButton.click();
              console.log('[DuelingBook Theme Editor] Auto-skipped intro (retry)');
              // Click duel_btn after a short delay
              setTimeout(() => {
                const duelBtn = document.getElementById('duel_btn');
                if (duelBtn) {
                  duelBtn.click();
                  console.log('[DuelingBook Theme Editor] Auto-clicked duel button (retry)');
                }
              }, 100);
            }
          }, 1000);
        }
      }
    });
  }, []);

  const handleSkipIntroChange = (e) => {
    const newValue = e.target.checked;
    setSkipIntro(newValue);
    chrome.storage.sync.set({ skipIntro: newValue });
  };

  return (
    <div className="setting-item">
      <label className="setting-toggle">
        <input
          type="checkbox"
          checked={skipIntro}
          onChange={handleSkipIntroChange}
        />
        Always Skip Intro
      </label>
    </div>
  );
};

export default SkipIntro;