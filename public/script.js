const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

let bird = {
  x: 50,
  y: 250,
  size: 20,
  velocity: 0,
  gravity: 0.4,
  lift: -6
};

let pipes = [];
let frame = 0;
let score = 0;
let gameOver = false;

function resetGame() {
  bird.y = 250;
  bird.velocity = 0;
  pipes = [];
  frame = 0;
  score = 0;
  gameOver = false;
}

function spawnPipe() {
  let gap = 120;
  let top = Math.random() * 250 + 50;

  pipes.push({
    x: 300,
    top: top,
    bottom: top + gap,
    width: 40
  });
}

function update() {
  if (gameOver) return;

  bird.velocity += bird.gravity;
  bird.y += bird.velocity;

  if (frame % 90 === 0) spawnPipe();
  frame++;

  pipes.forEach(pipe => {
    pipe.x -= 2;

    if (pipe.x + pipe.width < bird.x && !pipe.passed) {
      score++;
      pipe.passed = true;
    }

    if (
      bird.x < pipe.x + pipe.width &&
      bird.x + bird.size > pipe.x &&
      (bird.y < pipe.top || bird.y + bird.size > pipe.bottom)
    ) {
      gameOver = true;
    }
  });

  if (bird.y + bird.size > canvas.height || bird.y < 0) {
    gameOver = true;
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "yellow";
  ctx.fillRect(bird.x, bird.y, bird.size, bird.size);

  ctx.fillStyle = "#5cc";
  pipes.forEach(pipe => {
    ctx.fillRect(pipe.x, 0, pipe.width, pipe.top);
    ctx.fillRect(pipe.x, pipe.bottom, pipe.width, canvas.height - pipe.bottom);
  });

  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.fillText("Score: " + score, 10, 25);

  if (gameOver) {
    ctx.fillStyle = "red";
    ctx.font = "30px Arial";
    ctx.fillText("GAME OVER", 60, 250);
    ctx.font = "18px Arial";
    ctx.fillText("Press SPACE to restart", 65, 280);
  }
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

document.addEventListener("keydown", e => {
  if (e.code === "Space") {
    if (gameOver) resetGame();
    bird.velocity = bird.lift;
  }
});

canvas.addEventListener("mousedown", () => {
  if (gameOver) resetGame();
  bird.velocity = bird.lift;
});

loop();
