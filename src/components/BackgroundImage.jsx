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

  // Resize/compress large images to avoid storage quota errors when
  // storing data URLs in chrome.storage.local. Returns a DataURL.
  const processFileToDataUrl = (file, maxDim = 1600, jpegQuality = 0.8) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          try {
            let { width, height } = img;
            let targetWidth = width;
            let targetHeight = height;

            if (width > maxDim || height > maxDim) {
              if (width >= height) {
                targetWidth = maxDim;
                targetHeight = Math.round((maxDim / width) * height);
              } else {
                targetHeight = maxDim;
                targetWidth = Math.round((maxDim / height) * width);
              }
            }

            const canvas = document.createElement('canvas');
            canvas.width = targetWidth;
            canvas.height = targetHeight;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

            // Prefer jpeg for better compression unless original was PNG with transparency
            const isPng = file.type === 'image/png';
            const mime = isPng ? 'image/png' : 'image/jpeg';
            const quality = isPng ? 0.92 : jpegQuality;
            const dataUrl = canvas.toDataURL(mime, quality);
            resolve(dataUrl);
          } catch (err) {
            reject(err);
          }
        };
        img.onerror = reject;
        img.src = e.target.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

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
      // if (greenlines) greenlines.style.display = '';
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
      // Compress / resize before storing to avoid quota errors with large files
      processFileToDataUrl(file)
        .then((data) => {
          setImageData(data);
          // Try to store; check runtime.lastError in callback to detect quota issues
          chrome.storage.local.set({ backgroundImageData: data }, () => {
            if (chrome.runtime.lastError) {
              console.error('chrome.storage set error:', chrome.runtime.lastError);
              // If quota exceeded, store nothing and inform the user in console.
              // Optionally you can store a very small thumbnail instead or suggest enabling
              // "unlimitedStorage" or using IndexedDB for larger images.
            }
          });
          if (enabled) applyBackground(enabled, data);
        })
        .catch((err) => {
          console.error('Failed to process image:', err);
        });
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
                // Compress / resize dropped file before storing
                processFileToDataUrl(file)
                  .then((data) => {
                    setImageData(data);
                    chrome.storage.local.set({ backgroundImageData: data }, () => {
                      if (chrome.runtime.lastError) {
                        console.error('chrome.storage set error:', chrome.runtime.lastError);
                      }
                    });
                    if (enabled) applyBackground(enabled, data);
                  })
                  .catch((err) => console.error('Failed to process dropped image:', err));
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