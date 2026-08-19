import React, { useState, useEffect } from "react";
import "./ShortcutKeys.css";
import HelpTip from "./HelpTip";

const CUSTOM_SLOTS = 5;
const CUSTOM_PREFIX = "custom_chat_";

const CUSTOM_BUTTONS = Array.from({ length: CUSTOM_SLOTS }, (_, i) => ({
  id: CUSTOM_PREFIX + (i + 1),
  label: "Custom chat " + (i + 1),
}));

const PHASE_IDS = [
  "draw_phase",
  "standby_phase",
  "main1_phase",
  "battle_phase",
  "main2_phase",
  "end_phase",
];

const NIBIRU_HELP =
  "Please use this shortcut before you summoned Nibiru and monsters are removed from field, else this will not sum correctly.";

const BUTTONS = [
  { id: "good_btn", label: "Signal Ok" },
  { id: "shuffle_btn", label: "Shuffle Hand" },
  { id: "think_btn", label: "Thinking" },
  { id: "draw_action", label: "Draw 1 Card" },
  { id: "mill_action", label: "Mill 1 Card" },
  { id: "discard_action", label: "Discard Random Card" },
  { id: "half_action", label: "Half your Life Points" },
  { id: "nibiru_action", label: "Nibiru Stats" },
  ...CUSTOM_BUTTONS,
  { id: "draw_phase", label: "Draw Phase?" },
  { id: "standby_phase", label: "Standby Phase?" },
  { id: "main1_phase", label: "Main Phase 1?" },
  { id: "battle_phase", label: "Battle Phase?" },
  { id: "main2_phase", label: "Main Phase 2?" },
  { id: "end_phase", label: "End Phase?" },
];

const DEFAULT_KEYS = {
  a: "good_btn",
  s: "shuffle_btn",
  t: "think_btn",
  d: "draw_action",
  m: "mill_action",
  r: "discard_action",
  h: "half_action",
  n: "nibiru_action",
  g: CUSTOM_PREFIX + "1",
  "1": "draw_phase",
  "2": "standby_phase",
  "3": "main1_phase",
  "4": "battle_phase",
  "5": "main2_phase",
  "6": "end_phase",
};

const emptyMessages = () => new Array(CUSTOM_SLOTS).fill("");

const isCustom = (btnId) => btnId.indexOf(CUSTOM_PREFIX) === 0;
const customSlot = (btnId) => Number(btnId.slice(CUSTOM_PREFIX.length)) - 1;

// Fill in defaults for buttons the user has never assigned, without clobbering
// their own bindings or double-assigning a button that they moved to a new key.
const withDefaults = (saved) => {
  const merged = { ...saved };
  const assigned = new Set(Object.keys(merged).map((k) => merged[k]));
  Object.keys(DEFAULT_KEYS).forEach((key) => {
    const id = DEFAULT_KEYS[key];
    if (!assigned.has(id) && !merged[key]) {
      merged[key] = id;
      assigned.add(id);
    }
  });
  return merged;
};

