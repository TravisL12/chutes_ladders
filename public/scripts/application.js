const TOTAL_TILES = 100;

const tiles = [
  [100, 99, 98, 97, 96, 95, 94, 93, 92, 91],
  [90, 89, 88, 87, 86, 85, 84, 83, 82, 81].reverse(),
  [80, 79, 78, 77, 76, 75, 74, 73, 72, 71],
  [70, 69, 68, 67, 66, 65, 64, 63, 62, 61].reverse(),
  [60, 59, 58, 57, 56, 55, 54, 53, 52, 51],
  [50, 49, 48, 47, 46, 45, 44, 43, 42, 41].reverse(),
  [40, 39, 38, 37, 36, 35, 34, 33, 32, 31],
  [30, 29, 28, 27, 26, 25, 24, 23, 22, 21].reverse(),
  [20, 19, 18, 17, 16, 15, 14, 13, 12, 11],
  [10, 9, 8, 7, 6, 5, 4, 3, 2, 1].reverse(),
];

const LADDERS = {
  1: 38,
  4: 14,
  9: 31,
  21: 42,
  36: 44,
  28: 84,
  51: 67,
  80: 100,
  71: 91,
};

const CHUTES = {
  98: 78,
  95: 75,
  93: 73,
  87: 24,
  64: 60,
  62: 19,
  56: 53,
  48: 26,
  49: 11,
  16: 6,
};

function spinSpinner() {
  return Math.floor(Math.random() * 6) + 1;
}
function createElement({ tag, classList } = {}) {
  const element = document.createElement(tag || 'div');
  element.classList = classList;
  return element;
}
class Tile {
  constructor(i) {
    this.el = createElement({ classList: 'tile' });
    this.el.innerHTML = `<div class="tile-number">${i}</div>`;
    this.playersEl = createElement({ classList: 'players' });
    this.el.appendChild(this.playersEl);
    this.players = [];
    this.id = i;
    this.el.id = `tile-${i}`;
    if (LADDERS[i]) {
      this.el.classList.add('ladder');
      this.el.classList.add('start');
    }
    if (Object.values(LADDERS).includes(i)) {
      this.el.classList.add('ladder');
      this.el.classList.add('end');
    }
    if (CHUTES[i]) {
      this.el.classList.add('chute');
      this.el.classList.add('start');
    }
    if (Object.values(CHUTES).includes(i)) {
      this.el.classList.add('chute');
      this.el.classList.add('end');
    }
  }

  updatePlayers = (playerNumber) => {
    const number = playerNumber;
    this.players[number] = !this.players[number];
    this.playersEl.innerHTML = this.players
      .map((hasPlayer, i) =>
        hasPlayer ? `<div class="player player-${i + 1}">${i + 1}</div>` : ''
      )
      .join('');
  };
}

class Game {
  constructor() {
    this.board = document.querySelector('.board');
    this.spinResult = document.getElementById('spin-result');
    this.history = document.querySelector('#history .log');
    this.spinnerButton = document.getElementById('spin');
    this.spinnerButton.addEventListener('click', this.takeTurn);
    this.reset();
  }

  reset = () => {
    this.currentPlayerIdx = -1;
    this.players = [0, 0, 0, 0];
    this.history.innerHTML = '';
    this.board.innerHTML = '';
    this.gameOver = false;
    this.movesCount = 0;
    winnerEl.textContent = '';
    this.tiles = this.buildTiles();
  };

  buildTiles = () => {
    return tiles.flat().map((i) => {
      const tile = new Tile(i);
      this.board.appendChild(tile.el);
      return tile;
    });
  };

  updateTile = () => {
    if (this.players[this.currentPlayerIdx] >= TOTAL_TILES) {
      this.tiles[0]?.updatePlayers(this.currentPlayerIdx);
      this.gameOver = true;
    } else {
      const tile = this.tiles.find(
        (t) => t.id === this.players[this.currentPlayerIdx]
      );
      tile?.updatePlayers(this.currentPlayerIdx);
    }
  };

  updateHistory = (spinValue, hitChuteLadder) => {
    this.movesCount++;
    const chuteLadderMsg = hitChuteLadder ? `${hitChuteLadder}` : 'Moved';

    const historyLog = createElement({ classList: 'log-item' });
    historyLog.innerHTML = `<span>${this.movesCount}. <span class="player-${
      this.currentPlayerIdx + 1
    }">Player ${
      this.currentPlayerIdx + 1
    }</span>: Spun ${spinValue}: ${chuteLadderMsg} to ${
      this.players[this.currentPlayerIdx] > 99
        ? 100
        : this.players[this.currentPlayerIdx]
    }</span>`;

    this.history.appendChild(historyLog);
    if (this.movesCount % 4 === 0) {
      const br = createElement({ tag: 'br' });
      this.history.appendChild(br);
    }
    this.history.scrollTo(0, this.history.scrollHeight);
  };

  toggleChuteLadder = (val, type) => {
    const tile = this.tiles.find((t) => t.id === val);
    tile.el.querySelector('.tile-number').classList.add(`select-${type}`);
    setTimeout(() => {
      tile.el.querySelector('.tile-number').classList.remove(`select-${type}`);
    }, 750);
  };

  isChuteOrLadder = () => {
    const chute = CHUTES[this.players[this.currentPlayerIdx]];
    const ladder = LADDERS[this.players[this.currentPlayerIdx]];

    if (chute) {
      this.toggleChuteLadder(chute, 'chute');
      this.toggleChuteLadder(this.players[this.currentPlayerIdx], 'chute');
      this.players[this.currentPlayerIdx] = chute;
      return 'Chute';
    }
    if (ladder) {
      this.toggleChuteLadder(ladder, 'ladder');
      this.toggleChuteLadder(this.players[this.currentPlayerIdx], 'ladder');
      this.players[this.currentPlayerIdx] = ladder;
      return 'Ladder';
    }
  };

  takeTurn = () => {
    if (this.gameOver) {
      winnerEl.innerHTML = `<span><span class="player-${
        this.currentPlayerIdx + 1
      }">Player ${this.currentPlayerIdx + 1}</span> Wins!</span>`;
    } else {
      this.currentPlayerIdx = (this.currentPlayerIdx + 1) % this.players.length;
      const spinValue = spinSpinner();
      this.spinResult.textContent = spinValue;
      this.updateTile(); // deactivate current square
      this.players[this.currentPlayerIdx] += spinValue;
      const hitChuteLadder = this.isChuteOrLadder();
      this.updateHistory(spinValue, hitChuteLadder);
      this.updateTile(); // activate new squares
    }
  };
}

let turnInterval;
const AUTO_PLAY_INTERVAL = 125;
const winnerEl = document.getElementById('winner');
const autoPlayBtn = document.getElementById('auto-play');
const reset = document.getElementById('reset');
const game = new Game();

const resetInterval = () => {
  clearInterval(turnInterval);
  turnInterval = null;
  autoPlayBtn.textContent = 'Start Autoplay';
};
reset.addEventListener('click', () => {
  resetInterval();
  game.reset();
});

autoPlayBtn.addEventListener('click', () => {
  if (turnInterval) {
    resetInterval();
  } else {
    autoPlayBtn.textContent = 'Stop Autoplay';
    turnInterval = setInterval(() => {
      if (!game.gameOver) {
        game.takeTurn();
      } else {
        clearInterval(turnInterval);
        game.takeTurn(); // shows gameover
      }
    }, AUTO_PLAY_INTERVAL);
  }
});
