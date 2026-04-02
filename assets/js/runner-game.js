document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.querySelector('#runner-canvas');
  const button = document.querySelector('#runner-start');
  const mobileRestart = document.querySelector('#runner-restart-mobile');
  const jumpButton = document.querySelector('#runner-jump');
  const scoreText = document.querySelector('#runner-score');
  const statusText = document.querySelector('#runner-status');

  if (!canvas || !button || !scoreText || !statusText) {
    return;
  }

  const context = canvas.getContext('2d');
  const gravity = 0.9;
  let animationId = 0;
  let lastTime = 0;
  let spawnTimer = 0;
  let coinTimer = 0;
  let running = false;
  let score = 0;
  let speed = 6;
  let obstacles = [];
  let coins = [];
  const keys = { jump: false };
  const player = {
    x: 120,
    y: 0,
    width: 42,
    height: 54,
    velocityY: 0,
    grounded: true
  };
  const groundY = canvas.height - 80;

  function resetGame() {
    score = 0;
    speed = 6;
    spawnTimer = 0;
    coinTimer = 0;
    obstacles = [];
    coins = [];
    player.y = groundY - player.height;
    player.velocityY = 0;
    player.grounded = true;
    running = true;
    lastTime = 0;
    statusText.textContent = 'ジャンプしてコースを駆け抜けよう。';
    updateScore();
    cancelAnimationFrame(animationId);
    animationId = requestAnimationFrame(loop);
  }

  function updateScore() {
    scoreText.textContent = `Score: ${score}`;
  }

  function jump() {
    if (!running || !player.grounded) {
      return;
    }

    player.velocityY = -16;
    player.grounded = false;
  }

  function spawnObstacle() {
    const tall = Math.random() > 0.55;
    obstacles.push({
      x: canvas.width + 60,
      y: tall ? groundY - 88 : groundY - 54,
      width: tall ? 34 : 48,
      height: tall ? 88 : 54
    });
  }

  function spawnCoin() {
    coins.push({
      x: canvas.width + 80,
      y: groundY - 120 - Math.random() * 90,
      radius: 14
    });
  }

  function loop(timestamp) {
    const delta = timestamp - lastTime || 16;
    lastTime = timestamp;
    const step = delta / 16.6667;

    update(step);
    render();

    if (running) {
      animationId = requestAnimationFrame(loop);
    }
  }

  function update(step) {
    score += Math.floor(step);
    speed += 0.0025 * step;
    spawnTimer += step;
    coinTimer += step;

    if (spawnTimer > 45 + Math.random() * 35) {
      spawnObstacle();
      spawnTimer = 0;
    }

    if (coinTimer > 70 + Math.random() * 40) {
      spawnCoin();
      coinTimer = 0;
    }

    player.velocityY += gravity * step;
    player.y += player.velocityY * step;

    if (player.y >= groundY - player.height) {
      player.y = groundY - player.height;
      player.velocityY = 0;
      player.grounded = true;
    }

    obstacles.forEach((obstacle) => {
      obstacle.x -= speed * step;
      if (intersects(player, obstacle)) {
        gameOver('障害物にぶつかりました。');
      }
    });
    obstacles = obstacles.filter((obstacle) => obstacle.x + obstacle.width > -40);

    coins.forEach((coin) => {
      coin.x -= speed * step;
      if (circleHitsPlayer(coin, player)) {
        score += 120;
        coin.collected = true;
      }
    });
    coins = coins.filter((coin) => !coin.collected && coin.x + coin.radius > -40);

    updateScore();
  }

  function render() {
    const sky = context.createLinearGradient(0, 0, 0, canvas.height);
    sky.addColorStop(0, '#38bdf8');
    sky.addColorStop(1, '#dbeafe');
    context.fillStyle = sky;
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.fillStyle = '#e0f2fe';
    for (let index = 0; index < 6; index += 1) {
      const x = ((index * 170) - (lastTime * 0.03)) % (canvas.width + 220);
      context.beginPath();
      context.arc(x, 80 + (index % 2) * 25, 28, 0, Math.PI * 2);
      context.arc(x + 28, 80 + (index % 2) * 25, 24, 0, Math.PI * 2);
      context.arc(x - 28, 84 + (index % 2) * 25, 20, 0, Math.PI * 2);
      context.fill();
    }

    context.fillStyle = '#65a30d';
    context.fillRect(0, groundY, canvas.width, canvas.height - groundY);

    context.fillStyle = '#1d4ed8';
    context.fillRect(player.x, player.y, player.width, player.height);
    context.fillStyle = '#f8fafc';
    context.fillRect(player.x + 24, player.y + 12, 12, 12);

    context.fillStyle = '#7c2d12';
    obstacles.forEach((obstacle) => {
      context.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    });

    coins.forEach((coin) => {
      context.fillStyle = '#facc15';
      context.beginPath();
      context.arc(coin.x, coin.y, coin.radius, 0, Math.PI * 2);
      context.fill();
      context.strokeStyle = '#fef08a';
      context.lineWidth = 4;
      context.stroke();
    });
  }

  function gameOver(message) {
    running = false;
    cancelAnimationFrame(animationId);
    statusText.textContent = `${message} スコア ${score}。リスタートでもう一度遊べます。`;
  }

  function intersects(a, b) {
    return (
      a.x < b.x + b.width &&
      a.x + a.width > b.x &&
      a.y < b.y + b.height &&
      a.y + a.height > b.y
    );
  }

  function circleHitsPlayer(circle, target) {
    const closestX = Math.max(target.x, Math.min(circle.x, target.x + target.width));
    const closestY = Math.max(target.y, Math.min(circle.y, target.y + target.height));
    const dx = circle.x - closestX;
    const dy = circle.y - closestY;
    return dx * dx + dy * dy < circle.radius * circle.radius;
  }

  button.addEventListener('click', resetGame);
  mobileRestart?.addEventListener('click', resetGame);
  jumpButton?.addEventListener('click', jump);
  window.addEventListener('keydown', (event) => {
    if (event.code === 'Space' || event.code === 'ArrowUp') {
      event.preventDefault();
      jump();
    }
  });
  canvas.addEventListener('pointerdown', jump);

  player.y = groundY - player.height;
  resetGame();
});
