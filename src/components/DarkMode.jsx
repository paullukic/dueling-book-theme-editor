import React, { useState, useEffect } from "react";

const darkBackground = '#23272a';
const darkBackgroundHover = '#2c2f33';
const lightText = '#d5d5d5ff';
const darkBorder = '#444';
const scrollbarThumb = '#444';
const scrollbarThumbHover = '#555';
const adminColor = '#4be04b';
const followingColor = '#00aced';
const softRed = '#ff7f7f';
const softBlue = '#7f7fff';

const darkModeCSS = `
.cell1 {
  background-image: none !important;\
  border: none !important;
  background-color: ${darkBackground} !important;
  color: ${lightText} !important;
}
.cell1:hover {
  background-image: none !important;
  border: none !important;
  background-color: ${darkBackgroundHover} !important;
  color: ${lightText} !important;
}
.isAdmin {
  color: ${adminColor} !important;
}
.following {
  color: ${followingColor} !important;
}
font[color="#FF0000"] {
  color: ${softRed} !important;
}
font[color="#0000FF"] {
  color: ${softBlue} !important;
}
.chat_top span {
  color: ${darkBackground} !important;
}
.chat_background {
  background-color: ${darkBackground} !important;
}
.search_bg {
  background: rgba(35, 39, 42, 0.75) !important;
  color: ${lightText} !important;
}
div.title_txt .aliased, .name_lbl, .desc_lbl, .card_lbl, #search1 .type_lbl, .attrib_lbl, .lvl_compare_lbl, .lvl_rank_lbl, .atk_lbl, .def_lbl, .limit_lbl, .order_lbl, .pendulum_lbl, .scale2_lbl, .scale1_lbl, .tcg_lbl, .ocg_lbl, .custom_lbl, .watchers_txt {
  color: ${lightText} !important;
}
.search_bg span {
  color: ${lightText} !important;
}
#watchers .users {
  background-color: ${darkBackground} !important;
  color: ${lightText} !important;
}
.textinput.proxy {
  background-color: ${darkBackgroundHover} !important;
  color: ${lightText} !important;
  border: 1px solid ${darkBorder} !important;
  border-radius: 4px !important;
}
.textinput, input.username_txt, input.name_txt, input.desc_txt, .lvll_txt, .lvlh_txt, .atkl_txt, .atkh_txt, .defl_txt, .defh_txt, .spdl_txt, .spdh_txt, #watchers, #watchers.users, #preview_txt, .cout_txt.textarea, .search_txt, .users.list {
  background-color: ${darkBackground} !important;
  color: ${lightText} !important;
  border: none !important;
  border-radius: 4px !important;
}
.card_border {
  border-radius: 8px !important;
}
select option {
  background-color: ${darkBackground} !important;
  color: ${lightText} !important;
}
.total_txt {
  color: ${lightText} !important;
}
::-webkit-scrollbar {
  width: 8px !important;
}
::-webkit-scrollbar-track {
  background: ${darkBackground} !important;
}
::-webkit-scrollbar-thumb {
  background: ${scrollbarThumb} !important;
  border-radius: 4px !important;
}
::-webkit-scrollbar-thumb:hover {
  background: ${scrollbarThumbHover} !important;
}
`;

const applyDarkMode = (enabled) => {
  let styleElement = document.getElementById("dark-mode-styles");
  if (enabled) {
    if (!styleElement) {
      styleElement = document.createElement("style");
      styleElement.id = "dark-mode-styles";
      styleElement.textContent = darkModeCSS;
      document.head.appendChild(styleElement);
    }
  } else {
    if (styleElement) {
      styleElement.remove();
    }
  }
};

const DarkMode = () => {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    chrome.storage.sync.get(["darkModeEnabled"], (result) => {
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
        <input type="checkbox" checked={enabled} onChange={handleChange} />
        Dark Mode (cell1 + admin)
      </label>
    </div>
  );
};

export default DarkMode;
