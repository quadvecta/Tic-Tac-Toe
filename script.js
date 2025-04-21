
const boardElement = document.getElementById("board");
const statusElement = document.getElementById("status");
const restartButton = document.getElementById("restart");
const undoButton = document.getElementById("undo");
const themeToggle = document.getElementById("theme-toggle");

const moveSound = document.getElementById("moveSound");
const winSound = document.getElementById("winSound");
const drawSound = document.getElementById("drawSound");

let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let isGameActive = true;
let history = [];

const winningConditions = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function handleResultValidation() {
  let roundWon = false;
  for (let i = 0; i < winningConditions.length; i++) {
    const [a, b, c] = winningConditions[i];
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      roundWon = true;
      document.querySelectorAll(".cell")[a].classList.add("win");
      document.querySelectorAll(".cell")[b].classList.add("win");
      document.querySelectorAll(".cell")[c].classList.add("win");
      break;
    }
  }
  if (roundWon) {
    statusElement.textContent = `Player ${currentPlayer} wins!`;
    isGameActive = false;
    winSound.play();
    return;
  }

  if (!board.includes("")) {
    statusElement.textContent = "It's a draw!";
    isGameActive = false;
    drawSound.play();
  }
}

function updateStatus() {
  statusElement.textContent = `Player ${currentPlayer}'s turn`;
}

function handleCellClick(index) {
  if (board[index] !== "" || !isGameActive) return;

  board[index] = currentPlayer;
  history.push(index);
  renderBoard();
  handleResultValidation();

  if (isGameActive) {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    updateStatus();
  }

  moveSound.play();
}

function renderBoard() {
  boardElement.innerHTML = "";
  board.forEach((cell, index) => {
    const cellElement = document.createElement("div");
    cellElement.classList.add("cell");
    cellElement.textContent = cell;
    cellElement.addEventListener("click", () => handleCellClick(index));
    boardElement.appendChild(cellElement);
  });
}

restartButton.addEventListener("click", () => {
  board = ["", "", "", "", "", "", "", "", ""];
  currentPlayer = "X";
  isGameActive = true;
  history = [];
  updateStatus();
  renderBoard();
});

undoButton.addEventListener("click", () => {
  if (history.length > 0 && isGameActive) {
    const lastMove = history.pop();
    board[lastMove] = "";
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    updateStatus();
    renderBoard();
  }
});

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

updateStatus();
renderBoard();
