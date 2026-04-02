document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.querySelector('#pong-canvas');
  const button = document.querySelector('#pong-start');
  const scoreText = document.querySelector('#pong-score');
  const statusText = document.querySelector('#pong-status');

  if (!canvas || !button || !scoreText || !statusText) {
    return;
  }

  const context = canvas.getContext('2d');
  const keys = new Set();
  let animationId = 0;
  let running = false;
  let lastTime = 0;
  let playerScore = 0;
  let cpuScore = 0;
  let ball;
  let player;
  let cpu;

  function resetGame() {
    playerScore = 0;
    cpuScore = 0;
    player = { x: 26, y: canvas.height / 2 - 48, width: 14, height: 96, speed: 6 };
    cpu = { x: canvas.width - 40, y: canvas.height / 2 - 48, width: 14, height: 96, speed: 4.8 };
    resetBall(Math.random() > 0.5 ? 1 : -1);
    running = true;
    lastTime = 0;
    statusText.textContent = 'ラリー開始。5点先取で勝利です。';
    updateScore();
    cancelAnimationFrame(animationId);
    animationId = requestAnimationFrame(loop);
  }

  function updateScore() {
    scoreText.textContent = `Player ${playerScore} - ${cpuScore} CPU`;
  }

  function resetBall(direction) {
    ball = {
      x: canvas.width / 2,
      y: canvas.height / 2,
      radius: 10,
      speedX: 5 * direction,
      speedY: (Math.random() * 4 - 2) || 2
    };
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
    if (keys.has('ArrowUp')) {
      player.y -= player.speed * step;
    }
    if (keys.has('ArrowDown')) {
      player.y += player.speed * step;
    }
    player.y = Math.max(0, Math.min(canvas.height - player.height, player.y));

    const cpuCenter = cpu.y + cpu.height / 2;
    if (ball.y < cpuCenter - 10) {
      cpu.y -= cpu.speed * step;
    } else if (ball.y > cpuCenter + 10) {
      cpu.y += cpu.speed * step;
    }
    cpu.y = Math.max(0, Math.min(canvas.height - cpu.height, cpu.y));

    ball.x += ball.speedX * step;
    ball.y += ball.speedY * step;

    if (ball.y < ball.radius || ball.y > canvas.height - ball.radius) {
      ball.speedY *= -1;
    }

    if (hitsPaddle(ball, player) && ball.speedX < 0) {
      ball.speedX = Math.abs(ball.speedX) + 0.4;
      ball.speedY += (ball.y - (player.y + player.height / 2)) * 0.05;
    }

    if (hitsPaddle(ball, cpu) && ball.speedX > 0) {
      ball.speedX = -Math.abs(ball.speedX) - 0.4;
      ball.speedY += (ball.y - (cpu.y + cpu.height / 2)) * 0.05;
    }

    if (ball.x < -30) {
      cpuScore += 1;
      onPoint(-1);
    }

    if (ball.x > canvas.width + 30) {
      playerScore += 1;
      onPoint(1);
    }
  }

  function onPoint(direction) {
    updateScore();

    if (playerScore >= 5 || cpuScore >= 5) {
      running = false;
      cancelAnimationFrame(animationId);
      statusText.textContent =
        playerScore > cpuScore
          ? '勝利です。リスタートでもう一度挑戦できます。'
          : 'CPUの勝ちです。リスタートで再戦できます。';
      return;
    }

    resetBall(direction);
    statusText.textContent = playerScore > cpuScore ? 'いい流れです。次のサーブへ。' : 'まだ逆転できます。';
  }

  function render() {
    context.fillStyle = '#020617';
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.strokeStyle = 'rgba(226, 232, 240, 0.3)';
    context.setLineDash([12, 10]);
    context.beginPath();
    context.moveTo(canvas.width / 2, 0);
    context.lineTo(canvas.width / 2, canvas.height);
    context.stroke();
    context.setLineDash([]);

    context.fillStyle = '#38bdf8';
    context.fillRect(player.x, player.y, player.width, player.height);
    context.fillStyle = '#f97316';
    context.fillRect(cpu.x, cpu.y, cpu.width, cpu.height);
    context.fillStyle = '#f8fafc';
    context.beginPath();
    context.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    context.fill();
  }

  function hitsPaddle(currentBall, paddle) {
    return (
      currentBall.x - currentBall.radius < paddle.x + paddle.width &&
      currentBall.x + currentBall.radius > paddle.x &&
      currentBall.y - currentBall.radius < paddle.y + paddle.height &&
      currentBall.y + currentBall.radius > paddle.y
    );
  }

  button.addEventListener('click', resetGame);
  window.addEventListener('keydown', (event) => {
    if (event.code === 'ArrowUp' || event.code === 'ArrowDown') {
      keys.add(event.code);
      event.preventDefault();
    }
  });
  window.addEventListener('keyup', (event) => {
    if (event.code === 'ArrowUp' || event.code === 'ArrowDown') {
      keys.delete(event.code);
    }
  });

  resetGame();
});
