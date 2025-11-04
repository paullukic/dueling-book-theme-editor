import React, { useEffect, useRef, useState } from "react";

const STORAGE_KEYS = {
  enabled: "actionLogEnabled",
  items: "actionLogItems",
  position: "actionLogPosition",
  lastTime: "actionLogLastTime",
};

const defaultPosition = { left: "320px", top: "100px" };
const ACTION_BOX_ID = "duelingbook-actionlog-box";
const HAND_BOX_ID = "duelingbook-hand-box";
const HAND_BUTTON_ID = "duelingbook-hand-button";
const HAND_STORAGE_KEYS = {
  counts: "actionHandCounts",
  position: "actionHandPosition",
  visible: "actionHandVisible",
};

const ActionTracker = () => {
  const [enabled, setEnabled] = useState(false);
  const [items, setItems] = useState([]);
  const [position, setPosition] = useState(defaultPosition);
  const [handCounts, setHandCounts] = useState({});
  const [handVisible, setHandVisible] = useState(false);
  const [handPosition, setHandPosition] = useState({ left: "580px", top: "100px" });

  const observerRef = useRef(null);
  const retryTimerRef = useRef(null);
  const viewObserverRef = useRef(null);
  const viewRetryTimerRef = useRef(null);
  const handScanTimerRef = useRef(null);
  const knownHandRef = useRef(new Set());
  const itemsRef = useRef(items);
  const lastTimeRef = useRef(-1); // seconds since duel start
  const handCountsRef = useRef(handCounts);
  const handPositionRef = useRef(handPosition);

  useEffect(() => {
    itemsRef.current = items;
  }, [items]);
  useEffect(() => {
    handCountsRef.current = handCounts;
  }, [handCounts]);
  useEffect(() => {
    handPositionRef.current = handPosition;
  }, [handPosition]);

  const createActionBox = (persistedItems = [], pos = position) => {
    let box = document.getElementById(ACTION_BOX_ID);
    if (!box) {
      box = document.createElement("div");
      box.id = ACTION_BOX_ID;
      box.style.cssText = `
        position: fixed;
        left: ${pos.left};
        top: ${pos.top};
        background: #191919f0;
        color: #eee;
        padding: 10px 10px 8px 10px;
        z-index: 9998;
        font-family: Arial, sans-serif;
        box-shadow: rgba(0, 0, 0, 0.35) 0px 8px 24px;
        border-radius: 10px;
        border: 1px solid rgb(74, 74, 74);
        min-width: 250px;
        max-width: 250px;
        max-height: 250px;
        overflow: auto;
        cursor: move;
      `;

      // Drag handling
      let dragging = false;
      let offsetX = 0;
      let offsetY = 0;
      box.addEventListener("mousedown", (e) => {
        // Don't start dragging when clicking delete buttons
        if (e.target && (e.target.tagName === "BUTTON" || e.target.getAttribute("data-nodrag") === "true")) return;
        dragging = true;
        offsetX = e.clientX - box.offsetLeft;
        offsetY = e.clientY - box.offsetTop;
        e.preventDefault();
      });
      document.addEventListener("mousemove", (e) => {
        if (!dragging) return;
        const newLeft = e.clientX - offsetX;
        const newTop = e.clientY - offsetY;
        box.style.left = `${newLeft}px`;
        box.style.top = `${newTop}px`;
      });
      document.addEventListener("mouseup", () => {
        if (!dragging) return;
        dragging = false;
        const newPosition = { left: box.style.left, top: box.style.top };
        setPosition(newPosition);
        chrome.storage.sync.set({ [STORAGE_KEYS.position]: newPosition });
      });

      // Header (Clear + hint)
      const header = document.createElement("div");
      header.style.cssText = `
        font-size: 12px;
        color: #9aa0a6;
        margin-bottom: 6px;
        user-select: none;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
      `;

      const clearAllBtn = document.createElement("button");
      clearAllBtn.textContent = "Clear All";
      clearAllBtn.style.cssText = `
        margin-top: 4px;
        border: 1px solid rgb(74, 74, 74);
        border-radius: 6px;
        background: #2b2b2b;
        color: #eee;
        cursor: pointer;
        padding: 2px 8px;
      `;
      clearAllBtn.addEventListener("click", (e) => {
        e.stopPropagation(); // avoid triggering drag
        setItems([]);
        // Reset items and lastTime so new entries (even in same second) are captured
        lastTimeRef.current = -1;
        chrome.storage.sync.set({ [STORAGE_KEYS.items]: [], [STORAGE_KEYS.lastTime]: -1 });
        // Also reset known-hand session so it can repopulate once
        knownHandRef.current.clear();
        const list = box.querySelector("ul");
        if (list) list.innerHTML = "";
      });

  header.appendChild(clearAllBtn);
  const hint = document.createElement('span');
  hint.textContent = 'Drag to reposition';
  hint.style.cssText = 'opacity: 0.85;';
  header.appendChild(hint);

      const list = document.createElement("ul");
      list.style.cssText = `
        list-style: none;
        margin: 0;
        padding: 0;
      `;

      // Render helper: parse timestamp and card name and build styled nodes
      const renderEntryText = (text, container) => {
        // Special case: Known in hand entries -> highlight card name in green and optional count suffix
        const kh = text.match(/^Known in hand: \"(.+?)\"(?:\s+x(\d+))?$/);
        if (kh) {
          const label = document.createTextNode('Known in hand: ');
          container.appendChild(label);
          const card = document.createElement('span');
          card.textContent = kh[1];
          card.style.cssText = 'color:#2ecc71;background:rgba(46,204,113,0.18);padding:0 3px;border-radius:4px;font-weight:600;';
          container.appendChild(card);
          if (kh[2]) {
            container.appendChild(document.createTextNode(` x${kh[2]}`));
          }
          return;
        }

        const tsMatch = text.match(/^\[(\d{1,2}:\d{2}(?::\d{2})?)\]\s*/);
        let rest = text;
        if (tsMatch) {
          const ts = document.createElement('span');
          ts.textContent = `[${tsMatch[1]}]`;
          ts.style.cssText = 'color:#9aa0a6;margin-right:6px;';
          container.appendChild(ts);
          rest = text.slice(tsMatch[0].length);
        }
  // Capture action and card name
  const m = rest.match(/\b(Added|Set|Placed|Revealed|Returned)\s+(.+?)(?:\s+from\s+|\s+in\s+|\s+to\s+|$)/i);
        if (m) {
          const before = rest.slice(0, m.index);
          if (before) container.appendChild(document.createTextNode(before));
          const action = document.createTextNode(m[1] + ' ');
          container.appendChild(action);
          const card = document.createElement('span');
          card.textContent = m[2];
          card.style.cssText = 'color:#ffd54d;background:rgba(255,213,77,0.15);padding:0 3px;border-radius:4px;font-weight:600;';
          container.appendChild(card);
          // ensure a space after the highlighted card
          container.appendChild(document.createTextNode(' '));
          const after = rest.slice(m.index + m[0].length);
          if (after) container.appendChild(document.createTextNode(after));
        } else {
          container.appendChild(document.createTextNode(rest));
        }
      };

      // Helper to add a single item row
      const addItemRow = (text) => {
        const li = document.createElement("li");
        li.style.cssText = `
          display: flex;
          align-items: center;
          gap: 8px;
          margin: 6px 0;
          padding: 6px 6px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 6px;
        `;
        const minusBtn = document.createElement("button");
        minusBtn.textContent = "-";
        minusBtn.setAttribute("data-nodrag", "true");
        minusBtn.title = "Remove";
        minusBtn.style.cssText = `
          width: 22px;
          height: 22px;
          line-height: 18px;
          border: 1px solid rgb(74, 74, 74);
          border-radius: 6px;
          background: #2b2b2b;
          color: #eee;
          cursor: pointer;
          flex: 0 0 auto;
        `;
        const textWrap = document.createElement("div");
        textWrap.style.cssText = `
          font-size: 12px;
          color: #eee;
          line-height: 1.3;
          white-space: normal;
          word-break: break-word;
          flex: 1 1 auto;
        `;
        renderEntryText(text, textWrap);

        minusBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          // remove from state/storage
          setItems((prev) => {
            const next = prev.filter((t, idx) => {
              // Match by identity and preserve order; remove the first match
              if (t === text && !li._removed) {
                li._removed = true;
                return false;
              }
              return true;
            });
            chrome.storage.sync.set({ [STORAGE_KEYS.items]: next });
            return next;
          });
          // remove from DOM
          li.remove();
        });

        li.appendChild(minusBtn);
        li.appendChild(textWrap);
        list.appendChild(li);
      };

      // Seed with persisted items
      (persistedItems || []).forEach(addItemRow);

      box.appendChild(header);
      box.appendChild(list);
      document.body.appendChild(box);

      // Expose a method on the node to add items from observer
      box.__addActionRow = (text) => addItemRow(text);
    } else {
      box.style.display = "block";
      // Refill list from persisted items
      const list = box.querySelector("ul");
      if (list) {
        list.innerHTML = "";
        persistedItems.forEach((t) => {
          const add = box.__addActionRow || ((x) => {
            const li = document.createElement("li");
            li.textContent = x;
            list.appendChild(li);
          });
          add(t);
        });
      }
    }
  };

  const removeActionBox = () => {
    const box = document.getElementById(ACTION_BOX_ID);
    if (box) box.remove();
  };

  // ----- Hand button and box -----
  const rerenderHandList = (boxNode, countsObj) => {
    const list = boxNode.querySelector("ul");
    if (!list) return;
    list.innerHTML = "";
    const names = Object.keys(countsObj).sort((a,b)=>a.localeCompare(b));
    names.forEach((nm) => {
      const cnt = countsObj[nm] || 0;
      if (cnt <= 0) return;
      const li = document.createElement("li");
      li.style.cssText = `
        display:flex;align-items:center;gap:8px;margin:6px 0;padding:6px 6px;
        background: rgba(255,255,255,0.04);
        border: 1px solid rgba(255,255,255,0.08);
        border-radius: 6px;
      `;
      const minusBtn = document.createElement("button");
      minusBtn.textContent = "-";
      minusBtn.setAttribute("data-nodrag", "true");
      minusBtn.title = "Remove one";
      minusBtn.style.cssText = `
        width: 22px;height:22px;line-height:18px;border:1px solid rgb(74,74,74);
        border-radius:6px;background:#2b2b2b;color:#eee;cursor:pointer;flex:0 0 auto;
      `;
      const textWrap = document.createElement("div");
      textWrap.style.cssText = `font-size:12px;color:#eee;line-height:1.3;white-space:normal;word-break:break-word;flex:1 1 auto;`;
      // Green-highlighted card name with count
      const label = document.createTextNode("Known in hand: ");
      textWrap.appendChild(label);
      const card = document.createElement("span");
      card.textContent = nm;
      card.style.cssText = 'color:#2ecc71;background:rgba(46,204,113,0.18);padding:0 3px;border-radius:4px;font-weight:600;';
      textWrap.appendChild(card);
      if (cnt > 1) textWrap.appendChild(document.createTextNode(` x${cnt}`));

      minusBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        setHandCounts((prev) => {
          const next = { ...prev };
          if (next[nm] && next[nm] > 1) next[nm] = next[nm] - 1; else delete next[nm];
          chrome.storage.sync.set({ [HAND_STORAGE_KEYS.counts]: next });
          // Re-render after state updates by scheduling microtask
          queueMicrotask(() => {
            const hb = document.getElementById(HAND_BOX_ID);
            if (hb) rerenderHandList(hb, next);
            // update badge
            const badge = document.getElementById(HAND_BUTTON_ID + '-badge');
            if (badge) {
              const total = Object.values(next).reduce((a, v) => a + (v || 0), 0);
              if (total > 0) { badge.textContent = String(total); badge.style.display = 'inline-block'; } else { badge.style.display = 'none'; }
            }
          });
          return next;
        });
      });

      li.appendChild(minusBtn);
      li.appendChild(textWrap);
      list.appendChild(li);
    });
  };

  const createHandBox = (countsObj = handCounts, pos = handPosition) => {
    let box = document.getElementById(HAND_BOX_ID);
    if (!box) {
      box = document.createElement("div");
      box.id = HAND_BOX_ID;
      box.style.cssText = `
        position: fixed; left: ${pos.left}; top: ${pos.top};
        background:#191919f0;color:#eee;padding:10px 10px 8px 10px;z-index:9998;
        font-family: Arial, sans-serif; box-shadow: rgba(0,0,0,.35) 0 8px 24px;
        border-radius:10px;border:1px solid rgb(74,74,74); min-width:250px;max-width:250px;max-height:250px;overflow:auto;cursor: move;`;

      // Dragging
      let dragging=false, offsetX=0, offsetY=0;
      box.addEventListener("mousedown", (e)=>{
        if (e.target && (e.target.tagName === 'BUTTON' || e.target.getAttribute('data-nodrag')==='true')) return;
        dragging=true; offsetX = e.clientX - box.offsetLeft; offsetY = e.clientY - box.offsetTop; e.preventDefault();
      });
      document.addEventListener("mousemove", (e)=>{
        if (!dragging) return; box.style.left = `${e.clientX - offsetX}px`; box.style.top = `${e.clientY - offsetY}px`;
      });
      document.addEventListener("mouseup", ()=>{
        if (!dragging) return; dragging=false; const newPos = { left: box.style.left, top: box.style.top };
        setHandPosition(newPos);
        handPositionRef.current = newPos;
        chrome.storage.sync.set({ [HAND_STORAGE_KEYS.position]: newPos });
      });

      const header = document.createElement("div");
      header.style.cssText = 'font-size:12px;color:#9aa0a6;margin-bottom:6px;user-select:none;display:flex;align-items:center;justify-content:space-between;gap:8px;';
      const title = document.createElement('span');
      title.textContent = 'Opponent Hand';
      header.appendChild(title);
      const clearBtn = document.createElement('button');
      clearBtn.textContent = 'Clear';
      clearBtn.style.cssText = 'margin-top:4px;border:1px solid rgb(74,74,74);border-radius:6px;background:#2b2b2b;color:#eee;cursor:pointer;padding:2px 8px;';
      clearBtn.addEventListener('click', (e)=>{
        e.stopPropagation();
        const next = {};
        setHandCounts(next);
        chrome.storage.sync.set({ [HAND_STORAGE_KEYS.counts]: next });
        const list = box.querySelector('ul'); if (list) list.innerHTML = '';
        const badge = document.getElementById(HAND_BUTTON_ID + '-badge');
        if (badge) badge.style.display = 'none';
      });
      header.appendChild(clearBtn);

      const list = document.createElement('ul');
      list.style.cssText = 'list-style:none;margin:0;padding:0;';

      box.appendChild(header);
      box.appendChild(list);
      document.body.appendChild(box);
    }
    // fill contents
    rerenderHandList(box, countsObj);
    box.style.display = 'block';
  };

  const removeHandBox = () => {
    const box = document.getElementById(HAND_BOX_ID);
    if (box) box.remove();
  };

  const createHandButton = (visible = handVisible) => {
    let btn = document.getElementById(HAND_BUTTON_ID);
    if (!btn) {
      btn = document.createElement('button');
      btn.id = HAND_BUTTON_ID;
      btn.textContent = 'Hand';
      btn.title = 'Show known cards in opponent\'s hand';
      btn.style.cssText = `
        position: fixed; right: 8px; top: 40%; transform: translateY(-40%);
        z-index: 9999; padding: 8px 10px; border-radius: 8px; border: 1px solid rgb(74,74,74);
        background:#2b2b2b;color:#eee; cursor:pointer; box-shadow: rgba(0,0,0,0.25) 0 4px 12px;`;
      // Badge for total count
      const badge = document.createElement('span');
      badge.id = HAND_BUTTON_ID + '-badge';
      badge.style.cssText = `
        position: absolute; top: -6px; right: -6px; min-width: 18px; height: 18px; padding: 0 4px;
        background: #e53935; color: #fff; border: none; border-radius: 9999px;
        display: none; font-size: 11px; line-height: 18px; text-align: center; font-weight: 700;`;
      btn.appendChild(badge);
      btn.addEventListener('click', () => {
        setHandVisible((prev) => {
          const next = !prev;
          chrome.storage.sync.set({ [HAND_STORAGE_KEYS.visible]: next });
          if (next) createHandBox(handCountsRef.current, handPositionRef.current); else removeHandBox();
          return next;
        });
      });
      document.body.appendChild(btn);
    }
    // sync initial state
  if (visible) createHandBox(handCountsRef.current, handPositionRef.current); else removeHandBox();
    // update badge initially
    const update = () => {
      const b = document.getElementById(HAND_BUTTON_ID + '-badge');
      if (!b) return;
      const total = Object.values(handCountsRef.current || {}).reduce((a, v) => a + (v || 0), 0);
      if (total > 0) {
        b.textContent = String(total);
        b.style.display = 'inline-block';
      } else {
        b.style.display = 'none';
      }
    };
    update();
  };

  const removeHandButton = () => {
    const btn = document.getElementById(HAND_BUTTON_ID);
    if (btn) btn.remove();
  };

  const mergeHandCounts = (countsMap) => {
    // Replace with the current snapshot of the opponent's hand (authoritative view)
    setHandCounts(() => {
      const next = {};
      countsMap.forEach((cnt, nm) => {
        if (cnt > 0) next[nm] = cnt;
      });
      chrome.storage.sync.set({ [HAND_STORAGE_KEYS.counts]: next });
      const hb = document.getElementById(HAND_BOX_ID);
      if (hb) rerenderHandList(hb, next);
      // update badge
      const badge = document.getElementById(HAND_BUTTON_ID + '-badge');
      if (badge) {
        const total = Object.values(next).reduce((a, v) => a + (v || 0), 0);
        if (total > 0) { badge.textContent = String(total); badge.style.display = 'inline-block'; } else { badge.style.display = 'none'; }
      }
      return next;
    });
  };

  // ----- Known hand capture (Viewing Opponent's Hand) -----
  // (Deprecated) addKnownHandItem removed in favor of handCounts panel

  const scanOpponentHandNow = () => {
    const view = document.getElementById('view');
    if (!view) return false;
    const title = view.querySelector('.title_txt.arial_rounded20');
    const titleText = (title?.textContent || '').trim();
    if (!titleText) return false;
    if (titleText.toLowerCase().includes("viewing opponent's hand")) {
      const nameNodes = view.querySelectorAll('.name_txt');
      const counts = new Map();
      nameNodes.forEach((n) => {
        const nm = (n.textContent || '').trim();
        if (!nm) return;
        counts.set(nm, (counts.get(nm) || 0) + 1);
      });
      mergeHandCounts(counts);
      return true;
    }
    // Leaving the hand view: end the per-session de-dup so a future view can repopulate
    if (knownHandRef.current.size) knownHandRef.current.clear();
    return false;
  };

  const startViewObserver = () => {
    if (viewObserverRef.current) return viewObserverRef.current;
    const tryAttach = () => {
      const view = document.getElementById('view');
      if (!view) return null;
      const obs = new MutationObserver(() => {
        // Debounce scans to coalesce attribute/child changes
        if (handScanTimerRef.current) window.clearTimeout(handScanTimerRef.current);
        handScanTimerRef.current = window.setTimeout(() => {
          handScanTimerRef.current = null;
          scanOpponentHandNow();
        }, 150);
      });
      obs.observe(view, { childList: true, subtree: true, characterData: true, attributes: true });
      viewObserverRef.current = obs;
      // Initial scan
      if (handScanTimerRef.current) window.clearTimeout(handScanTimerRef.current);
      handScanTimerRef.current = window.setTimeout(() => {
        handScanTimerRef.current = null;
        scanOpponentHandNow();
      }, 50);
      return obs;
    };

    // Try immediately
    if (!tryAttach()) {
      // Retry until #view appears
      viewRetryTimerRef.current = window.setInterval(() => {
        const attached = tryAttach();
        if (attached) {
          window.clearInterval(viewRetryTimerRef.current);
          viewRetryTimerRef.current = null;
        }
      }, 1000);
    }
  };

  const stopViewObserver = () => {
    if (viewObserverRef.current) {
      viewObserverRef.current.disconnect();
      viewObserverRef.current = null;
    }
    if (viewRetryTimerRef.current) {
      window.clearInterval(viewRetryTimerRef.current);
      viewRetryTimerRef.current = null;
    }
    if (handScanTimerRef.current) {
      window.clearTimeout(handScanTimerRef.current);
      handScanTimerRef.current = null;
    }
  };

  const captureFromNode = (node) => {
    const parseLogTimeToSeconds = (txt) => {
      // Matches [mm:ss] or [hh:mm:ss]
      const m = txt.match(/\[(\d{1,2})(?::(\d{2}))(?:\:(\d{2}))?\]/);
      if (!m) return null;
      const h = m[3] ? parseInt(m[1], 10) : 0;
      const mm = m[3] ? parseInt(m[2], 10) : parseInt(m[1], 10);
      const ss = m[3] ? parseInt(m[3], 10) : parseInt(m[2], 10);
      return (h * 3600) + (mm * 60) + ss;
    };
    const processFont = (fontEl) => {
      const color = fontEl.getAttribute("color");
      if (!color || color.toUpperCase() !== "#0000FF") return; // only blue entries
      const text = (fontEl.textContent || "").trim();
      if (!text) return;
  const lower = text.toLowerCase();
  if (!(lower.includes("added") || lower.includes("set") || lower.includes("placed") || lower.includes("revealed") || lower.includes("returned"))) return;
      // de-dup against existing items
      if (itemsRef.current && itemsRef.current.includes(text)) return;

      // Respect last seen time: skip anything older-or-equal than the latest we know
      const tSec = parseLogTimeToSeconds(text);
      if (tSec != null && lastTimeRef.current >= 0 && tSec < lastTimeRef.current) {
        return;
      }

      // Append to UI and storage/state
      const box = document.getElementById(ACTION_BOX_ID);
      if (box && box.__addActionRow) box.__addActionRow(text);
      setItems((prev) => {
        const next = [...prev, text];
        chrome.storage.sync.set({ [STORAGE_KEYS.items]: next });
        return next;
      });

      // Update last seen time
      if (tSec != null && (lastTimeRef.current < 0 || tSec > lastTimeRef.current)) {
        lastTimeRef.current = tSec;
        chrome.storage.sync.set({ [STORAGE_KEYS.lastTime]: lastTimeRef.current });
      }
    };

    if (node.nodeType === 1) {
      const el = node;
      if (el.tagName === "FONT") {
        processFont(el);
      }
      // Also scan any nested blue fonts within the added node
      const innerFonts = el.querySelectorAll && el.querySelectorAll('font[color="#0000FF"]');
      if (innerFonts && innerFonts.length) innerFonts.forEach(processFont);
    }
  };

  const startObserver = () => {
    // Try to find the container and viewport
    const findInDoc = (doc) => {
      if (!doc) return null;
      const url = doc.defaultView?.location?.href;
      const root = doc.getElementById("duel_log");
      if (root) {
        /* debug removed */
      }
      const container = (root && root.querySelector("div.log_txt.textarea.scrollpane.selectable"))
        || doc.querySelector("div.log_txt.textarea.scrollpane.selectable");
      if (container) {
        /* debug removed */
      }
      if (!container) return null;
      const viewport = container.querySelector(".os_viewport") || container.children[1] || container;
      if (viewport) {
        /* debug removed */
      }
      return viewport || null;
    };
    const findTarget = () => {
      // Try top document first
      let target = findInDoc(document);
      if (target) return target;
      // Then scan same-origin iframes
      const iframes = Array.from(document.querySelectorAll("iframe"));
  /* debug removed */
      for (const iframe of iframes) {
        try {
          const doc = iframe.contentDocument || iframe.contentWindow?.document;
          target = findInDoc(doc);
          if (target) return target;
        } catch (e) {
          // cross-origin, skip
          /* debug removed */
        }
      }
      return null;
    };

    const target = findTarget();
    if (target) {
  /* debug removed */
      const observer = new MutationObserver((mutations) => {
        for (const m of mutations) {
          if (m.type === "childList" && m.addedNodes && m.addedNodes.length) {
            /* debug removed */
            m.addedNodes.forEach(captureFromNode);
          } else if (m.type === "characterData" && m.target) {
            // Log a brief snippet of changed text for visibility
            /* debug removed */
            const parent = m.target.parentNode;
            if (parent) captureFromNode(parent);
          }
        }
      });
      observer.observe(target, { childList: true, characterData: true, subtree: true });
      observerRef.current = observer;

      // Seed existing content once in chronological order
      const existing = target.querySelectorAll('font[color="#0000FF"]');
  /* debug removed */
      const getTimeSecFromEl = (el) => {
        const txt = (el.textContent || "");
        const m = txt.match(/\[(\d{1,2})(?::(\d{2}))(?:\:(\d{2}))?\]/);
        if (!m) return -1;
        const h = m[3] ? parseInt(m[1], 10) : 0;
        const mm = m[3] ? parseInt(m[2], 10) : parseInt(m[1], 10);
        const ss = m[3] ? parseInt(m[3], 10) : parseInt(m[2], 10);
        return h * 3600 + mm * 60 + ss;
      };
      Array.from(existing)
        .sort((a, b) => getTimeSecFromEl(a) - getTimeSecFromEl(b))
        .forEach(captureFromNode);
    } else {
      // Retry periodically until found
      retryTimerRef.current = window.setInterval(() => {
        const t = findTarget();
        if (t) {
          window.clearInterval(retryTimerRef.current);
          retryTimerRef.current = null;
          /* debug removed */
          const observer = new MutationObserver((mutations) => {
            for (const m of mutations) {
              if (m.type === "childList" && m.addedNodes && m.addedNodes.length) {
                /* debug removed */
                m.addedNodes.forEach(captureFromNode);
              } else if (m.type === "characterData" && m.target) {
                /* debug removed */
                const parent = m.target.parentNode;
                if (parent) captureFromNode(parent);
              }
            }
          });
          observer.observe(t, { childList: true, characterData: true, subtree: true });
          observerRef.current = observer;

          // Seed existing content once in chronological order
          const existing = t.querySelectorAll('font[color="#0000FF"]');
          /* debug removed */
          const getTimeSecFromEl = (el) => {
            const txt = (el.textContent || "");
            const m = txt.match(/\[(\d{1,2})(?::(\d{2}))(?:\:(\d{2}))?\]/);
            if (!m) return -1;
            const h = m[3] ? parseInt(m[1], 10) : 0;
            const mm = m[3] ? parseInt(m[2], 10) : parseInt(m[1], 10);
            const ss = m[3] ? parseInt(m[3], 10) : parseInt(m[2], 10);
            return h * 3600 + mm * 60 + ss;
          };
          Array.from(existing)
            .sort((a, b) => getTimeSecFromEl(a) - getTimeSecFromEl(b))
            .forEach(captureFromNode);
        }
      }, 1000);
  /* debug removed */
    }
  };

  const stopObserver = () => {
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }
    if (retryTimerRef.current) {
      window.clearInterval(retryTimerRef.current);
      retryTimerRef.current = null;
    }
  };

  useEffect(() => {
    // load state
    chrome.storage.sync.get([
      STORAGE_KEYS.enabled,
      STORAGE_KEYS.items,
      STORAGE_KEYS.position,
      STORAGE_KEYS.lastTime,
      HAND_STORAGE_KEYS.counts,
      HAND_STORAGE_KEYS.position,
      HAND_STORAGE_KEYS.visible,
    ], (res) => {
      const isEnabled = res[STORAGE_KEYS.enabled] || false;
      const savedItems = res[STORAGE_KEYS.items] || [];
      const pos = res[STORAGE_KEYS.position] || defaultPosition;
      const storedLast = typeof res[STORAGE_KEYS.lastTime] === 'number' ? res[STORAGE_KEYS.lastTime] : -1;
      const savedHandCounts = res[HAND_STORAGE_KEYS.counts] || {};
      const savedHandPos = res[HAND_STORAGE_KEYS.position] || { left: "580px", top: "100px" };
      const savedHandVisible = !!res[HAND_STORAGE_KEYS.visible];
      // Compute latest time from saved items as fallback
      const extractLatestFromItems = (arr) => {
        const re = /\[(\d{1,2})(?::(\d{2}))(?:\:(\d{2}))?\]/;
        let max = -1;
        for (const it of arr) {
          const m = String(it).match(re);
          if (m) {
            const h = m[3] ? parseInt(m[1], 10) : 0;
            const mm = m[3] ? parseInt(m[2], 10) : parseInt(m[1], 10);
            const ss = m[3] ? parseInt(m[3], 10) : parseInt(m[2], 10);
            const sec = h * 3600 + mm * 60 + ss;
            if (sec > max) max = sec;
          }
        }
        return max;
      };
      const latestFromItems = extractLatestFromItems(savedItems);
      lastTimeRef.current = Math.max(storedLast, latestFromItems);
  setEnabled(isEnabled);
  setItems(savedItems);
  setPosition(pos);
  // Prime refs before creating any UI that reads them
  handCountsRef.current = savedHandCounts;
  setHandCounts(savedHandCounts);
      setHandPosition(savedHandPos);
      handPositionRef.current = savedHandPos; // ensure latest ref before creating UI
      setHandVisible(savedHandVisible);
      if (isEnabled) {
        createActionBox(savedItems, pos);
        startObserver();
        startViewObserver();
        createHandButton(savedHandVisible);
      }
    });

    return () => {
      stopObserver();
      removeActionBox();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleToggleChange = (e) => {
    const v = e.target.checked;
    setEnabled(v);
    chrome.storage.sync.set({ [STORAGE_KEYS.enabled]: v });
    if (v) {
      createActionBox(items, position);
      startObserver();
      startViewObserver();
      createHandButton(handVisible);
    } else {
      stopObserver();
      stopViewObserver();
      knownHandRef.current.clear();
      removeActionBox();
      removeHandBox();
      removeHandButton();
    }
  };

  return (
    <div className="setting-item">
      <label className="setting-toggle">
        <input type="checkbox" checked={enabled} onChange={handleToggleChange} />
        Track actions (Add/Set/Place/Reveal/Return)
      </label>
    </div>
  );
};

export default ActionTracker;
