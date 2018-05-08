const num_rows = 16;
const num_cols = 30;
const num_mines = 99;
let robbie;
let cellSize;
let board;
let generated;
let gameover;
let cheats;

function setup() {
  window.addEventListener("contextmenu", function(e) {
    e.preventDefault();
  });
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER);
  cellSize = createVector(width / num_cols, height / num_rows);
  textSize(min(cellSize.x, cellSize.y));
  initialize();
  generate();
  robbie = new Bot();
  generated = false;
  gameover = false;
  cheats = true;
  // frameRate(1);
}

function draw() {
  if (gameover) {
    noLoop();
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        board[i][j].revealed = true;
      }
    }
  } else {
    robbie.select();
  }
  background(0);
  for (let col of board) {
    for (let tile of col) {
      tile.update();
      tile.show();
    }
  }
}

function mousePressed() {
  let r = -1;
  let c = -1;
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      if (board[i][j].clicked()) {
        r = i;
        c = j;
      }
    }
  }
  if (mouseButton == LEFT) {
    if (!generated) {
      do {
        initialize();
        generate();
      } while (board[r][c].neighborCount != 0);
      generated = true;
    }
    if (board[r][c].revealed && board[r][c].flagCount == board[r][c].neighborCount) {
      board[r][c].autoFill();
    }
    if (!board[r][c].f) {
      board[r][c].reveal();
    }
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        board[i][j].countRevealed();
        board[i][j].countPlayable();
        board[i][j].countFlags();
      }
    }
  } else if (mouseButton == RIGHT) {
    if (!board[r][c].revealed) {
      board[r][c].f = !board[r][c].f;
      for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
          board[i][j].countRevealed();
          board[i][j].countPlayable();
          board[i][j].countFlags();
        }
      }
    }
  }

}

function generate() {
  for (let i = num_mines; i > 0; i--) {
    let r = int(random(board.length));
    let c = int(random(board[0].length));
    if (board[r][c].b) {
      i++;
    } else {
      board[r][c].b = true;
    }
  }
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      board[i][j].countNeighbors();
      // board[i][j].revealed = true;
    }
  }
  // generated = true;
}

function initialize() {
  board = new Array(num_rows);
  for (let i = 0; i < board.length; i++) {
    board[i] = new Array(num_cols);
    for (let j = 0; j < board[i].length; j++) {
      board[i][j] = new Tile(j * cellSize.x, i * cellSize.y, i, j, cellSize.x, cellSize.y);
    }
  }
}