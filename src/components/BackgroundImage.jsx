import React, { useState, useEffect } from 'react';

const BackgroundImage = () => {
  const [enabled, setEnabled] = useState(false);
  const [imageData, setImageData] = useState('');
  const [originalSrc, setOriginalSrc] = useState('');

  useEffect(() => {
    // Store original src on mount
    const circuitBoard = document.getElementById('circuit_board');
    if (circuitBoard) {
      setOriginalSrc(circuitBoard.src);
    }

    // Load settings
    chrome.storage.local.get(['backgroundImageEnabled', 'backgroundImageData'], (result) => {
      const isEnabled = result.backgroundImageEnabled || false;
      const data = result.backgroundImageData || '';
      setEnabled(isEnabled);
      setImageData(data);
      applyBackground(isEnabled, data);
    });
  }, []);

  const applyBackground = (isEnabled, data) => {
    const greenlines = document.getElementById('greenlines');
    const contentDiv = document.getElementById('content');
    let bgImg = document.getElementById('custom-bg-img');
    const circuitBoard = document.getElementById('circuit_board');
    const circuitCover = document.getElementById('circuit_cover');

    if (isEnabled && data) {
      if (greenlines) greenlines.style.display = 'none';
      if (circuitBoard && circuitBoard.parentNode) circuitBoard.style.display = 'none';
      if (circuitCover && circuitCover.parentNode) circuitCover.style.display = 'none';
      if (contentDiv) {
        if (!bgImg) {
          bgImg = document.createElement('img');
          bgImg.id = 'custom-bg-img';
          bgImg.style.opacity = '0.5';
          bgImg.style.width = '100%';
          bgImg.style.height = '100%';
          bgImg.style.position = 'absolute';
          bgImg.style.top = '0';
          bgImg.style.left = '0';
          bgImg.style.zIndex = '0';
          bgImg.style.objectFit = 'cover';
          contentDiv.parentNode.insertBefore(bgImg, contentDiv);
        }
        bgImg.src = data;
        bgImg.style.display = '';
      }
    } else {
      if (greenlines) greenlines.style.display = '';
      if (bgImg) bgImg.style.display = 'none';
    }
  };

  const handleEnabledChange = (e) => {
    const newEnabled = e.target.checked;
    setEnabled(newEnabled);
    chrome.storage.local.set({ backgroundImageEnabled: newEnabled });
    applyBackground(newEnabled, imageData);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const data = event.target.result;
        setImageData(data);
        chrome.storage.local.set({ backgroundImageData: data });
        if (enabled) applyBackground(enabled, data);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="setting-item background-image-setting">
      <label className="setting-toggle">
        <input
          type="checkbox"
          checked={enabled}
          onChange={handleEnabledChange}
        />
        Custom Background Image
      </label>
      {enabled && (
        <>
          <div className="file-upload" style={{ width: '100%' }}
            onDragOver={e => { e.preventDefault(); e.stopPropagation(); }}
            onDrop={e => {
              e.preventDefault();
              e.stopPropagation();
              const file = e.dataTransfer.files[0];
              if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                  const data = event.target.result;
                  setImageData(data);
                  chrome.storage.local.set({ backgroundImageData: data });
                  if (enabled) applyBackground(enabled, data);
                };
                reader.readAsDataURL(file);
              }
            }}
          >
            <input type="file" accept="image/*" onChange={handleFileChange} style={{ width: '100%' }} />
          </div>
          {imageData && (
            <div className="image-preview" style={{ width: '100%', marginTop: '10px', textAlign: 'center' }}>
              <img src={imageData} alt="Background preview" style={{ maxWidth: '100%', maxHeight: '120px', borderRadius: '6px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }} />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BackgroundImage;