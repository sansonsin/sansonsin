document.addEventListener('DOMContentLoaded', () => {
  setupNumberGuess();
  setupRps();
  setupMemoryLights();
});

function setupNumberGuess() {
  const input = document.querySelector('#guess-input');
  const checkButton = document.querySelector('#guess-button');
  const resetButton = document.querySelector('#guess-reset');
  const status = document.querySelector('#guess-status');
  const count = document.querySelector('#guess-count');

  if (!input || !checkButton || !resetButton || !status || !count) {
    return;
  }

  let answer = randomNumber(1, 20);
  let tries = 0;

  const render = (message) => {
    status.textContent = message;
    count.textContent = `Tries: ${tries}`;
  };

  checkButton.addEventListener('click', () => {
    const value = Number(input.value);

    if (!Number.isInteger(value) || value < 1 || value > 20) {
      render('Enter a whole number from 1 to 20.');
      return;
    }

    tries += 1;

    if (value === answer) {
      render(`Correct. The answer was ${answer}.`);
      return;
    }

    render(value < answer ? 'Too low. Try a bigger number.' : 'Too high. Try a smaller number.');
  });

  resetButton.addEventListener('click', () => {
    answer = randomNumber(1, 20);
    tries = 0;
    input.value = '';
    render('New game started.');
  });

  render('Ready when you are.');
}

function setupRps() {
  const buttons = document.querySelectorAll('.rps-button');
  const status = document.querySelector('#rps-status');
  const score = document.querySelector('#rps-score');

  if (!buttons.length || !status || !score) {
    return;
  }

  const hands = ['rock', 'paper', 'scissors'];
  const winsAgainst = {
    rock: 'scissors',
    paper: 'rock',
    scissors: 'paper'
  };
  const totals = {
    win: 0,
    lose: 0,
    draw: 0
  };

  const render = (message) => {
    status.textContent = message;
    score.textContent = `Win ${totals.win} / Lose ${totals.lose} / Draw ${totals.draw}`;
  };

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      const player = button.getAttribute('data-hand');
      const cpu = hands[randomNumber(0, hands.length - 1)];

      if (player === cpu) {
        totals.draw += 1;
        render(`Draw. You both picked ${capitalize(cpu)}.`);
        return;
      }

      if (winsAgainst[player] === cpu) {
        totals.win += 1;
        render(`You win. ${capitalize(player)} beats ${capitalize(cpu)}.`);
        return;
      }

      totals.lose += 1;
      render(`You lose. ${capitalize(cpu)} beats ${capitalize(player)}.`);
    });
  });

  render('Choose Rock, Paper, or Scissors.');
}

function setupMemoryLights() {
  const board = document.querySelector('#memory-board');
  const startButton = document.querySelector('#memory-start');
  const status = document.querySelector('#memory-status');
  const score = document.querySelector('#memory-score');

  if (!board || !startButton || !status || !score) {
    return;
  }

  const totalCells = 8;
  const targetCount = 3;
  let activeTargets = [];
  let selected = [];
  let locked = true;
  let wins = 0;

  for (let index = 0; index < totalCells; index += 1) {
    const cell = document.createElement('button');
    cell.type = 'button';
    cell.className = 'memory-cell';
    cell.textContent = `${index + 1}`;
    cell.setAttribute('data-index', String(index));
    board.appendChild(cell);
  }

  const cells = Array.from(board.querySelectorAll('.memory-cell'));

  const renderScore = () => {
    score.textContent = `Cleared rounds: ${wins}`;
  };

  const resetBoard = () => {
    cells.forEach((cell) => {
      cell.classList.remove('is-active', 'is-correct');
    });
  };

  const beginRound = () => {
    resetBoard();
    selected = [];
    locked = true;
    activeTargets = shuffle([...Array(totalCells).keys()]).slice(0, targetCount);
    status.textContent = 'Memorize the glowing tiles.';

    activeTargets.forEach((index) => {
      cells[index].classList.add('is-active');
    });

    window.setTimeout(() => {
      cells.forEach((cell) => {
        cell.classList.remove('is-active');
      });
      locked = false;
      status.textContent = 'Now click the same 3 tiles.';
    }, 1200);
  };

  startButton.addEventListener('click', beginRound);

  cells.forEach((cell) => {
    cell.addEventListener('click', () => {
      if (locked) {
        return;
      }

      const index = Number(cell.getAttribute('data-index'));

      if (selected.includes(index)) {
        return;
      }

      selected.push(index);
      cell.classList.add('is-active');

      if (!activeTargets.includes(index)) {
        locked = true;
        status.textContent = 'Miss. Start a new round and try again.';
        return;
      }

      cell.classList.add('is-correct');

      if (selected.length === targetCount) {
        locked = true;
        wins += 1;
        renderScore();
        status.textContent = 'Perfect. You cleared the round.';
      }
    });
  });

  renderScore();
  status.textContent = 'Press Start Round to begin.';
}

function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function capitalize(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function shuffle(values) {
  const next = [...values];

  for (let index = next.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [next[index], next[swapIndex]] = [next[swapIndex], next[index]];
  }

  return next;
}
