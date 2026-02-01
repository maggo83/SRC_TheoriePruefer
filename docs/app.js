// Main application logic
let allQuestions = [];
let currentExam = null;
let currentQuestionIndex = 0;
let userProfile = null;
let feedbackTimeout = null;

// App state
const AppState = {
    START: 'start',
    EXAM: 'exam',
    FEEDBACK: 'feedback',
    RESULTS: 'results'
};

let currentState = AppState.START;

// Initialize app
document.addEventListener('DOMContentLoaded', async () => {
    await loadQuestions();
    userProfile = UserProfile.load();
    updateUserStats();
    setupEventListeners();
    showScreen(AppState.START);
});

// Load questions from JSON
async function loadQuestions() {
    try {
        const response = await fetch('questions_SRC.json');
        allQuestions = await response.json();
        console.log(`Loaded ${allQuestions.length} questions`);
    } catch (error) {
        console.error('Error loading questions:', error);
        alert('Fehler beim Laden der Fragen. Bitte stelle sicher, dass questions_SRC.json vorhanden ist.');
    }
}

// Setup event listeners
function setupEventListeners() {
    // Start screen buttons
    document.getElementById('startExamBtn').addEventListener('click', startExam);
    document.getElementById('viewStatsBtn').addEventListener('click', showStatsPopup);
    document.getElementById('resetStatsBtn').addEventListener('click', resetStats);
    
    // Stats popup
    document.getElementById('closeStatsBtn').addEventListener('click', hideStatsPopup);
    document.querySelector('.popup-overlay').addEventListener('click', hideStatsPopup);
    
    // Exam screen
    document.getElementById('nextQuestionBtn').addEventListener('click', () => {
        if (currentState === AppState.FEEDBACK) {
            nextQuestion();
        } else {
            submitAnswer();
        }
    });
    
    // Feedback screen
    document.getElementById('continueBtn').addEventListener('click', nextQuestion);
    
    // Results screen
    document.getElementById('newExamBtn').addEventListener('click', startExam);
    document.getElementById('backToStartBtn').addEventListener('click', () => showScreen(AppState.START));
}

// Screen management
function showScreen(state) {
    currentState = state;
    document.querySelectorAll('.screen').forEach(screen => screen.classList.remove('active'));
    
    switch(state) {
        case AppState.START:
            document.getElementById('startScreen').classList.add('active');
            updateUserStats();
            break;
        case AppState.EXAM:
            document.getElementById('examScreen').classList.add('active');
            break;
        case AppState.FEEDBACK:
            document.getElementById('feedbackScreen').classList.add('active');
            break;
        case AppState.RESULTS:
            document.getElementById('resultsScreen').classList.add('active');
            break;
    }
}

// Update user statistics display
function updateUserStats() {
    const statsDiv = document.querySelector('.user-stats');
    if (userProfile.totalExams === 0) {
        statsDiv.innerHTML = '<p>Noch keine Prüfungen absolviert</p>';
    } else {
        const passRate = userProfile.getPassRate();
        const lastDate = userProfile.lastExamDate ? 
            new Date(userProfile.lastExamDate).toLocaleDateString('de-DE') : 'Nie';
        
        statsDiv.innerHTML = `
            <p><strong>Absolvierte Prüfungen:</strong> ${userProfile.totalExams}</p>
            <p><strong>Bestanden:</strong> ${userProfile.totalPassed} (${passRate}%)</p>
            <p><strong>Nicht bestanden:</strong> ${userProfile.totalFailed}</p>
            <p><strong>Letzte Prüfung:</strong> ${lastDate}</p>
        `;
    }
}

// Start new exam
function startExam() {
    currentExam = selectQuestions(24);
    currentQuestionIndex = 0;
    showScreen(AppState.EXAM);
    displayQuestion();
}

