import React, { useState, useEffect } from "react";

const highlightCSS = `
.highlight-red {
  color: #f09f9fff !important;
  display: inline !important;
}
.highlight-green {
  color: #82d485ff !important;
  display: inline !important;
}
.highlight-orange {
  color: #f0c29fff !important;
  display: inline !important;
}
.highlight-purple {
  color: #d685f0ff !important;
  display: inline !important;
}
.highlight-strong-red {
  color: #ff5050ff !important;
  display: inline !important;
}
.highlight-rose {
  color: #f0a0f0ff !important;
  display: inline !important;
}
`;

function highlightText(keywords, className) {
  const root = document.querySelector("#preview_txt");
  if (!root) return;
  const walker = document.createTreeWalker(
    root,
    NodeFilter.SHOW_TEXT,
    null,
    false
  );
  const nodes = [];
  let node;
  const regex = new RegExp("\\b(" + keywords.join("|") + ")\\b", "gi");
  while ((node = walker.nextNode())) {
    if (node.textContent.match(regex)) {
      nodes.push(node);
    }
  }
  nodes.forEach((textNode) => {
    const parent = textNode.parentNode;
    const text = textNode.textContent;
    let match;
    let lastIndex = 0;
    const fragment = document.createDocumentFragment();
    regex.lastIndex = 0; // reset
    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        fragment.appendChild(
          document.createTextNode(text.slice(lastIndex, match.index))
        );
      }
      const span = document.createElement("span");
      span.className = className;
      span.textContent = match[0];
      fragment.appendChild(span);
      lastIndex = regex.lastIndex;
    }
    if (lastIndex < text.length) {
      fragment.appendChild(document.createTextNode(text.slice(lastIndex)));
    }
    parent.replaceChild(fragment, textNode);
  });
}

function unhighlightText(className) {
  const root = document.querySelector("#preview_txt");
  if (!root) return;
  const spans = root.querySelectorAll(`.${className}`);
  spans.forEach((span) => {
    span.parentNode.replaceChild(
      document.createTextNode(span.textContent),
      span
    );
  });
}

function highlightSentences(sentenceKeywords, className) {
  const root = document.querySelector("#preview_txt");
  if (!root) return;
  // Get all text nodes
  const textNodes = [];
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null, false);
  let node;
  while ((node = walker.nextNode())) {
    textNodes.push(node);
  }
  // Get full text
  const fullText = textNodes.map(n => n.textContent).join('');
  // Find sentences
  const sentenceRegex = /([^.;:]*[.;:])/g;
  let match;
  const sentences = [];
  while ((match = sentenceRegex.exec(fullText)) !== null) {
    const sentence = match[1];
    const highlight = sentenceKeywords.some(keyword => sentence.toLowerCase().includes(keyword.toLowerCase()));
    if (highlight) {
      const trimmed = sentence.trim();
      const startTrim = sentence.indexOf(trimmed);
      const endTrim = startTrim + trimmed.length;
      const startPos = match.index + startTrim;
      const endPos = match.index + endTrim;
      sentences.push({ startPos, endPos, className });
    }
  }
  // Sort by startPos descending to process from end
  sentences.sort((a, b) => b.startPos - a.startPos);
  // Now, for each sentence, create range and surround
  for (const sent of sentences) {
    // Find start container and offset
    let cumulative = 0;
    let startContainer = null;
    let startOffset = 0;
    for (const textNode of textNodes) {
      const len = textNode.textContent.length;
      if (sent.startPos >= cumulative && sent.startPos < cumulative + len) {
        startContainer = textNode;
        startOffset = sent.startPos - cumulative;
        break;
      }
      cumulative += len;
    }
    // Find end
    let endContainer = null;
    let endOffset = 0;
    cumulative = 0;
    for (const textNode of textNodes) {
      const len = textNode.textContent.length;
      if (sent.endPos > cumulative && sent.endPos <= cumulative + len) {
        endContainer = textNode;
        endOffset = sent.endPos - cumulative;
        break;
      }
      cumulative += len;
    }
    if (startContainer && endContainer) {
      const range = document.createRange();
      range.setStart(startContainer, startOffset);
      range.setEnd(endContainer, endOffset);
      const span = document.createElement("span");
      span.className = className;
      try {
        range.surroundContents(span);
      } catch (e) {
        // If fails, perhaps the range is not valid
        console.error(e);
      }
    }
  }
}

