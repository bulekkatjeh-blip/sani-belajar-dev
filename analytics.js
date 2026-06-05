class Analytics {
  constructor() {
    this.history = this.loadHistory();
  }

  loadHistory() {
    const saved = localStorage.getItem('analytics_history');
    return saved ? JSON.parse(saved) : [];
  }

  saveHistory() {
    localStorage.setItem('analytics_history', JSON.stringify(this.history));
  }

  recordQuestion(question, category, isCorrect, timeSpent) {
    this.history.push({
      timestamp: new Date().toISOString(),
      question: question,
      category: category,
      isCorrect: isCorrect,
      timeSpent: timeSpent,
      date: new Date().toLocaleDateString('id-ID')
    });
    this.saveHistory();
  }

  getStats() {
    if (this.history.length === 0) return null;
    const stats = {totalQuestions: this.history.length, correctAnswers: 0, byCategory: {}, avgTime: 0};
    let totalTime = 0;
    this.history.forEach(r => {
      if (r.isCorrect) stats.correctAnswers++;
      totalTime += r.timeSpent;
      if (!stats.byCategory[r.category]) stats.byCategory[r.category] = {total: 0, correct: 0};
      stats.byCategory[r.category].total++;
      if (r.isCorrect) stats.byCategory[r.category].correct++;
    });
    Object.keys(stats.byCategory).forEach(c => {
      const acc = stats.byCategory[c];
      acc.accuracy = acc.total > 0 ? ((acc.correct / acc.total) * 100).toFixed(1) : 0;
    });
    stats.accuracy = ((stats.correctAnswers / stats.totalQuestions) * 100).toFixed(1);
    stats.avgTime = (totalTime / stats.totalQuestions).toFixed(1);
    return stats;
  }

  exportJSON() { return JSON.stringify({history: this.history, summary: this.getStats()}, null, 2); }
  exportCSV() { let csv = 'Tanggal,Kategori,Benar,Waktu\\n'; this.history.forEach(r => {csv += r.date + ',' + r.category + ',' + (r.isCorrect ? 'Ya' : 'Tidak') + ',' + r.timeSpent + '\\n';}); return csv; }
  downloadJSON() { const blob = new Blob([this.exportJSON()], {type: 'application/json'}); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'sani-stats-' + Date.now() + '.json'; a.click(); }
  downloadCSV() { const blob = new Blob([this.exportCSV()], {type: 'text/csv'}); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'sani-stats-' + Date.now() + '.csv'; a.click(); }
}
window.Analytics = new Analytics();