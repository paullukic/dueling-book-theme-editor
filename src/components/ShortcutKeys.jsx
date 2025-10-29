import React, { useState, useEffect } from "react";
import "./ShortcutKeys.css";

const BUTTONS = [
  { id: "good_btn", label: "Signal Ok" },
  { id: "shuffle_btn", label: "Shuffle Hand" },
  { id: "think_btn", label: "Thinking" },
  { id: "draw_action", label: "Draw 1 Card" },
  { id: "mill_action", label: "Mill 1 Card" },
  { id: "discard_action", label: "Discard Random Card" },
  { id: "half_action", label: "Half your Life Points" },
  { id: "nibiru_action", label: "Nibiru Stats" },
  { id: "custom_chat_action", label: "Custom chat text" },
];

const ShortcutKeys = () => {
  const [shortcuts, setShortcuts] = useState({
    a: "good_btn",
    s: "shuffle_btn",
    t: "think_btn",
    d: "draw_action",
    m: "mill_action",
    r: "discard_action",
    h: "half_action",
    n: "nibiru_action",
    g: "custom_chat_action",
  });
  const [collapsed, setCollapsed] = useState(true);
  const [warningMessage, setWarningMessage] = useState('');
  const [customMessage, setCustomMessage] = useState('GLHF');

  const typeInChat = (message) => {
    const input = document.querySelector("#duel .cin_txt");
    if (input) {
      input.focus();
      input.value = message;
      const inputEvent = new Event("input", { bubbles: true });
      input.dispatchEvent(inputEvent);
      const keydownEvent = new KeyboardEvent("keydown", {
        key: "Enter",
        code: "Enter",
        keyCode: 13,
        which: 13,
        bubbles: true,
      });
      const keyupEvent = new KeyboardEvent("keyup", {
        key: "Enter",
        code: "Enter",
        keyCode: 13,
        which: 13,
        bubbles: true,
      });
      input.dispatchEvent(keydownEvent);
      input.dispatchEvent(keyupEvent);
      input.value = "";
      input.dispatchEvent(inputEvent);
      input.blur();
    }
  };

  useEffect(() => {
    chrome.storage.sync.get(["shortcutKeys", "customChatMessage"], (result) => {
      if (result.shortcutKeys) {
        setShortcuts(result.shortcutKeys);
      } else {
        const defaultKeys = {
          a: "good_btn",
          s: "shuffle_btn",
          t: "think_btn",
          d: "draw_action",
          m: "mill_action",
          r: "discard_action",
          h: "half_action",
          n: "nibiru_action",
          g: "custom_chat_action",
        };
        setShortcuts(defaultKeys);
        chrome.storage.sync.set({ shortcutKeys: defaultKeys });
      }
      if (result.customChatMessage !== undefined) {
        setCustomMessage(result.customChatMessage);
      } else {
        setCustomMessage('GLHF');
        chrome.storage.sync.set({ customChatMessage: 'GLHF' });
      }
    });

    const handleKeydown = (e) => {
      if (
        document.activeElement.tagName === "INPUT" ||
        document.activeElement.tagName === "TEXTAREA"
      )
        return;
      const key = e.key.toLowerCase();
      const btnId = shortcuts[key];
      if (btnId) {
        if (btnId === "draw_action") {
          typeInChat("/draw 1");
        } else if (btnId === "mill_action") {
          typeInChat("/mill 1");
        } else if (btnId === "discard_action") {
          typeInChat("/discardrandom");
        } else if (btnId === "half_action") {
          typeInChat("/half");
        } else if (btnId === "nibiru_action") {
          const field = document.getElementById('duel_content');
          if (field) {
            const allSpans = field.querySelectorAll('span');
            let totalAtk = 0;
            let totalDef = 0;
            allSpans.forEach(span => {
              const text = span.textContent.trim();
              const match = text.match(/^(\d+)\/(\d+)$/);
              if (match) {
                const atk = parseInt(match[1]) || 0;
                const def = parseInt(match[2]) || 0;
                totalAtk += atk;
                totalDef += def;
              }
            });
            const message = `Nibiru Token ATK:${totalAtk} DEF:${totalDef}`;
            typeInChat(message);
          }
        } else if (btnId === "custom_chat_action") {
          typeInChat(customMessage);
        } else {
          // Handle other button IDs
          const btn = document.getElementById(btnId);
          if (btn) btn.click();
        }
      }
    };
    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, [shortcuts]);

  const handleShortcutChange = (btnId, e) => {
    const key = e.target.value.toLowerCase();
    if (shortcuts[key] && shortcuts[key] !== btnId) {
      const conflictingButton = BUTTONS.find(b => b.id === shortcuts[key]);
      setWarningMessage(`Key '${key.toUpperCase()}' is already assigned to "${conflictingButton.label}". Please choose a different key.`);
      return;
    }
    setWarningMessage('');
    const newShortcuts = { ...shortcuts };

    Object.keys(newShortcuts).forEach((k) => {
      if (newShortcuts[k] === btnId) delete newShortcuts[k];
    });

    if (key) newShortcuts[key] = btnId;
    setShortcuts(newShortcuts);
    chrome.storage.sync.set({ shortcutKeys: newShortcuts });
  };

  return (
    <div className="shortcut-section">
      <div className="shortcut-toggle" onClick={() => setCollapsed((c) => !c)}>
        <span>Keyboard Shortcuts</span>
        <span className="shortcut-icon">{collapsed ? "▼" : "▲"}</span>
      </div>

      {!collapsed && (
        <div className="shortcut-body">
          {warningMessage && <div style={{color: 'red', marginBottom: '10px', wordWrap: 'break-word'}}>{warningMessage}</div>}
          {BUTTONS.map((btn) => {
            if (btn.id === "custom_chat_action") {
              return (
                <div className="shortcut-row" key={btn.id} style={{flexDirection: 'column', alignItems: 'flex-start'}}>
                  <div style={{display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center'}}>
                    <label className="shortcut-label">{btn.label}:</label>
                    <input
                      className="shortcut-input"
                      type="text"
                      maxLength={1}
                      value={
                        Object.entries(shortcuts).find(
                          ([, id]) => id === btn.id
                        )?.[0] || ""
                      }
                      onChange={(e) => handleShortcutChange(btn.id, e)}
                      placeholder="Key"
                    />
                  </div>
                  <textarea
                    style={{width: '100%', marginTop: '5px', minHeight: '40px', resize: 'vertical'}}
                    value={customMessage}
                    onChange={(e) => {
                      setCustomMessage(e.target.value);
                      chrome.storage.sync.set({ customChatMessage: e.target.value });
                    }}
                    placeholder="Enter custom chat message"
                  />
                </div>
              );
            } else if (btn.id === "nibiru_action") {
              return (
                <div key={btn.id}>
                  <div className="shortcut-row">
                    <label className="shortcut-label">{btn.label}:</label>
                    <input
                      className="shortcut-input"
                      type="text"
                      maxLength={1}
                      value={
                        Object.entries(shortcuts).find(
                          ([, id]) => id === btn.id
                        )?.[0] || ""
                      }
                      onChange={(e) => handleShortcutChange(btn.id, e)}
                      placeholder="Key"
                    />
                  </div>
                  <div style={{fontSize: '11px', color: '#b15c1cff', marginTop: '2px', marginLeft: '10px', lineHeight: '1.3'}}>
                    Please use this shortcut before you summoned Nibiru and monsters are removed from field, else this will not sum correctly.
                  </div>
                </div>
              );
            }
            return (
              <div className="shortcut-row" key={btn.id}>
                <label className="shortcut-label">{btn.label}:</label>
                <input
                  className="shortcut-input"
                  type="text"
                  maxLength={1}
                  value={
                    Object.entries(shortcuts).find(
                      ([, id]) => id === btn.id
                    )?.[0] || ""
                  }
                  onChange={(e) => handleShortcutChange(btn.id, e)}
                  placeholder="Key"
                />
              </div>
            );
          })}

          <div className="shortcut-hint">
            Assign a letter key to each button.
            <br />
            When pressed, that button will be triggered.
          </div>
        </div>
      )}
    </div>
  );
};

export default ShortcutKeys;
