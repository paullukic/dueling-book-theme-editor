import React from 'react';
import './ThemeEditor.css';
import SkipIntro from './SkipIntro';
import SmallerMainMenu from './SmallerMainMenu';
import MainMenuButtonColors from './MainMenuButtonColors';
import BackgroundImage from './BackgroundImage';
import FontQuicksand from './FontQuicksand';
import DarkMode from './DarkMode';
import TextHighlight from './TextHighlight';

const ThemeEditor = () => {

  return (
    <div className="theme-editor">
      <h3>DuelingBook Theme Editor</h3>

      <div className="settings-section">
        <h4>Settings</h4>
        <SkipIntro />
        <FontQuicksand />
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