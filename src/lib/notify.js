// Gets the user's attention for alerts: a short chime, a flashing tab title,
// and (if allowed) a desktop notification. Each channel is optional.

let audioCtx = null;
let flashTimer = null;
let originalTitle = null;

export const playChime = () => {
  try {
    audioCtx = audioCtx || new AudioContext();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const now = audioCtx.currentTime;
    [880, 1318.5].forEach((freq, i) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      const t = now + i * 0.16;
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(0.18, t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.35);
      osc.connect(gain).connect(audioCtx.destination);
      osc.start(t);
      osc.stop(t + 0.4);
    });
  } catch (e) {
    // audio unavailable (no user gesture yet)
  }
};

const stopFlash = () => {
  if (!flashTimer) return;
  clearInterval(flashTimer);
  flashTimer = null;
  if (originalTitle != null) document.title = originalTitle;
  originalTitle = null;
};

const userIsHere = () => !document.hidden && document.hasFocus();

export const flashTitle = (text) => {
  if (userIsHere()) return;
  stopFlash();
  originalTitle = document.title;
  let on = false;
  flashTimer = setInterval(() => {
    on = !on;
    document.title = on ? text : originalTitle;
  }, 900);
  document.title = text;
};

window.addEventListener('focus', stopFlash);
document.addEventListener('visibilitychange', () => {
  if (userIsHere()) stopFlash();
});

export const desktopNotify = (title, body) => {
  if (typeof Notification === 'undefined' || Notification.permission !== 'granted') return;
  try {
    const n = new Notification(title, { body, tag: 'dbte-alert', renotify: true, silent: true });
    n.onclick = () => {
      window.focus();
      n.close();
    };
  } catch (e) {
    // notifications blocked
  }
};

export const requestDesktopPermission = async () => {
  if (typeof Notification === 'undefined') return 'unsupported';
  if (Notification.permission !== 'default') return Notification.permission;
  try {
    return await Notification.requestPermission();
  } catch (e) {
    return 'denied';
  }
};

export const alertUser = (settings, title, body) => {
  if (settings.alertOnlyWhenHidden && userIsHere()) return;
  if (settings.alertSound) playChime();
  if (settings.alertTitle) flashTitle(title);
  if (settings.alertDesktop) desktopNotify(title, body);
};
