const TOTAL_TILES = 100;

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
function createElement({ tag, classList }) {
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
    }
    if (CHUTES[i]) {
      this.el.classList.add('chute');
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
    this.players = [0, 0, 0, 0];
    this.currentPlayerIdx = -1;
    this.tiles = this.buildTiles();

    this.spinResult = document.getElementById('spin-result');
    this.spinnerButton = document.getElementById('spin');
    this.spinnerButton.addEventListener('click', this.takeTurn);
  }

  buildTiles = () => {
    const tiles = [];
    for (let i = TOTAL_TILES; i > 0; i--) {
      const tile = new Tile(i);
      tiles.push(tile);
      this.board.appendChild(tile.el);
    }
    return tiles;
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

  isChuteOrLadder = () => {
    const chute = CHUTES[this.players[this.currentPlayerIdx]];
    const ladder = LADDERS[this.players[this.currentPlayerIdx]];

    if (chute) {
      this.players[this.currentPlayerIdx] = chute;
    }
    if (ladder) {
      this.players[this.currentPlayerIdx] = ladder;
    }
  };

  takeTurn = () => {
    if (this.gameOver) {
      alert(`game over, player ${this.currentPlayerIdx + 1} wins!`);
    } else {
      this.currentPlayerIdx = (this.currentPlayerIdx + 1) % this.players.length;
      const spinValue = spinSpinner();
      this.spinResult.textContent = spinValue;
      this.updateTile(); // deactivate current square
      this.players[this.currentPlayerIdx] += spinValue;
      this.isChuteOrLadder();
      this.updateTile(); // activate new squares
    }
  };
}

const game = new Game();

let turnInterval;
turnInterval = setInterval(() => {
  if (!game.gameOver) {
    game.takeTurn();
  } else {
    clearInterval(turnInterval);
    game.takeTurn(); // shows gameover
  }
}, 100);