function highlightFromTo(startChar, endChar, className) {
  const root = document.querySelector("#preview_txt");
  if (!root) return;
  // Get all text nodes
  const textNodes = [];
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null, false);
  let node;
  while ((node = walker.nextNode())) {
    textNodes.push(node);
  }
  // Get full text
  const fullText = textNodes.map(n => n.textContent).join('');
  // Find positions
  const sentences = [];
  let pos = 0;
  while ((pos = fullText.indexOf(startChar, pos)) !== -1) {
    const startPos = pos + 1; // after startChar
    const endPos = fullText.indexOf(endChar, startPos);
    if (endPos !== -1) {
      sentences.push({ startPos, endPos, className });
      pos = endPos + 1;
    } else {
      break;
    }
  }
  // Sort by startPos descending
  sentences.sort((a, b) => b.startPos - a.startPos);
  // Highlight
  for (const sent of sentences) {
    // Find start container and offset
    let cumulative = 0;
    let startContainer = null;
    let startOffset = 0;
    for (const textNode of textNodes) {
      const len = textNode.textContent.length;
      if (sent.startPos >= cumulative && sent.startPos < cumulative + len) {
        startContainer = textNode;
        startOffset = sent.startPos - cumulative;
        break;
      }
      cumulative += len;
    }
    // Find end
    let endContainer = null;
    let endOffset = 0;
    cumulative = 0;
    for (const textNode of textNodes) {
      const len = textNode.textContent.length;
      if (sent.endPos > cumulative && sent.endPos <= cumulative + len) {
        endContainer = textNode;
        endOffset = sent.endPos - cumulative;
        break;
      }
      cumulative += len;
    }
    if (startContainer && endContainer) {
      const range = document.createRange();
      range.setStart(startContainer, startOffset);
      range.setEnd(endContainer, endOffset);
      const span = document.createElement("span");
      span.className = className;
      try {
        range.surroundContents(span);
      } catch (e) {
        console.error(e);
      }
    }
  }
}

// Highlight text
// first sentences, then single words
function highlightTexts() {
  // highlightSentences(['Fusion', 'Synchro', 'Xyz', 'Link', 'Pendulum', 'special summon'], 'highlight-purple');
  // highlightFromTo(';', '.', 'highlight-green');
  highlightSentences([';'], 'highlight-red');
  highlightSentences(['draw 1 card', 'add it to your hand', 'You can add', 'Each time your opponent Special Summons', 'This card is always treated'], 'highlight-green');
  highlightSentences([':'], 'highlight-orange');
  highlightSentences(['You can only', 'the turn you activate this effect', 'Neither player can'], 'highlight-strong-red');
}

const applyTextHighlight = (enabled) => {
  let styleElement = document.getElementById("text-highlight-styles");
  if (enabled) {
    if (!styleElement) {
      styleElement = document.createElement("style");
      styleElement.id = "text-highlight-styles";
      styleElement.textContent = highlightCSS;
      document.head.appendChild(styleElement);
    }
  
    highlightTexts();
    // Set up observer
    const preview = document.querySelector("#preview_txt");
    if (preview && !window.textHighlightObserver) {
      const observer = new MutationObserver(() => {
        observer.disconnect();
        unhighlightText("highlight-red");
        unhighlightText("highlight-green");
        unhighlightText("highlight-sentence");
        highlightTexts();
        observer.observe(preview, { childList: true, subtree: true });
      });
      observer.observe(preview, { childList: true, subtree: true });
      window.textHighlightObserver = observer;
    }
  } else {
    if (styleElement) {
      styleElement.remove();
    }
    // Unhighlight text
    unhighlightText("highlight-red");
    unhighlightText("highlight-green");
    unhighlightText("highlight-sentence");
    // Disconnect observer
    if (window.textHighlightObserver) {
      window.textHighlightObserver.disconnect();
      delete window.textHighlightObserver;
    }
  }
};

const TextHighlight = () => {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    chrome.storage.sync.get(["textHighlightEnabled"], (result) => {
      const isEnabled = result.textHighlightEnabled || false;
      setEnabled(isEnabled);
      applyTextHighlight(isEnabled);
    });
  }, []);

  const handleChange = (e) => {
    const newValue = e.target.checked;
    setEnabled(newValue);
    chrome.storage.sync.set({ textHighlightEnabled: newValue });
    applyTextHighlight(newValue);
  };

  return (
    <div className="setting-item">
      <label className="setting-toggle">
        <input type="checkbox" checked={enabled} onChange={handleChange} />
        Highlight Card Keywords
      </label>
    </div>
  );
};

export default TextHighlight;
