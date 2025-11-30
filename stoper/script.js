let control = document.getElementById("control");
let screen = document.getElementById("screen");
let startButton = document.getElementById("start");
let stopButton = document.getElementById("stop");
let resetButton = document.getElementById("reset");

let elapsedTime = 0; // liczba sekund które mineły od startu zegara 
let timerInterval;
let timerRunning = false;

startButton.addEventListener("click", () => {
	control.classList.add("active");
	startTimer();
});

stopButton.addEventListener("click", () => {
	control.classList.remove("active");
	stopTimer();
});

resetButton.addEventListener("click", () => {
	resetTimer();
});

function startTimer() {
	if (!timerRunning) {
		timerInterval = setInterval(() => {
			elapsedTime++;
			updateScreen();
		}, 1000);
		timerRunning = true;
	}
}

function stopTimer() {
	clearInterval(timerInterval);
	timerRunning = false;
}

function resetTimer() {
	elapsedTime = 0;
	updateScreen();
}

function updateScreen() {
	let minutes = Math.floor(elapsedTime / 60);
	let seconds = elapsedTime % 60;
	if (minutes > 0) {
		screen.innerHTML = minutes + " min " + seconds + " s";
	} else {
		screen.innerHTML = seconds + " s";
	}
}