import React, { useState, useEffect } from 'react';

const MainMenuButtonColors = () => {
  const [applyColors, setApplyColors] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [backgroundAlpha, setBackgroundAlpha] = useState(1);
  const [borderColor, setBorderColor] = useState('#000000');
  const [borderAlpha, setBorderAlpha] = useState(1);
  const [edgeColor, setEdgeColor] = useState('#2acbda');
  const [edgeAlpha, setEdgeAlpha] = useState(0.65);

  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 255, g: 255, b: 255 };
  };

  const applyColorsFunc = (apply, bg, bgAlpha, border, borderAlpha, edge, edgeAlpha) => {
    const elements = document.querySelectorAll('.menu_btn .content');
    elements.forEach(el => {
      if (apply) {
        const bgRgb = hexToRgb(bg);
        const borderRgb = hexToRgb(border);
        const edgeRgb = hexToRgb(edge);
        // Ensure minimum alpha to keep elements functional and slightly visible
        const minAlpha = 0.01;
        const effectiveBgAlpha = Math.max(bgAlpha, minAlpha);
        const effectiveBorderAlpha = Math.max(borderAlpha, minAlpha);
        const effectiveEdgeAlpha = Math.max(edgeAlpha, minAlpha);
        el.style.backgroundColor = `rgba(${bgRgb.r},${bgRgb.g},${bgRgb.b},${effectiveBgAlpha})`;
        el.style.borderColor = `rgba(${borderRgb.r},${borderRgb.g},${borderRgb.b},${effectiveBorderAlpha})`;
        el.style.backgroundImage = `linear-gradient(to right, rgba(${edgeRgb.r},${edgeRgb.g},${edgeRgb.b},${effectiveEdgeAlpha}), rgba(0,0,0,0.3) 20%, rgba(0,0,0,0.3) 80%, rgba(${edgeRgb.r},${edgeRgb.g},${edgeRgb.b},${effectiveEdgeAlpha}))`;
      } else {
        el.style.backgroundColor = '';
        el.style.borderColor = '';
        el.style.backgroundImage = '';
      }
    });
  };

  useEffect(() => {
    // Load settings from storage
    chrome.storage.sync.get(['mainMenuApplyColors', 'mainMenuBgColor', 'mainMenuBgAlpha', 'mainMenuBorderColor', 'mainMenuBorderAlpha', 'mainMenuEdgeColor', 'mainMenuEdgeAlpha'], (result) => {
      const apply = result.mainMenuApplyColors || false;
      const bg = result.mainMenuBgColor || '#ffffff';
      const bgAlpha = Math.max(result.mainMenuBgAlpha || 1, 0.01);
      const border = result.mainMenuBorderColor || '#000000';
      const borderAlpha = Math.max(result.mainMenuBorderAlpha || 1, 0.01);
      const edge = result.mainMenuEdgeColor || '#2acbda';
      const edgeAlphaVal = Math.max(result.mainMenuEdgeAlpha || 0.65, 0.01);
      setApplyColors(apply);
      setBackgroundColor(bg);
      setBackgroundAlpha(bgAlpha);
      setBorderColor(border);
      setBorderAlpha(borderAlpha);
      setEdgeColor(edge);
      setEdgeAlpha(edgeAlphaVal);
      applyColorsFunc(apply, bg, bgAlpha, border, borderAlpha, edge, edgeAlphaVal);
    });
  }, []);

  const handleApplyChange = (e) => {
    const newApply = e.target.checked;
    setApplyColors(newApply);
    chrome.storage.sync.set({ mainMenuApplyColors: newApply });
    applyColorsFunc(newApply, backgroundColor, backgroundAlpha, borderColor, borderAlpha, edgeColor, edgeAlpha);
  };

  const handleBgChange = (e) => {
    const newBg = e.target.value;
    setBackgroundColor(newBg);
    chrome.storage.sync.set({ mainMenuBgColor: newBg });
    applyColorsFunc(applyColors, newBg, backgroundAlpha, borderColor, borderAlpha, edgeColor, edgeAlpha);
  };

  const handleBgAlphaChange = (e) => {
    const newAlpha = Math.max(parseFloat(e.target.value), 0.01);
    setBackgroundAlpha(newAlpha);
    chrome.storage.sync.set({ mainMenuBgAlpha: newAlpha });
    applyColorsFunc(applyColors, backgroundColor, newAlpha, borderColor, borderAlpha, edgeColor, edgeAlpha);
  };

  const handleBorderChange = (e) => {
    const newBorder = e.target.value;
    setBorderColor(newBorder);
    chrome.storage.sync.set({ mainMenuBorderColor: newBorder });
    applyColorsFunc(applyColors, backgroundColor, backgroundAlpha, newBorder, borderAlpha, edgeColor, edgeAlpha);
  };

  const handleBorderAlphaChange = (e) => {
    const newAlpha = Math.max(parseFloat(e.target.value), 0.01);
    setBorderAlpha(newAlpha);
    chrome.storage.sync.set({ mainMenuBorderAlpha: newAlpha });
    applyColorsFunc(applyColors, backgroundColor, backgroundAlpha, borderColor, newAlpha, edgeColor, edgeAlpha);
  };

  const handleEdgeColorChange = (e) => {
    const newEdge = e.target.value;
    setEdgeColor(newEdge);
    chrome.storage.sync.set({ mainMenuEdgeColor: newEdge });
    applyColorsFunc(applyColors, backgroundColor, backgroundAlpha, borderColor, borderAlpha, newEdge, edgeAlpha);
  };

  const handleEdgeAlphaChange = (e) => {
    const newAlpha = Math.max(parseFloat(e.target.value), 0.01);
    setEdgeAlpha(newAlpha);
    chrome.storage.sync.set({ mainMenuEdgeAlpha: newAlpha });
    applyColorsFunc(applyColors, backgroundColor, backgroundAlpha, borderColor, borderAlpha, edgeColor, newAlpha);
  };

  return (
    <div className="setting-item color-setting">
      <label className="setting-toggle">
        <input
          type="checkbox"
          checked={applyColors}
          onChange={handleApplyChange}
        />
        Custom Button Colors
      </label>
      {applyColors && (
        <div className="color-controls">
          <div className="color-group">
            <label className="color-label">Background Color:</label>
            <input type="color" value={backgroundColor} onChange={handleBgChange} className="color-input" />
          </div>
          <div className="alpha-group">
            <label className="alpha-label">Background Alpha: {backgroundAlpha.toFixed(2)}</label>
            <input type="range" min="0" max="1" step="0.01" value={backgroundAlpha} onChange={handleBgAlphaChange} className="alpha-slider" />
          </div>
          <div className="color-group">
            <label className="color-label">Border Color:</label>
            <input type="color" value={borderColor} onChange={handleBorderChange} className="color-input" />
          </div>
          <div className="alpha-group">
            <label className="alpha-label">Border Alpha: {borderAlpha.toFixed(2)}</label>
            <input type="range" min="0" max="1" step="0.01" value={borderAlpha} onChange={handleBorderAlphaChange} className="alpha-slider" />
          </div>
          <div className="color-group">
            <label className="color-label">Edge Color:</label>
            <input type="color" value={edgeColor} onChange={handleEdgeColorChange} className="color-input" />
          </div>
          <div className="alpha-group">
            <label className="alpha-label">Edge Alpha: {edgeAlpha.toFixed(2)}</label>
            <input type="range" min="0" max="1" step="0.01" value={edgeAlpha} onChange={handleEdgeAlphaChange} className="alpha-slider" />
          </div>
        </div>
      )}
    </div>
  );
};

export default MainMenuButtonColors;