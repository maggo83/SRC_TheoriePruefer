// UserStats.js - Manages question statistics and weighted selection
class QuestionStats {
    constructor() {
        this.times_asked = 0;
        this.times_correct = 0;
        this.times_wrong = 0;
        this.attempts_since_last_wrong = 0;
    }

    recordAnswer(isCorrect) {
        this.times_asked++;
        if (isCorrect) {
            this.times_correct++;
            this.attempts_since_last_wrong++;
        } else {
            this.times_wrong++;
            this.attempts_since_last_wrong = 0;
        }
    }

    getSuccessRate() {
        if (this.times_asked === 0) return 0;
        return this.times_correct / this.times_asked;
    }
}

class UserProfile {
    constructor(profileName = 'default') {
        this.profileName = profileName;
        this.questionStats = {}; // key: questionNumber, value: QuestionStats
        this.totalExams = 0;
        this.totalPassed = 0;
        this.totalFailed = 0;
        this.lastExamDate = null;
    }

    getQuestionStats(questionNumber) {
        if (!this.questionStats[questionNumber]) {
            this.questionStats[questionNumber] = new QuestionStats();
        }
        return this.questionStats[questionNumber];
    }

    recordExamResult(examQuestions, passed) {
        this.totalExams++;
        if (passed) {
            this.totalPassed++;
        } else {
            this.totalFailed++;
        }
        this.lastExamDate = new Date().toISOString();
        
        // Record each question's result
        examQuestions.forEach(q => {
            const stats = this.getQuestionStats(q.number);
            stats.recordAnswer(q.answeredCorrectly);
        });
        
        this.save();
    }

    getSelectionWeight(questionNumber) {
        const stats = this.getQuestionStats(questionNumber);
        
        // Never asked questions get highest priority
        if (stats.times_asked === 0) {
            return 10.0;
        }

        let weight = 1.0;
        
        // Success rate factor (worse performance = higher weight)
        const successRate = stats.getSuccessRate();
        if (successRate < 0.5) {
            weight *= 2.0;
        } else if (successRate < 0.8) {
            weight *= 1.5;
        }
        
        // Recency factor (recent wrong answers = higher weight)
        if (stats.attempts_since_last_wrong === 0) {
            weight *= 3.0; // Just got it wrong
        } else if (stats.attempts_since_last_wrong < 3) {
            weight *= 2.0;
        } else if (stats.attempts_since_last_wrong < 5) {
            weight *= 1.5;
        }
        
        // Error count factor
        if (stats.times_wrong >= 5) {
            weight *= 1.5;
        } else if (stats.times_wrong >= 3) {
            weight *= 1.2;
        }
        
        // Ensure minimum weight
        return Math.max(weight, 0.1);
    }

    getPassRate() {
        if (this.totalExams === 0) return 0;
        return (this.totalPassed / this.totalExams * 100).toFixed(1);
    }

    save() {
        const data = {
            profileName: this.profileName,
            questionStats: {},
            totalExams: this.totalExams,
            totalPassed: this.totalPassed,
            totalFailed: this.totalFailed,
            lastExamDate: this.lastExamDate
        };
        
        // Convert QuestionStats objects to plain objects
        for (const [num, stats] of Object.entries(this.questionStats)) {
            data.questionStats[num] = {
                times_asked: stats.times_asked,
                times_correct: stats.times_correct,
                times_wrong: stats.times_wrong,
                attempts_since_last_wrong: stats.attempts_since_last_wrong
            };
        }
        
        localStorage.setItem(`profile_${this.profileName}`, JSON.stringify(data));
        localStorage.setItem('last_profile', this.profileName);
    }

    static load(profileName = null) {
        // Load last used profile if no name specified
        if (!profileName) {
            profileName = localStorage.getItem('last_profile') || 'default';
        }
        
        const dataStr = localStorage.getItem(`profile_${profileName}`);
        if (!dataStr) {
            return new UserProfile(profileName);
        }
        
        const data = JSON.parse(dataStr);
        const profile = new UserProfile(profileName);
        profile.totalExams = data.totalExams || 0;
        profile.totalPassed = data.totalPassed || 0;
        profile.totalFailed = data.totalFailed || 0;
        profile.lastExamDate = data.lastExamDate;
        
        // Reconstruct QuestionStats objects
        for (const [num, statsData] of Object.entries(data.questionStats || {})) {
            const stats = new QuestionStats();
            stats.times_asked = statsData.times_asked;
            stats.times_correct = statsData.times_correct;
            stats.times_wrong = statsData.times_wrong;
            stats.attempts_since_last_wrong = statsData.attempts_since_last_wrong;
            profile.questionStats[num] = stats;
        }
        
        return profile;
    }

    reset() {
        this.questionStats = {};
        this.totalExams = 0;
        this.totalPassed = 0;
        this.totalFailed = 0;
        this.lastExamDate = null;
        this.save();
    }

    static listProfiles() {
        const profiles = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith('profile_')) {
                profiles.push(key.substring(8)); // Remove 'profile_' prefix
            }
        }
        return profiles;
    }

    static deleteProfile(profileName) {
        localStorage.removeItem(`profile_${profileName}`);
        if (localStorage.getItem('last_profile') === profileName) {
            localStorage.removeItem('last_profile');
        }
    }
}

// Export for use in app.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { QuestionStats, UserProfile };
}
