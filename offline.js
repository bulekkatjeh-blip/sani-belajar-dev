// OFFLINE STORAGE & INDEXEDDB SYNC
class OfflineDB {
  constructor() {
    this.db = null;
    this.initDB();
  }

  initDB() {
    return new Promise((resolve, reject) => {
      const req = indexedDB.open('SaniBelajarDB', 1);
      req.onerror = () => reject(req.error);
      req.onsuccess = () => { this.db = req.result; resolve(this.db); };
      req.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains('progress')) {
          db.createObjectStore('progress', {keyPath: 'id', autoIncrement: true});
        }
      };
    });
  }

  autoBackup() {
    const backup = {
      gamification: localStorage.getItem('gamification_stats'),
      analytics: localStorage.getItem('analytics_history'),
      theme: localStorage.getItem('theme_preferences'),
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('backup_' + Date.now(), JSON.stringify(backup));
  }

  exportData() {
    return {
      gamification: localStorage.getItem('gamification_stats'),
      analytics: localStorage.getItem('analytics_history'),
      theme: localStorage.getItem('theme_preferences'),
      exportDate: new Date().toISOString()
    };
  }

  importData(backupData) {
    if (backupData.gamification) localStorage.setItem('gamification_stats', backupData.gamification);
    if (backupData.analytics) localStorage.setItem('analytics_history', backupData.analytics);
    if (backupData.theme) localStorage.setItem('theme_preferences', backupData.theme);
  }
}
window.OfflineDB = new OfflineDB();