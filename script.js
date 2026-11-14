
const gameArea = document.getElementById("gameArea");
const target = document.getElementById("target");
const spawnZone = document.getElementById("spawnZone");

const difficultySelect = document.getElementById("difficulty");
const colorSelect = document.getElementById("color");

const startBtn = document.getElementById("startBtn");
const resetBtn = document.getElementById("resetBtn");

const scoreDisplay = document.getElementById("score");
const bestScoreDisplay = document.getElementById("bestScore");
const clicksDisplay = document.getElementById("clicks");
const timerDisplay = document.getElementById("timer");
const statusDisplay = document.getElementById("status");

const difficulties = {
    easy: {
        size: 90,
        points: 1,
        area: 50,
        time: 5
    },
    medium: {
        size: 55,
        points: 2,
        area: 75,
        time: 3
    },
    hard: {
        size: 30,
        points: 3,
        area: 100,
        time: 2
    }
};

const colors = {
    red: "#ef4444",
    green: "#22c55e",
    blue: "#3b82f6"
};

let score = 0;
let clicks = 0;
let bestScore = 0;
let timeLeft = 5;

let gameRunning = false;
let timerInterval = null;

function updateBestScore() {
    const key = "clickerBest_" + difficultySelect.value;

    bestScore = Number(localStorage.getItem(key)) || 0;
    bestScoreDisplay.textContent = bestScore;
}

function updateSettings() {
    const difficulty = difficulties[difficultySelect.value];

    target.style.width = difficulty.size + "px";
    target.style.height = difficulty.size + "px";

    const zoneSize = Math.sqrt(difficulty.area / 100) * 100;

    spawnZone.style.width = zoneSize + "%";
    spawnZone.style.height = zoneSize + "%";

    target.style.background = colors[colorSelect.value];

    if (!gameRunning) {
        timeLeft = difficulty.time;
        timerDisplay.textContent = timeLeft;
    }

    updateBestScore();
}

function moveTarget() {
    const areaRect = gameArea.getBoundingClientRect();
    const zoneRect = spawnZone.getBoundingClientRect();

    const size = target.offsetWidth;

    const minX = zoneRect.left - areaRect.left;
    const minY = zoneRect.top - areaRect.top;

    const maxX = zoneRect.right - areaRect.left - size;
    const maxY = zoneRect.bottom - areaRect.top - size;

    const randomX = minX + Math.random() * (maxX - minX);
    const randomY = minY + Math.random() * (maxY - minY);

    target.style.left = randomX + "px";
    target.style.top = randomY + "px";
}

function startTimer() {
    clearInterval(timerInterval);

    timeLeft = difficulties[difficultySelect.value].time;
    timerDisplay.textContent = timeLeft;

    timerInterval = setInterval(() => {
        timeLeft--;

        timerDisplay.textContent = timeLeft;

        if (timeLeft <= 0) {
            endGame();
        }
    }, 1000);
}

function startGame() {
    clearInterval(timerInterval);

    score = 0;
    clicks = 0;
    gameRunning = true;

    scoreDisplay.textContent = score;
    clicksDisplay.textContent = clicks;

    difficultySelect.disabled = true;
    colorSelect.disabled = true;

    startBtn.disabled = true;

    statusDisplay.textContent = "Гра триває! Натискай на фігуру.";

    updateSettings();

    target.style.display = "block";

    moveTarget();
    startTimer();
}

function clickTarget() {
    if (!gameRunning) return;

    const difficulty = difficulties[difficultySelect.value];

    score += difficulty.points;
    clicks++;

    scoreDisplay.textContent = score;
    clicksDisplay.textContent = clicks;

    const key = "clickerBest_" + difficultySelect.value;

    if (score > bestScore) {
        bestScore = score;

        localStorage.setItem(key, bestScore);
        bestScoreDisplay.textContent = bestScore;
    }

    moveTarget();

    // Перезапуск таймера після натискання
    startTimer();
}

function endGame() {
    clearInterval(timerInterval);

    gameRunning = false;

    target.style.display = "none";

    difficultySelect.disabled = false;
    colorSelect.disabled = false;

    startBtn.disabled = false;
    startBtn.textContent = "Грати знову";

    timerDisplay.textContent = "0";

    statusDisplay.textContent =
        "Час вичерпано! Ваш результат: " + score + " очок.";

    updateSettings();
}

function resetGame() {
    clearInterval(timerInterval);

    gameRunning = false;

    score = 0;
    clicks = 0;

    scoreDisplay.textContent = 0;
    clicksDisplay.textContent = 0;

    target.style.display = "none";

    difficultySelect.disabled = false;
    colorSelect.disabled = false;

    startBtn.disabled = false;
    startBtn.textContent = "Почати гру";

    statusDisplay.textContent = "Натисни «Почати гру»";

    updateSettings();
}

startBtn.addEventListener("click", startGame);

target.addEventListener("click", clickTarget);

resetBtn.addEventListener("click", resetGame);

difficultySelect.addEventListener("change", updateSettings);

colorSelect.addEventListener("change", updateSettings);

updateSettings();
