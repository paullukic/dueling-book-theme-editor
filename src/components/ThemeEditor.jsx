import React from "react";
import "./ThemeEditor.css";
import SkipIntro from "./SkipIntro";
import SmallerMainMenu from "./SmallerMainMenu";
import MainMenuButtonColors from "./MainMenuButtonColors";
import BackgroundImage from "./BackgroundImage";
import FontQuicksand from "./FontQuicksand";
import DarkMode from "./DarkMode";
import TextHighlight from "./TextHighlight";
import ShortcutKeys from "./ShortcutKeys";
import Notes from "./Notes";
import ActionTracker from "./ActionTracker";
import YoutubeShoutout from "./YoutubeShoutout";

// Extension files are only reachable through runtime.getURL from a content
// script, and only if they are listed in web_accessible_resources.
const getLogoUrl = () => {
  try {
    if (typeof chrome !== "undefined" && chrome.runtime && chrome.runtime.getURL) {
      return chrome.runtime.getURL("icon48.png");
    }
  } catch (e) {
    // ignore - falls through to no logo
  }
  return "";
};

const ThemeEditor = () => {
  const logoUrl = getLogoUrl();

  return (
    <div className="theme-editor">
      <div className="theme-editor-header">
        <h3>DuelingBook Theme Editor</h3>
        {logoUrl && (
          <img className="theme-editor-logo" src={logoUrl} alt="" />
        )}
      </div>

      <a
        className="dbte-donate"
        href="https://www.buymeacoffee.com/sudbina"
        target="_blank"
        rel="noopener noreferrer"
      >
        <span>👾</span>
        <span>Donate to keep this free</span>
      </a>

      <div className="settings-section">
        <h4>Settings</h4>
        <SkipIntro />
        {/* <FontQuicksand /> */}
        <DarkMode />
        <TextHighlight />
        <ShortcutKeys />
        <Notes />
        <ActionTracker />
        <br />
        <h4>Main Menu</h4>
        <SmallerMainMenu />
        <MainMenuButtonColors />
        <br />
        <h4>Background</h4>
        <BackgroundImage />
        <br />
        <h4>Check Out</h4>
        <YoutubeShoutout />
      </div>
    </div>
  );
};

export default ThemeEditor;
