const ladders = {
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

const chutes = {
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

class Tile {
  constructor(i) {
    this.el = document.createElement('div');
    this.el.innerHTML = `
    <span>${i}</span>
      <div class="players"></div>
    `;
    this.el.classList = 'tile';
    this.players = [];
    this.playersEl = this.el.querySelector('.players');
    this.el.id = `tile-${i}`;
    if (ladders[i]) {
      this.el.classList.add('ladder');
    }
    if (chutes[i]) {
      this.el.classList.add('chute');
    }
  }

  updatePlayers = (playerNumber) => {
    const number = playerNumber;
    this.players[number] = !this.players[number];
    this.playersEl.innerHTML = this.players
      .map((hasPlayer, i) =>
        hasPlayer ? `<div class="player player-${i + 1}"></div>` : ''
      )
      .join('');
  };
}

class Game {
  constructor() {
    this.board = document.querySelector('.board');
    this.players = [0, 0, 0, 0];
    this.currentPlayerIdx = 0;
    this.tiles = this.buildTiles();

    this.spinResult = document.getElementById('spin-result');
    this.spinnerButton = document.getElementById('spin');
    this.spinnerButton.addEventListener('click', this.takeTurn);
  }

  buildTiles = (count = 100) => {
    const tiles = [];
    for (let i = count; i > 0; i--) {
      const tile = new Tile(i);
      tiles.push(tile);
      this.board.appendChild(tile.el);
    }
    return tiles;
  };

  updateTile = () => {
    if (this.players[this.currentPlayerIdx] >= 100) {
      alert(`game over, player ${this.currentPlayerIdx + 1} wins!`);
      this.tiles[100]?.updatePlayers(this.currentPlayerIdx);
      this.gameOver = true;
      return;
    }

    this.tiles[100 - this.players[this.currentPlayerIdx]]?.updatePlayers(
      this.currentPlayerIdx
    );
  };

  getNextPlayer = () => {
    this.currentPlayerIdx = (this.currentPlayerIdx + 1) % this.players.length;
  };

  isChuteOrLadder = () => {
    const chute = chutes[this.players[this.currentPlayerIdx]];
    const ladder = ladders[this.players[this.currentPlayerIdx]];

    if (chute) {
      this.players[this.currentPlayerIdx] = chute;
    }
    if (ladder) {
      this.players[this.currentPlayerIdx] = ladder;
    }
    return;
  };

  takeTurn = () => {
    if (this.gameOver) {
      alert(`game over, player ${this.currentPlayerIdx + 1} wins!`);
      return;
    }

    const spinValue = spinSpinner();
    this.spinResult.textContent = spinValue;
    this.updateTile(); // deactivate current square
    this.players[this.currentPlayerIdx] += spinValue;
    this.isChuteOrLadder();
    this.updateTile(); // activate new square
    this.getNextPlayer();
  };
}

new Game();
