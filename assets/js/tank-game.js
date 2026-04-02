document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.querySelector('#tank-canvas');
  const button = document.querySelector('#tank-start');
  const scoreText = document.querySelector('#tank-score');
  const statusText = document.querySelector('#tank-status');

  if (!canvas || !button || !scoreText || !statusText) {
    return;
  }

  const context = canvas.getContext('2d');
  const keys = new Set();
  let animationId = 0;
  let running = false;
  let lastTime = 0;
  let spawnTimer = 0;
  let cooldown = 0;
  let score = 0;
  let player;
  let bullets = [];
  let enemies = [];

  function resetGame() {
    player = { x: canvas.width / 2, y: canvas.height / 2, angle: 0, hp: 5, speed: 3.2 };
    bullets = [];
    enemies = [];
    score = 0;
    cooldown = 0;
    spawnTimer = 0;
    running = true;
    statusText.textContent = '敵をかわして撃ち返そう。';
    updateHud();
    cancelAnimationFrame(animationId);
    animationId = requestAnimationFrame(loop);
  }

  function updateHud() {
    scoreText.textContent = `Score: ${score} / HP: ${player.hp}`;
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
    movePlayer(step);
    cooldown = Math.max(0, cooldown - step);
    spawnTimer += step;

    if (spawnTimer > 40) {
      spawnEnemy();
      spawnTimer = 0;
    }

    bullets.forEach((bullet) => {
      bullet.x += Math.cos(bullet.angle) * bullet.speed * step;
      bullet.y += Math.sin(bullet.angle) * bullet.speed * step;
    });
    bullets = bullets.filter((bullet) =>
      bullet.x > -20 && bullet.x < canvas.width + 20 && bullet.y > -20 && bullet.y < canvas.height + 20
    );

    enemies.forEach((enemy) => {
      const angle = Math.atan2(player.y - enemy.y, player.x - enemy.x);
      enemy.angle = angle;
      enemy.x += Math.cos(angle) * enemy.speed * step;
      enemy.y += Math.sin(angle) * enemy.speed * step;

      if (distance(enemy, player) < 28) {
        enemy.hit = true;
        player.hp -= 1;
        if (player.hp <= 0) {
          gameOver('撃破されました。');
        }
      }
    });

    bullets.forEach((bullet) => {
      enemies.forEach((enemy) => {
        if (!enemy.hit && distance(bullet, enemy) < 24) {
          enemy.hit = true;
          bullet.hit = true;
          score += 100;
        }
      });
    });

    bullets = bullets.filter((bullet) => !bullet.hit);
    enemies = enemies.filter((enemy) => !enemy.hit);
    updateHud();
  }

  function movePlayer(step) {
    let moveX = 0;
    let moveY = 0;

    if (keys.has('ArrowUp')) {
      moveY -= 1;
      player.angle = -Math.PI / 2;
    }
    if (keys.has('ArrowDown')) {
      moveY += 1;
      player.angle = Math.PI / 2;
    }
    if (keys.has('ArrowLeft')) {
      moveX -= 1;
      player.angle = Math.PI;
    }
    if (keys.has('ArrowRight')) {
      moveX += 1;
      player.angle = 0;
    }

    const length = Math.hypot(moveX, moveY) || 1;
    player.x += (moveX / length) * player.speed * 3 * step;
    player.y += (moveY / length) * player.speed * 3 * step;
    player.x = Math.max(24, Math.min(canvas.width - 24, player.x));
    player.y = Math.max(24, Math.min(canvas.height - 24, player.y));
  }

  function fire() {
    if (!running || cooldown > 0) {
      return;
    }

    bullets.push({
      x: player.x + Math.cos(player.angle) * 20,
      y: player.y + Math.sin(player.angle) * 20,
      angle: player.angle,
      speed: 8
    });
    cooldown = 12;
  }

  function spawnEnemy() {
    const edge = Math.floor(Math.random() * 4);
    const positions = [
      { x: Math.random() * canvas.width, y: -30 },
      { x: canvas.width + 30, y: Math.random() * canvas.height },
      { x: Math.random() * canvas.width, y: canvas.height + 30 },
      { x: -30, y: Math.random() * canvas.height }
    ];
    const base = positions[edge];
    enemies.push({
      x: base.x,
      y: base.y,
      angle: 0,
      speed: 1 + Math.random() * 1.2
    });
  }

  function render() {
    context.fillStyle = '#0b1220';
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.strokeStyle = 'rgba(148, 163, 184, 0.18)';
    context.lineWidth = 1;
    for (let x = 0; x < canvas.width; x += 40) {
      context.beginPath();
      context.moveTo(x, 0);
      context.lineTo(x, canvas.height);
      context.stroke();
    }
    for (let y = 0; y < canvas.height; y += 40) {
      context.beginPath();
      context.moveTo(0, y);
      context.lineTo(canvas.width, y);
      context.stroke();
    }

    drawTank(player.x, player.y, player.angle, '#38bdf8');
    enemies.forEach((enemy) => drawTank(enemy.x, enemy.y, enemy.angle, '#f97316'));

    bullets.forEach((bullet) => {
      context.fillStyle = '#f8fafc';
      context.beginPath();
      context.arc(bullet.x, bullet.y, 4, 0, Math.PI * 2);
      context.fill();
    });
  }

  function drawTank(x, y, angle, color) {
    context.save();
    context.translate(x, y);
    context.rotate(angle);
    context.fillStyle = color;
    context.fillRect(-18, -14, 36, 28);
    context.fillStyle = '#0f172a';
    context.fillRect(-4, -5, 26, 10);
    context.fillStyle = '#e2e8f0';
    context.fillRect(-12, -20, 24, 6);
    context.restore();
  }

  function distance(a, b) {
    return Math.hypot(a.x - b.x, a.y - b.y);
  }

  function gameOver(message) {
    running = false;
    cancelAnimationFrame(animationId);
    statusText.textContent = `${message} スコア ${score}。リスタートで再戦できます。`;
  }

  button.addEventListener('click', resetGame);
  window.addEventListener('keydown', (event) => {
    if (event.code.startsWith('Arrow')) {
      keys.add(event.code);
      event.preventDefault();
    }
    if (event.code === 'Space') {
      event.preventDefault();
      fire();
    }
  });
  window.addEventListener('keyup', (event) => {
    if (event.code.startsWith('Arrow')) {
      keys.delete(event.code);
    }
  });
  canvas.addEventListener('pointerdown', fire);

  resetGame();
});