// Select questions using weighted random selection
function selectQuestions(count) {
    const questions = [];
    const weights = [];
    
    // Calculate weights for all questions
    allQuestions.forEach(q => {
        weights.push(userProfile.getSelectionWeight(q.number));
    });
    
    // Select questions using weighted random selection
    const totalWeight = weights.reduce((sum, w) => sum + w, 0);
    const selectedIndices = new Set();
    
    while (selectedIndices.size < count) {
        let random = Math.random() * totalWeight;
        let sum = 0;
        
        for (let i = 0; i < allQuestions.length; i++) {
            if (selectedIndices.has(i)) continue;
            
            sum += weights[i];
            if (random <= sum) {
                selectedIndices.add(i);
                break;
            }
        }
    }
    
    // Create exam questions with shuffled answers
    selectedIndices.forEach(i => {
        const q = allQuestions[i];
        const examQ = {
            number: q.number,
            question: q.question,
            answers: shuffleAnswers(q.answers, q.correct_answer),
            correctAnswerIndex: null, // Will be set after shuffle
            selectedAnswerIndex: null,
            answeredCorrectly: false
        };
        
        // Find the correct answer index after shuffling
        examQ.correctAnswerIndex = examQ.answers.findIndex(a => a.isCorrect);
        questions.push(examQ);
    });
    
    return questions;
}

// Shuffle answers (correct answer is always at index 0 in original)
function shuffleAnswers(originalAnswers, correctIndex) {
    const answers = originalAnswers.map((text, idx) => ({
        text: text,
        isCorrect: idx === correctIndex
    }));
    
    // Fisher-Yates shuffle
    for (let i = answers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [answers[i], answers[j]] = [answers[j], answers[i]];
    }
    
    return answers;
}

// Display current question
function displayQuestion() {
    const question = currentExam[currentQuestionIndex];
    
    // Update progress bar
    const progress = ((currentQuestionIndex + 1) / currentExam.length) * 100;
    document.querySelector('.progress-fill').style.width = `${progress}%`;
    document.querySelector('.progress-text').textContent = `Frage ${currentQuestionIndex + 1} von ${currentExam.length}`;
    
    // Update question text
    document.getElementById('questionNumber').textContent = `Frage ${question.number}`;
    document.getElementById('questionText').textContent = question.question;
    
    // Display answers
    const answersContainer = document.getElementById('answersContainer');
    answersContainer.innerHTML = '';
    
    question.answers.forEach((answer, index) => {
        const answerDiv = document.createElement('div');
        answerDiv.className = 'answer-option';
        answerDiv.dataset.index = index;
        
        answerDiv.innerHTML = `
            <div class="answer-radio"></div>
            <div class="answer-text">${answer.text}</div>
        `;
        
        answerDiv.addEventListener('click', () => selectAnswer(index));
        answersContainer.appendChild(answerDiv);
    });
    
    // Update button
    const nextBtn = document.getElementById('nextQuestionBtn');
    nextBtn.textContent = 'Antwort bestätigen';
    nextBtn.disabled = true;
}

// Select answer
function selectAnswer(index) {
    // Remove previous selection
    document.querySelectorAll('.answer-option').forEach(opt => {
        opt.classList.remove('selected');
    });
    
    // Add selection to clicked answer
    const selectedOption = document.querySelector(`.answer-option[data-index="${index}"]`);
    selectedOption.classList.add('selected');
    
    // Update question
    currentExam[currentQuestionIndex].selectedAnswerIndex = index;
    
    // Enable next button
    document.getElementById('nextQuestionBtn').disabled = false;
}

// Submit answer
function submitAnswer() {
    const question = currentExam[currentQuestionIndex];
    
    if (question.selectedAnswerIndex === null) {
        return;
    }
    
    // Check if answer is correct
    question.answeredCorrectly = (question.selectedAnswerIndex === question.correctAnswerIndex);
    
    // Show feedback on exam screen
    const answersContainer = document.getElementById('answersContainer');
    const answerOptions = answersContainer.querySelectorAll('.answer-option');
    
    answerOptions.forEach((opt, index) => {
        opt.style.pointerEvents = 'none'; // Disable clicking
        
        if (index === question.correctAnswerIndex) {
            opt.classList.add('correct');
            opt.querySelector('.answer-radio').style.display = 'none';
            const icon = document.createElement('div');
            icon.className = 'answer-icon correct';
            icon.textContent = '✓';
            opt.insertBefore(icon, opt.firstChild);
        } else if (index === question.selectedAnswerIndex) {
            opt.classList.add('wrong');
            opt.querySelector('.answer-radio').style.display = 'none';
            const icon = document.createElement('div');
            icon.className = 'answer-icon wrong';
            icon.textContent = '✗';
            opt.insertBefore(icon, opt.firstChild);
        }
    });
    
    // Update button
    const nextBtn = document.getElementById('nextQuestionBtn');
    
    if (question.answeredCorrectly) {
        // Auto-continue after 0.5 seconds for correct answers
        nextBtn.textContent = 'Weiter...';
        nextBtn.disabled = true;
        
        if (feedbackTimeout) clearTimeout(feedbackTimeout);
        feedbackTimeout = setTimeout(() => {
            nextQuestion();
        }, 500);
    } else {
        // Show button for wrong answers
        nextBtn.textContent = 'Weiter';
        nextBtn.disabled = false;
        currentState = AppState.FEEDBACK;
    }
}