const ShortcutKeys = () => {
  const [shortcuts, setShortcuts] = useState(DEFAULT_KEYS);
  const [collapsed, setCollapsed] = useState(true);
  const [conflict, setConflict] = useState(null);
  const [customMessages, setCustomMessages] = useState(emptyMessages);
  const [phaseCollapsed, setPhaseCollapsed] = useState(true);

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

  // Load saved settings once.
  useEffect(() => {
    chrome.storage.sync.get(
      ["shortcutKeys", "customChatMessage", "customChatMessages"],
      (result) => {
        let saved = result.shortcutKeys;
        if (saved) {
          // Earlier versions had a single custom slot named custom_chat_action.
          saved = { ...saved };
          Object.keys(saved).forEach((k) => {
            if (saved[k] === "custom_chat_action") saved[k] = CUSTOM_PREFIX + "1";
          });
          const merged = withDefaults(saved);
          setShortcuts(merged);
          if (JSON.stringify(merged) !== JSON.stringify(result.shortcutKeys)) {
            chrome.storage.sync.set({ shortcutKeys: merged });
          }
        } else {
          setShortcuts(DEFAULT_KEYS);
          chrome.storage.sync.set({ shortcutKeys: DEFAULT_KEYS });
        }

        let msgs;
        if (Array.isArray(result.customChatMessages)) {
          msgs = result.customChatMessages.slice(0, CUSTOM_SLOTS);
        } else {
          // Migrate the old single message into slot 1.
          msgs = emptyMessages();
          msgs[0] =
            result.customChatMessage !== undefined
              ? result.customChatMessage
              : "GLHF";
        }
        while (msgs.length < CUSTOM_SLOTS) msgs.push("");
        setCustomMessages(msgs);
        chrome.storage.sync.set({ customChatMessages: msgs });
      }
    );
  }, []);

  // Rebind the listener whenever the bindings or the messages change, otherwise
  // it keeps firing with a stale copy of them.
  useEffect(() => {
    const handleKeyup = (e) => {
      if (
        document.activeElement.tagName === "INPUT" ||
        document.activeElement.tagName === "TEXTAREA" ||
        e.shiftKey
      )
        return;
      const key = e.key.toLowerCase();
      const btnId = shortcuts[key];
      if (!btnId) return;

      if (btnId === "draw_action") {
        typeInChat("/draw 1");
      } else if (btnId === "mill_action") {
        typeInChat("/mill 1");
      } else if (btnId === "discard_action") {
        typeInChat("/discardrandom");
      } else if (btnId === "half_action") {
        typeInChat("/half");
      } else if (btnId === "nibiru_action") {
        const field = document.getElementById("duel_content");
        if (field) {
          const allSpans = field.querySelectorAll("span");
          let totalAtk = 0;
          let totalDef = 0;
          allSpans.forEach((span) => {
            const text = span.textContent.trim();
            const match = text.match(/^(\d+)\/(\d+)$/);
            if (match) {
              const atk = parseInt(match[1]) || 0;
              const def = parseInt(match[2]) || 0;
              totalAtk += atk;
              totalDef += def;
            }
          });
          typeInChat(`Nibiru Token ATK:${totalAtk} DEF:${totalDef}`);
        }
      } else if (isCustom(btnId)) {
        const message = customMessages[customSlot(btnId)];
        if (message) typeInChat(message);
      } else if (btnId === "draw_phase") {
        typeInChat("Draw Phase?");
        const dpDiv = document.getElementById("dp");
        if (dpDiv) dpDiv.click();
      } else if (btnId === "standby_phase") {
        typeInChat("Standby Phase?");
        const spDiv = document.getElementById("sp");
        if (spDiv) spDiv.click();
      } else if (btnId === "main1_phase") {
        typeInChat("Main Phase 1?");
        const m1Div = document.getElementById("m1");
        if (m1Div) m1Div.click();
      } else if (btnId === "battle_phase") {
        typeInChat("Battle Phase?");
        const bpDiv = document.getElementById("bp");
        if (bpDiv) bpDiv.click();
      } else if (btnId === "main2_phase") {
        typeInChat("Main Phase 2?");
        const m2Div = document.getElementById("m2");
        if (m2Div) m2Div.click();
      } else if (btnId === "end_phase") {
        typeInChat("End Phase?");
        const epDiv = document.getElementById("ep");
        if (epDiv) epDiv.click();
      } else {
        const btn = document.getElementById(btnId);
        if (btn) btn.click();
      }
    };

    window.addEventListener("keyup", handleKeyup);
    return () => window.removeEventListener("keyup", handleKeyup);
  }, [shortcuts, customMessages]);

  const handleShortcutChange = (btnId, e) => {
    const key = e.target.value.toLowerCase();
    if (shortcuts[key] && shortcuts[key] !== btnId) {
      const conflictingButton = BUTTONS.find((b) => b.id === shortcuts[key]);
      setConflict({
        btnId: btnId,
        key: key.toUpperCase(),
        label: conflictingButton ? conflictingButton.label : shortcuts[key],
      });
      return;
    }
    setConflict(null);
    const newShortcuts = { ...shortcuts };

    Object.keys(newShortcuts).forEach((k) => {
      if (newShortcuts[k] === btnId) delete newShortcuts[k];
    });

    if (key) newShortcuts[key] = btnId;
    setShortcuts(newShortcuts);
    chrome.storage.sync.set({ shortcutKeys: newShortcuts });
  };

  const handleCustomMessageChange = (slot, value) => {
    const next = customMessages.slice();
    next[slot] = value;
    setCustomMessages(next);
    chrome.storage.sync.set({ customChatMessages: next });
  };

  const keyFor = (btnId) => {
    const entry = Object.keys(shortcuts).find((k) => shortcuts[k] === btnId);
    return entry || "";
  };

  const renderKeyInput = (btn) => (
    <input
      className="shortcut-input"
      type="text"
      maxLength={1}
      value={keyFor(btn.id)}
      onChange={(e) => handleShortcutChange(btn.id, e)}
      placeholder="Key"
    />
  );

  // Shown directly under the row whose key the user just tried to reuse.
  const renderConflict = (btn) => {
    if (!conflict || conflict.btnId !== btn.id) return null;
    return (
      <div className="shortcut-conflict" role="alert">
        Key "{conflict.key}" is already bound to "{conflict.label}". Unbind it
        there first, then set it here.
      </div>
    );
  };

  const renderRow = (btn) => {
    if (isCustom(btn.id)) {
      const slot = customSlot(btn.id);
      return (
        <React.Fragment key={btn.id}>
          <div className="shortcut-row custom-chat-row">
            <div className="custom-chat-head">
              <label className="shortcut-label">{btn.label}:</label>
              {renderKeyInput(btn)}
            </div>
            <textarea
              className="custom-chat-text"
              value={customMessages[slot] || ""}
              onChange={(e) => handleCustomMessageChange(slot, e.target.value)}
              placeholder={`Message ${slot + 1}`}
            />
          </div>
          {renderConflict(btn)}
        </React.Fragment>
      );
    }

    if (btn.id === "nibiru_action") {
      return (
        <React.Fragment key={btn.id}>
          <div className="shortcut-row">
            <label className="shortcut-label">
              {btn.label}:
              <HelpTip text={NIBIRU_HELP} tone="warn" />
            </label>
            {renderKeyInput(btn)}
          </div>
          {renderConflict(btn)}
        </React.Fragment>
      );
    }

    return (
      <React.Fragment key={btn.id}>
        <div className="shortcut-row">
          <label className="shortcut-label">{btn.label}:</label>
          {renderKeyInput(btn)}
        </div>
        {renderConflict(btn)}
      </React.Fragment>
    );
  };

  return (
    <div className="shortcut-section" style={{ marginTop: "10px" }}>
      <div className="shortcut-toggle" onClick={() => setCollapsed((c) => !c)}>
        <span>
          Keyboard Shortcuts
          <HelpTip text="Bind one key to each in-duel action. Press it during a duel to fire that action. Keys are ignored while you are typing in chat or holding Shift." />
        </span>
        <span className="shortcut-icon">{collapsed ? "▼" : "▲"}</span>
      </div>

      {!collapsed && (
        <div className="shortcut-body">
          {BUTTONS.filter((btn) => PHASE_IDS.indexOf(btn.id) === -1).map(renderRow)}

          <div className="shortcut-hint">
            Assign a letter key to each button.
            <br />
            When pressed, that button will be triggered.
            <br />
            Custom chat slots stay idle until you give them a key and a message.
          </div>
        </div>
      )}

      <div
        className="shortcut-toggle"
        onClick={() => setPhaseCollapsed((c) => !c)}
      >
        <span>
          Phase Shortcuts
          <HelpTip text="Bind keys that ask about a phase in chat and click the matching phase button for you." />
        </span>
        <span className="shortcut-icon">{phaseCollapsed ? "▼" : "▲"}</span>
      </div>

      {!phaseCollapsed && (
        <div className="shortcut-body">
          {BUTTONS.filter((btn) => PHASE_IDS.indexOf(btn.id) !== -1).map(renderRow)}

          <div className="shortcut-hint">
            Phase shortcuts ask about the phase and advance to it.
          </div>
        </div>
      )}
    </div>
  );
};

export default ShortcutKeys;
