import React, { useState, useEffect } from "react";
import HelpTip from "./HelpTip";

const Notes = () => {
  const [enabled, setEnabled] = useState(false);
  const [notesText, setNotesText] = useState("");
  const [notesPosition, setNotesPosition] = useState({
    left: "10px",
    top: "100px",
  });

  const notesElementId = "duelingbook-notes-box";

  const createNotesElement = (text, position) => {
    let notesDiv = document.getElementById(notesElementId);
    if (!notesDiv) {
      notesDiv = document.createElement("div");
      notesDiv.id = notesElementId;
      notesDiv.style.cssText = `
        position: fixed;
        left: ${position.left};
        top: ${position.top};
        background: #191919f0;
        border: 1px solid rgb(74, 74, 74);
        color: #eee;
        padding: 8px;
        z-index: 9998;
        font-family: Arial, sans-serif;
        box-shadow: rgba(0, 0, 0, 0.35) 0px 8px 24px;
        border-radius: 8px;
        width: 200px;
        max-width: 300px;
        display: block;
        cursor: move;
      `;

      let isDragging = false;
      let dragOffsetX, dragOffsetY;

      notesDiv.addEventListener("mousedown", (e) => {
        if (e.target.tagName === "TEXTAREA" || e.target.tagName === "BUTTON")
          return;
        isDragging = true;
        dragOffsetX = e.clientX - notesDiv.offsetLeft;
        dragOffsetY = e.clientY - notesDiv.offsetTop;
        e.preventDefault();
      });

      document.addEventListener("mousemove", (e) => {
        if (isDragging) {
          const newLeft = e.clientX - dragOffsetX;
          const newTop = e.clientY - dragOffsetY;
          notesDiv.style.left = newLeft + "px";
          notesDiv.style.top = newTop + "px";
        }
      });

      document.addEventListener("mouseup", () => {
        if (isDragging) {
          isDragging = false;
          const newPosition = {
            left: notesDiv.style.left,
            top: notesDiv.style.top,
          };
          setNotesPosition(newPosition);
          chrome.storage.sync.set({ notesPosition: newPosition });
        }
      });

      const footerDiv = document.createElement("div");
      footerDiv.style.cssText = `font-size: 12px; color: #9aa0a6; margin-bottom: 5px; user-select: none;`;

      const clearButton = document.createElement("button");
      clearButton.textContent = "Clear Notes";
      clearButton.style.cssText = `margin-top: 5px; margin-right: 14px; padding: 2px 8px; border: 1px solid rgb(74, 74, 74); border-radius: 6px; background: #2b2b2b; color: #eee; cursor: pointer;`;
      clearButton.addEventListener("click", () => {
        textarea.value = "";
        setNotesText("");
        chrome.storage.sync.set({ notesText: "" });
      });

      footerDiv.appendChild(clearButton);
      footerDiv.appendChild(document.createTextNode(" Drag to reposition"));

      const textarea = document.createElement("textarea");
      textarea.style.cssText = `
        width: 100%;
        height: 100px;
        border: 1px solid rgb(74 74 74);
        border-radius: 4px;
        padding: 5px;
        font-family: inherit;
        resize: vertical;
        box-sizing: border-box;
        color: white;
        background: #191919ed;
      `;
      textarea.value = text;
      textarea.placeholder = "Write your notes here...";
      textarea.addEventListener("input", (e) => {
        const newText = e.target.value;
        setNotesText(newText);
        chrome.storage.sync.set({ notesText: newText });
      });

      notesDiv.appendChild(footerDiv);
      notesDiv.appendChild(textarea);
      document.body.appendChild(notesDiv);
    } else {
      const textarea = notesDiv.querySelector("textarea");
      if (textarea) textarea.value = text;
      notesDiv.style.display = "block";
    }
  };

  const removeNotesElement = () => {
    const notesDiv = document.getElementById(notesElementId);
    if (notesDiv) {
      notesDiv.remove();
    }
  };

  useEffect(() => {
    chrome.storage.sync.get(
      ["notesEnabled", "notesText", "notesPosition"],
      (result) => {
        const isEnabled = result.notesEnabled || false;
        const text = result.notesText || "";
        const position = result.notesPosition || { left: "10px", top: "100px" };
        setEnabled(isEnabled);
        setNotesText(text);
        setNotesPosition(position);
        if (isEnabled) {
          createNotesElement(text, position);
        }
      }
    );

    // Add global Shift+N listener to toggle notes (ignores when typing)
    const handleGlobalKey = (e) => {
      if ((e.key === "N" || e.key === "n") && e.shiftKey) {
        const active = document.activeElement;
        if (active && (active.tagName === "INPUT" || active.tagName === "TEXTAREA" || active.isContentEditable)) {
          return;
        }
        chrome.storage.sync.get(['notesEnabled'], (result) => {
          const currentEnabled = result.notesEnabled || false;
          const next = !currentEnabled;
          chrome.storage.sync.set({ notesEnabled: next });
          if (next) {
            chrome.storage.sync.get(['notesText', 'notesPosition'], (res) => {
              const text = res.notesText || '';
              const position = res.notesPosition || { left: "10px", top: "100px" };
              createNotesElement(text, position);
            });
          } else {
            removeNotesElement();
          }
          setEnabled(next);
        });
      }
    };

    window.addEventListener("keydown", handleGlobalKey);
    return () => {
      window.removeEventListener("keydown", handleGlobalKey);
    };
  }, []);

  const handleToggleChange = (e) => {
    const newEnabled = e.target.checked;
    setEnabled(newEnabled);
    chrome.storage.sync.set({ notesEnabled: newEnabled });
    if (newEnabled) {
      createNotesElement(notesText, notesPosition);
    } else {
      removeNotesElement();
    }
  };

  return (
    <div className="setting-item">
      <label className="setting-toggle">
        <input
          type="checkbox"
          checked={enabled}
          onChange={handleToggleChange}
        />
        Persistent Notes
      
        <HelpTip text="Adds a draggable notepad to the page. Whatever you type is saved and is still there next time you open DuelingBook." />
      </label>
    </div>
  );
};

export default Notes;
