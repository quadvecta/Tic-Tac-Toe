const gameBoard = document.getElementById('gameBoard');
const statusText = document.getElementById('status');
const resetButton = document.getElementById('resetButton');

let currentPlayer = 'X';
let boardState = Array(9).fill(null); // 3x3 board as a flat array
let gameActive = true;

// Winning combinations for Tic Tac Toe
const winningCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

// Initialize the game board
function initializeBoard() {
  gameBoard.innerHTML = '';
  boardState = Array(9).fill(null);
  gameActive = true;
  currentPlayer = 'X';
  statusText.textContent = `Player ${currentPlayer}'s turn`;

  for (let i = 0; i < 9; i++) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.dataset.index = i;

    cell.addEventListener('click', handleCellClick);
    gameBoard.appendChild(cell);
  }
}

// Handle cell click
function handleCellClick(event) {
  const cell = event.target;
  const cellIndex = cell.dataset.index;

  if (!gameActive || boardState[cellIndex]) return;

  boardState[cellIndex] = currentPlayer;
  cell.textContent = currentPlayer;
  cell.classList.add('taken');

  if (checkWin()) {
    celebrateWin();
    statusText.textContent = `Player ${currentPlayer} wins!`;
    gameActive = false;
  } else if (boardState.every(cell => cell)) {
    statusText.textContent = 'It\'s a draw!';
    gameActive = false;
  } else {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    statusText.textContent = `Player ${currentPlayer}'s turn`;
  }
}

// Check for a win
function checkWin() {
  return winningCombinations.some(combination => {
    if (combination.every(index => boardState[index] === currentPlayer)) {
      // Highlight winning cells
      combination.forEach(index => {
        const winningCell = document.querySelector(`.cell[data-index="${index}"]`);
        winningCell.classList.add('winner');
      });
      return true;
    }
    return false;
  });
}

// Celebrate the win
function celebrateWin() {
  document.body.classList.add('celebrate');
  setTimeout(() => {
    document.body.classList.remove('celebrate');
  }, 2000); // Reset celebration after 2 seconds
}

// Reset the game
resetButton.addEventListener('click', initializeBoard);

// Start the game
initializeBoard();

function handleCellClick(event) {
  const cell = event.target;
  const cellIndex = cell.dataset.index;

  if (!gameActive || boardState[cellIndex]) return;

  boardState[cellIndex] = currentPlayer;
  cell.textContent = currentPlayer;
  cell.classList.add('taken');

  if (checkWin()) {
    celebrateWin();
    statusText.textContent = `Player ${currentPlayer} Wins! 🎉`;
    statusText.classList.add('winner');
    statusText.classList.remove('turn');
    gameActive = false;
  } else if (boardState.every(cell => cell)) {
    statusText.textContent = 'It\'s a Draw!';
    statusText.classList.remove('turn', 'winner');
    gameActive = false;
  } else {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    statusText.textContent = `Player ${currentPlayer}'s Turn`;
    statusText.classList.add('turn');
    statusText.classList.remove('winner');
  }
}
