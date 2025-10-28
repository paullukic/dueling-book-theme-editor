import React, { useState, useEffect } from "react";
import "./ShortcutKeys.css";

const BUTTONS = [
  { id: "good_btn", label: "Ok" },
  { id: "shuffle_btn", label: "Shuffle Hand" },
  { id: "think_btn", label: "Thinking" },
  { id: "draw_action", label: "Draw 1" },
  { id: "mill_action", label: "Mill 1" },
];

const ShortcutKeys = () => {
  const [shortcuts, setShortcuts] = useState({
    a: "good_btn",
    s: "shuffle_btn",
    t: "think_btn",
    d: "draw_action",
    m: "mill_action",
  });
  const [collapsed, setCollapsed] = useState(true);

  useEffect(() => {
    chrome.storage.sync.get(["shortcutKeys"], (result) => {
      if (result.shortcutKeys) {
        setShortcuts(result.shortcutKeys);
      } else {
        const defaultKeys = {
          a: "good_btn",
          s: "shuffle_btn",
          t: "think_btn",
          d: "draw_action",
          m: "mill_action",
        };
        setShortcuts(defaultKeys);
        chrome.storage.sync.set({ shortcutKeys: defaultKeys });
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
          const input = document.querySelector("#duel .cin_txt");
          if (input) {
            input.focus();
            input.value = "/draw 1";
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
        } else if (btnId === "mill_action") {
          const input = document.querySelector("#duel .cin_txt");
          if (input) {
            input.focus();
            input.value = "/mill 1";
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
          {BUTTONS.map((btn) => (
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
          ))}

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
