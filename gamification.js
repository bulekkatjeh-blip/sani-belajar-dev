class Gamification {
  constructor() {
    this.stats = this.loadStats();
  }
  loadStats() {
    const saved = localStorage.getItem('gamification_stats');
    return saved ? JSON.parse(saved) : {points: 0, level: 1, streak: 0, lastPlay: null, totalAnswers: 0, correctAnswers: 0, badges: [], achievements: {first_answer: false, ten_correct: false, hundred_correct: false, streak_7: false, accuracy_90: false}, categoryStats: {pola_angka: {correct: 0, total: 0}, logika: {correct: 0, total: 0}, matematika: {correct: 0, total: 0}, umum: {correct: 0, total: 0}}};
  }
  saveStats() {
    localStorage.setItem('gamification_stats', JSON.stringify(this.stats));
  }
  recordAnswer(isCorrect, category) {
    this.stats.totalAnswers++;
    if (!this.stats.categoryStats[category]) this.stats.categoryStats[category] = {correct: 0, total: 0};
    this.stats.categoryStats[category].total++;
    if (isCorrect) {
      this.stats.correctAnswers++;
      this.stats.categoryStats[category].correct++;
      this.stats.streak++;
      this.stats.points += 10;
      this.updateLevel();
      this.checkBadges(category);
    } else this.stats.streak = 0;
    this.stats.lastPlay = new Date().toISOString();
    this.checkAchievements();
    this.saveStats();
  }
  updateLevel() {
    this.stats.level = Math.floor(this.stats.points / 500) + 1;
  }
  checkBadges(category) {
    const badges = {pola_angka: '🔢 Ahli Pola', logika: '🧩 Logika', matematika: '📐 Matematika', umum: '🌍 Umum'};
    const stats = this.stats.categoryStats[category];
    if (stats && stats.correct >= 50) {
      const badge = badges[category];
      if (!this.stats.badges.includes(badge)) this.stats.badges.push(badge);
    }
  }
  checkAchievements() {
    const acc = this.stats.totalAnswers > 0 ? (this.stats.correctAnswers / this.stats.totalAnswers) * 100 : 0;
    if (this.stats.totalAnswers === 1) this.stats.achievements.first_answer = true;
    if (this.stats.correctAnswers >= 10) this.stats.achievements.ten_correct = true;
    if (this.stats.correctAnswers >= 100) this.stats.achievements.hundred_correct = true;
    if (this.stats.streak >= 7) this.stats.achievements.streak_7 = true;
    if (acc >= 90) this.stats.achievements.accuracy_90 = true;
    this.saveStats();
  }
  getStats() { return this.stats; }
  getAccuracy() { return this.stats.totalAnswers > 0 ? ((this.stats.correctAnswers / this.stats.totalAnswers) * 100).toFixed(1) : 0; }
  getLevelProgress() { const p = (this.stats.level - 1) * 500; return Math.min(((this.stats.points - p) / 500) * 100, 100); }
}
window.Gamification = new Gamification();