class ThemeManager {
  constructor() {
    this.preferences = this.loadPreferences();
    this.applyTheme();
  }

  loadPreferences() {
    const saved = localStorage.getItem('theme_preferences');
    return saved ? JSON.parse(saved) : {darkMode: false, fontSize: 16, theme: 'blue', language: 'id'};
  }

  savePreferences() {
    localStorage.setItem('theme_preferences', JSON.stringify(this.preferences));
  }

  setDarkMode(enabled) {
    this.preferences.darkMode = enabled;
    this.applyTheme();
    this.savePreferences();
  }

  setFontSize(size) {
    this.preferences.fontSize = Math.max(12, Math.min(22, size));
    this.applyTheme();
    this.savePreferences();
  }

  setTheme(theme) {
    this.preferences.theme = theme;
    this.applyTheme();
    this.savePreferences();
  }

  applyTheme() {
    const root = document.documentElement;
    root.style.fontSize = this.preferences.fontSize + 'px';
    if (this.preferences.darkMode) document.body.classList.add('dark-mode');
    else document.body.classList.remove('dark-mode');
    const themes = {blue: {p: '#667eea', s: '#764ba2'}, purple: {p: '#9b59b6', s: '#8e44ad'}, green: {p: '#27ae60', s: '#2ecc71'}, orange: {p: '#e67e22', s: '#d35400'}, pink: {p: '#e91e63', s: '#c2185b'}};
    const t = themes[this.preferences.theme] || themes.blue;
    root.style.setProperty('--primary', t.p);
    root.style.setProperty('--secondary', t.s);
  }
}
window.ThemeManager = new ThemeManager();