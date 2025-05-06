const board = document.getElementById("board");
const statusText = document.getElementById("status");
const restartBtn = document.getElementById("restart");
const undoBtn = document.getElementById("undo");
const themeToggle = document.getElementById("theme-toggle");
const modeSelect = document.getElementById("mode");

const moveSound = document.getElementById("moveSound");
const winSound = document.getElementById("winSound");
const drawSound = document.getElementById("drawSound");

let cells;
let boardState;
let currentPlayer;
let gameActive;
let moveHistory;
let mode = "pvp";

function initializeGame() {
  board.innerHTML = "";
  boardState = Array(9).fill("");
  currentPlayer = "X";
  gameActive = true;
  moveHistory = [];
  renderBoard();
  updateStatus();
}

function renderBoard() {
  board.innerHTML = "";
  boardState.forEach((cell, index) => {
    const cellDiv = document.createElement("div");
    cellDiv.classList.add("cell");
    cellDiv.dataset.index = index;
    cellDiv.textContent = cell;
    if (cell) cellDiv.classList.add(cell);
    cellDiv.addEventListener("click", handleCellClick);
    board.appendChild(cellDiv);
  });
  cells = document.querySelectorAll(".cell");
}

function handleCellClick(e) {
  const index = e.target.dataset.index;
  if (!gameActive || boardState[index] !== "") return;

  makeMove(index, currentPlayer);

  if (mode === "ai" && gameActive && currentPlayer === "O") {
    setTimeout(aiMove, 300);
  }
}

function makeMove(index, player) {
  boardState[index] = player;
  moveHistory.push(index);
  moveSound.play();
  renderBoard();
  checkResult();
  currentPlayer = currentPlayer === "X" ? "O" : "X";
  updateStatus();
}

function updateStatus() {
  if (!gameActive) return;
  statusText.textContent = `${currentPlayer}'s turn`;
}

function checkResult() {
  const winPatterns = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let pattern of winPatterns) {
    const [a, b, c] = pattern;
    if (boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
      highlightWin(pattern);
      statusText.textContent = `${boardState[a]} wins!`;
      winSound.play();
      gameActive = false;
      return;
    }
  }

  if (!boardState.includes("")) {
    statusText.textContent = "Draw!";
    drawSound.play();
    gameActive = false;
  }
}

function highlightWin(pattern) {
  pattern.forEach(i => cells[i].classList.add("win"));
}

function undoMove() {
  if (!gameActive || moveHistory.length === 0) return;

  const last = moveHistory.pop();
  boardState[last] = "";

  if (mode === "ai" && currentPlayer === "X" && moveHistory.length > 0) {
    const aiLast = moveHistory.pop();
    boardState[aiLast] = "";
  }

  currentPlayer = currentPlayer === "X" ? "O" : "X";
  renderBoard();
  updateStatus();
  gameActive = true;
}

function toggleTheme() {
  document.body.classList.toggle("dark");
}

function aiMove() {
  let bestScore = -Infinity;
  let move;

  for (let i = 0; i < 9; i++) {
    if (boardState[i] === "") {
      boardState[i] = "O";
      let score = minimax(boardState, 0, false);
      boardState[i] = "";
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }

  if (move !== undefined) {
    makeMove(move, "O");
  }
}

function minimax(state, depth, isMaximizing) {
  const winner = getWinner(state);
  if (winner === "X") return -10 + depth;
  if (winner === "O") return 10 - depth;
  if (!state.includes("")) return 0;

  if (isMaximizing) {
    let best = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (state[i] === "") {
        state[i] = "O";
        let score = minimax(state, depth + 1, false);
        state[i] = "";
        best = Math.max(score, best);
      }
    }
    return best;
  } else {
    let best = Infinity;
    for (let i = 0; i < 9; i++) {
      if (state[i] === "") {
        state[i] = "X";
        let score = minimax(state, depth + 1, true);
        state[i] = "";
        best = Math.min(score, best);
      }
    }
    return best;
  }
}

function getWinner(state) {
  const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6],
  ];
  for (let pattern of winPatterns) {
    const [a, b, c] = pattern;
    if (state[a] && state[a] === state[b] && state[a] === state[c]) {
      return state[a];
    }
  }
  return null;
}

// Event listeners
restartBtn.addEventListener("click", initializeGame);
undoBtn.addEventListener("click", undoMove);
themeToggle.addEventListener("click", toggleTheme);
modeSelect.addEventListener("change", (e) => {
  mode = e.target.value;
  initializeGame();
});

initializeGame();