// Next question or finish exam
function nextQuestion() {
    if (feedbackTimeout) {
        clearTimeout(feedbackTimeout);
        feedbackTimeout = null;
    }
    
    currentQuestionIndex++;
    
    if (currentQuestionIndex < currentExam.length) {
        displayQuestion();
        currentState = AppState.EXAM;
    } else {
        finishExam();
    }
}

// Finish exam and show results
function finishExam() {
    const correctCount = currentExam.filter(q => q.answeredCorrectly).length;
    const totalCount = currentExam.length;
    const passed = correctCount >= 19;
    const percentage = (correctCount / totalCount * 100).toFixed(1);
    
    // Record results in profile
    userProfile.recordExamResult(currentExam, passed);
    
    // Display results
    const resultsBox = document.querySelector('.results-box');
    const statusDiv = resultsBox.querySelector('.result-status');
    const scoreDiv = resultsBox.querySelector('.result-score');
    const percentageDiv = resultsBox.querySelector('.result-percentage');
    
    statusDiv.textContent = passed ? '✓ Bestanden!' : '✗ Nicht bestanden';
    statusDiv.className = `result-status ${passed ? 'passed' : 'failed'}`;
    
    scoreDiv.textContent = `${correctCount} von ${totalCount} Fragen richtig`;
    percentageDiv.textContent = `${percentage}%`;
    
    showScreen(AppState.RESULTS);
}

// Stats popup
function showStatsPopup() {
    const statsContent = document.querySelector('.stats-content');
    
    if (userProfile.totalExams === 0) {
        statsContent.innerHTML = '<p>Noch keine Statistiken vorhanden. Absolviere deine erste Prüfung!</p>';
    } else {
        const passRate = userProfile.getPassRate();
        const totalQuestions = Object.keys(userProfile.questionStats).length;
        const neverAsked = allQuestions.length - totalQuestions;
        
        let difficultQuestions = [];
        for (const [num, stats] of Object.entries(userProfile.questionStats)) {
            if (stats.times_asked > 0) {
                const successRate = stats.getSuccessRate();
                if (successRate < 0.6) {
                    difficultQuestions.push({ num: parseInt(num), rate: successRate, wrong: stats.times_wrong });
                }
            }
        }
        difficultQuestions.sort((a, b) => a.rate - b.rate);
        difficultQuestions = difficultQuestions.slice(0, 10);
        
        let html = `
            <p><strong>Gesamtstatistik:</strong></p>
            <p>📊 Absolvierte Prüfungen: ${userProfile.totalExams}</p>
            <p>✅ Bestanden: ${userProfile.totalPassed} (${passRate}%)</p>
            <p>❌ Nicht bestanden: ${userProfile.totalFailed}</p>
            <p>📝 Verschiedene Fragen beantwortet: ${totalQuestions} von ${allQuestions.length}</p>
            <p>🆕 Noch nie gefragt: ${neverAsked}</p>
        `;
        
        if (difficultQuestions.length > 0) {
            html += '<p style="margin-top: 20px;"><strong>Schwierigste Fragen:</strong></p><ul>';
            difficultQuestions.forEach(q => {
                const rate = (q.rate * 100).toFixed(0);
                html += `<li>Frage ${q.num}: ${rate}% richtig (${q.wrong}× falsch)</li>`;
            });
            html += '</ul>';
        }
        
        statsContent.innerHTML = html;
    }
    
    document.getElementById('statsPopup').classList.add('active');
}

function hideStatsPopup() {
    document.getElementById('statsPopup').classList.remove('active');
}

// Reset statistics
function resetStats() {
    if (confirm('Möchtest du wirklich alle Statistiken zurücksetzen? Diese Aktion kann nicht rückgängig gemacht werden.')) {
        userProfile.reset();
        updateUserStats();
        alert('Statistiken wurden zurückgesetzt.');
    }
}

// Service Worker registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('service-worker.js')
            .then(reg => console.log('Service Worker registered'))
            .catch(err => console.log('Service Worker registration failed:', err));
    });
}
