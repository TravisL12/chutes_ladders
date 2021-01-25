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

const spinnerButton = document.getElementById('spin');
const spinResult = document.getElementById('spin-result');
spinnerButton.addEventListener('click', (event) => {
  const spinValue = spinSpinner();
  spinResult.textContent = spinValue;
});
