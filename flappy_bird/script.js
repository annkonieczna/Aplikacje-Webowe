const BOARD_WIDTH = 288;
const BOARD_HEIGHT = 512;
const BIRD_W = 34;
const BIRD_H = 24;
const PIPE_W = 52;
const PIPE_H = 320;
const PIPE_INTERVAL = 1500;
const OPENING = BOARD_HEIGHT / 4 + 20;
const GRAVITY = 0.4;
const FLAP_V = -6;
const PIPE_SPEED = -2;
const MAX_TOP5 = 5;

const canvas = document.getElementById("board");
const ctx = canvas.getContext("2d");
canvas.width = BOARD_WIDTH;
canvas.height = BOARD_HEIGHT;

const welcomeOverlay = document.getElementById("welcome");
const startBtn = document.getElementById("startBtn");
const gameOverOverlay = document.getElementById("gameOver");
const retryBtn = document.getElementById("retryBtn");
const lastScoreElem = document.getElementById("lastScore");
const bestScoreElem = document.getElementById("bestScore");
const top5List = document.getElementById("top5");

const bgImg = new Image();
bgImg.src = "./assets/assets/FlappyBird/background-day.png";

const pipeTopImg = new Image();
pipeTopImg.src = "./assets/assets/FlappyBird/top_pipe.png";

const pipeBottomImg = new Image();
pipeBottomImg.src = "./assets/assets/FlappyBird/bottom_pipe.png";

const birdFrames = [
  "./assets/assets/FlappyBird/yellowbird-upflap.png",
  "./assets/assets/FlappyBird/yellowbird-midflap.png",
  "./assets/assets/FlappyBird/yellowbird-downflap.png",
].map((src) => {
  const i = new Image();
  i.src = src;
  return i;
});

const sfxFlap = new Audio("./assets/assets/SoundEffects/wing.wav");
const sfxHit = new Audio("./assets/assets/SoundEffects/hit.wav");
const sfxDie = new Audio("./assets/assets/SoundEffects/die.wav");
const sfxScore = new Audio("./assets/assets/SoundEffects/point.wav");
const bgMusic = new Audio("./assets/assets/SoundEffects/music.mp3");
bgMusic.loop = true;
bgMusic.volume = 0.4;
const numberImages = [];

// Wczytujemy obrazki od 0 do 9
for (let i = 0; i < 10; i++) {
  const img = new Image();
  img.src = `./assets/assets/UI/Numbers/${i}.png`;
  numberImages.push(img);
}

let bird = {
  x: BOARD_WIDTH / 8,
  y: BOARD_HEIGHT / 2,
  w: BIRD_W,
  h: BIRD_H,
  vy: 0,
  frameIndex: 0,
  frameTick: 0,
};

let pipes = [];
let score = 0;
let gameState = "welcome";
let pipeTimerId = null;
let animReq = null;

function loadTop5() {
  //to co w body try'a robi się jeśli mi nie wyrzuci errora
  try {
    const raw = localStorage.getItem("flappy_top5"); //szukamy tego po kluczu
    if (!raw) return []; //jeżeli będzie pusty
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : []; //sprawdzamy czy nasze arr jest arrayem, żemy nam się nie wywaliło w przypadku 0
  } catch {
    return [];
  }
}

function saveScore(s) {
  const arr = loadTop5();
  arr.push(s);
  arr.sort((a, b) => b - a); //sort malejąco
  const trimmed = arr.slice(0, MAX_TOP5);
  localStorage.setItem("flappy_top5", JSON.stringify(trimmed));
  return trimmed;
}

function updateTop5UI(arr) {
  top5List.innerHTML = "";
  arr.forEach((v) => {
    const li = document.createElement("li");
    li.innerText = v;
    top5List.appendChild(li);
  });
}

loadTop5();

function resetGame() {
  bird.x = BOARD_WIDTH / 8;
  bird.y = BOARD_HEIGHT / 2;
  bird.vy = 0;
  bird.frameIndex = 0;
  bird.frameTick = 0;
  pipes = [];
  score = 0;
  gameState = "playing";

  if (pipeTimerId) {
    clearInterval(pipeTimerId);
    pipeTimerId = null;
  }
}

function spawnPipePair() {
  const minY = -PIPE_H + 50;
  const maxY = -50;
  const randomY =  minY + Math.random() * (maxY - minY);

  const pair = {
    top: {
      img: pipeTopImg,
      x: BOARD_WIDTH,
      y: randomY,
      w: PIPE_W,
      h: PIPE_H,
    },
    bottom: {
      img: pipeBottomImg,
      x: BOARD_WIDTH,
      y: randomY + PIPE_H + OPENING,
      w: PIPE_W,
      h: PIPE_H,
    },
    scored: false,
  };
  pipes.push(pair);
}

function rectsCollide(a, b) {
  return (
    a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y
  );
}

function drawBackground() {
  ctx.drawImage(bgImg, 0, 0, BOARD_WIDTH, BOARD_HEIGHT);
}

function drawPipes() {
  pipes.forEach((p) => {
    ctx.drawImage(p.top.img, p.top.x, p.top.y, PIPE_W, PIPE_H);
    ctx.drawImage(p.bottom.img, p.bottom.x, p.bottom.y, PIPE_W, PIPE_H);
  });
}

