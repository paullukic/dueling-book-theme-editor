console.log('[DuelingBook Theme Editor] Content script loaded on duelingbook.com');

// Create a simple UI panel
const panel = document.createElement('div');
panel.style.cssText = `
  position: fixed;
  top: 10px;
  right: 10px;
  background: white;
  border: 1px solid #ccc;
  padding: 10px;
  z-index: 9999;
  font-family: Arial, sans-serif;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
`;

panel.innerHTML = `
  <h3 style="margin: 0 0 10px 0;">DuelingBook Theme Editor</h3>
  <button id="yellow-bg">Yellow Background</button>
  <button id="white-bg">White Background</button>
  <button id="edit-html">Edit HTML</button>
`;

// Add event listeners
panel.querySelector('#yellow-bg').addEventListener('click', () => {
  document.body.style.backgroundColor = 'yellow';
});

panel.querySelector('#white-bg').addEventListener('click', () => {
  document.body.style.backgroundColor = 'white';
});

panel.querySelector('#edit-html').addEventListener('click', () => {
  const html = document.documentElement.outerHTML;
  const textarea = document.createElement('textarea');
  textarea.value = html;
  textarea.style.cssText = 'width: 100%; height: 200px; margin-top: 10px;';
  panel.appendChild(textarea);

  const saveBtn = document.createElement('button');
  saveBtn.textContent = 'Save Changes';
  saveBtn.style.cssText = 'margin-top: 5px;';
  saveBtn.addEventListener('click', () => {
    document.documentElement.innerHTML = textarea.value;
    textarea.remove();
    saveBtn.remove();
  });
  panel.appendChild(saveBtn);
});

// Inject the panel only on duelingbook.com
document.body.appendChild(panel);
