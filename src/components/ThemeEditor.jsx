import React, { useEffect, useRef } from "react";
import "./ThemeEditor.css";
import SkipIntro from "./SkipIntro";
import SmallerMainMenu from "./SmallerMainMenu";
import MainMenuButtonColors from "./MainMenuButtonColors";
import BackgroundImage from "./BackgroundImage";
import FontQuicksand from "./FontQuicksand";
import DarkMode from "./DarkMode";
import TextHighlight from "./TextHighlight";

const ThemeEditor = () => {
  return (
    <div className="theme-editor">
      <h3>DuelingBook Theme Editor</h3>
      <div style={{ marginBottom: "10px",  textAlign: "center" }}>
        <a
          href="https://www.buymeacoffee.com/sudbina"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-block",
            background: "#333333",
            color: "#ffffff",
            borderRadius: "8px",
            padding: "8px 24px",
            fontFamily: "Inter, sans-serif",
            fontSize: "16px",
            fontWeight: "bold",
            textDecoration: "none",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            transition: "background 0.2s",
          }}
          onMouseOver={(e) => (e.currentTarget.style.background = "#444444")}
          onMouseOut={(e) => (e.currentTarget.style.background = "#333333")}
        >
          👾 Donate to keep this free
        </a>
      </div>

      <div className="settings-section">
        <h4>Settings</h4>
        <SkipIntro />
        {/* <FontQuicksand /> */}
        <DarkMode />
        <TextHighlight />
        <br />
        <h4>Main Menu</h4>
        <SmallerMainMenu />
        <MainMenuButtonColors />
        <br />
        <h4>Background</h4>
        <BackgroundImage />
      </div>
    </div>
  );
};

export default ThemeEditor;