function drawBird() {
  bird.frameTick++;
  if (bird.frameTick > 6) {
    //co 6 klatek przełączamy animację ptaszka
    bird.frameIndex = (bird.frameIndex + 1) % birdFrames.length;
    bird.frameTick = 0;
  }

  const img = birdFrames[bird.frameIndex];
  const tilt = Math.max(-0.6, Math.min(bird.vy / 10, 0.8));

  ctx.save(); // zapisujemy byśmy mogli rysować na tym nowe fajne rzeczy :))
  const cx = bird.x + bird.w / 2;
  const cy = bird.y + bird.h / 2;
  ctx.translate(cx, cy);
  ctx.rotate(tilt);
  ctx.drawImage(img, -bird.w / 2, -bird.h / 2, bird.w, bird.h);
  ctx.restore();
}

function drawScore() {
  const imgWidth = 40;
  const imgHeight = 60;
  const spacing = 2;

  const scoreStr = Math.floor(score).toString();
  const totalWidth =
    scoreStr.length * imgWidth + (scoreStr.length - 1) * spacing;

  let startX = canvas.width / 2 - totalWidth / 2;
  const startY = 40;

  for (let i = 0; i < scoreStr.length; i++) {
    const digit = parseInt(scoreStr[i]);

    if (numberImages[digit].complete) {
      ctx.drawImage(numberImages[digit], startX, startY, imgWidth, imgHeight);
    }

    startX += imgWidth + spacing; // spacing pomiędzy cyferkami
  }
}

function gameLoop() {
  animReq = requestAnimationFrame(gameLoop);

  ctx.clearRect(0, 0, BOARD_WIDTH, BOARD_HEIGHT);
  drawBackground();
  drawPipes();
  drawBird();
  drawScore();

  if (gameState !== "playing") return;

  bird.vy += GRAVITY;
  bird.y += bird.vy;

  if (bird.y < 0) {
    bird.y = 0;
    bird.vy = 0;
  } // jeśli spadnie

  pipes.forEach((p) => {
    p.top.x += PIPE_SPEED;
    p.bottom.x += PIPE_SPEED;

    if (!p.scored && p.top.x + PIPE_W < bird.x) {
      score++;
      p.scored = true;
      sfxScore.currentTime = 0;
      sfxScore.play().catch(() => {});
    }

    const br = { x: bird.x, y: bird.y, w: bird.w, h: bird.h }; //prostokąt ptaka
    const tr = { x: p.top.x, y: p.top.y, w: p.top.w, h: p.top.h }; // prostokąt top pipe
    const br2 = { x: p.bottom.x, y: p.bottom.y, w: p.bottom.w, h: p.bottom.h }; //prostokąt top pipe

    if (rectsCollide(br, tr) || rectsCollide(br, br2)) {
      handleCollision();
    }
  });

  pipes = pipes.filter((p) => p.top.x > -PIPE_W);

  if (bird.y + bird.h >= BOARD_HEIGHT) {
    handleCollision(true);
  }
}

function handleCollision(ground = false) {
  if (gameState !== "playing") return;

  gameState = "dying";
  sfxHit.currentTime = 0;
  sfxHit.play().catch(() => {});

  if (pipeTimerId) {
    clearInterval(pipeTimerId);
    pipeTimerId = null;
  }

  if (!ground) bird.vy = 6;

  const fall = setInterval(() => {
    bird.vy += GRAVITY;
    bird.y += bird.vy;

    if (bird.y + bird.h >= BOARD_HEIGHT) {
      bird.y = BOARD_HEIGHT - bird.h;
      clearInterval(fall);
      sfxDie.currentTime = 0;
      sfxDie.play().catch(() => {});
      endGame();
      return;
    }

    ctx.clearRect(0, 0, BOARD_WIDTH, BOARD_HEIGHT);
    drawBackground();
    drawPipes();
    drawBird();
    drawScore();
  }, 1000 / 60);
}

function endGame() {
  gameState = "gameover";
  bgMusic.pause();
  bgMusic.currentTime = 0;

  const last = Math.floor(score);
  const newTop = saveScore(last);
  lastScoreElem.innerText = "Twój wynik: " + last;
  bestScoreElem.innerText = "Rekord: " + (newTop[0] || 0);
  updateTop5UI(newTop);
  console.log(newTop);
  // POKAZUJEMY gameOverOverlay
  gameOverOverlay.style.display = "flex";
  console.log("Game Over overlay should be visible now");
}

function flap() {
  if (gameState === "welcome") {
    startGame();
    return;
  }
  if (gameState === "playing") {
    bird.vy = FLAP_V;
    sfxFlap.currentTime = 0;
    sfxFlap.play().catch(() => {});
  }
}

function startGame() {
  resetGame();
  welcomeOverlay.style.display = "none";
  gameOverOverlay.style.display = "none";
  gameState = "playing";

  bgMusic.currentTime = 0;
  bgMusic.play().catch(() => {});

  if (pipeTimerId) clearInterval(pipeTimerId);
  pipeTimerId = setInterval(spawnPipePair, PIPE_INTERVAL);
  spawnPipePair();

  if (animReq) {
    cancelAnimationFrame(animReq);
  }
  animReq = requestAnimationFrame(gameLoop);
}

startBtn.addEventListener("click", startGame);
retryBtn.addEventListener("click", startGame);

document.addEventListener("keydown", (e) => {
  if (e.code === "Space" || e.code === "ArrowUp") {
    e.preventDefault();
    if (gameState === "gameover") {
      startGame();
    } else {
      flap();
    }
  }
});

// Event listener dla kliknięcia na canvas
canvas.addEventListener("click", (e) => {
  if (gameState === "gameover") {
    startGame();
  } else {
    flap();
  }
});

function initUI() {
  welcomeOverlay.style.display = "flex";
  gameOverOverlay.style.display = "none";
  updateTop5UI(loadTop5());
}

initUI();
