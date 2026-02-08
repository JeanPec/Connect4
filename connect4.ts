import * as readline from 'readline-sync';

export enum token {
  red = 'R',
  win = 'W',
  yellow = 'Y',
}
export enum state {
  continue = 'continue',
  win = 'win',
  draw = 'draw',
}

//Yellow always start
const ROWS = 6;
const COLS = 7;

const RED = '🔴';
const WIN = '🟢';
const RED_WIN = '❤️';
const YELLOW = '🟡';
const YELLOW_WIN = '💛';
const EMPTY = '⚪';
const BOARD_BORDER = '🟦';

export class Connect4 {
  private grid: (token | null)[][] = [];
  private currentToken = token.red;
  private state: state = state.continue;

  constructor(
    grid: (token | null)[][] = Array.from({ length: COLS }, () =>
      Array(ROWS).fill(null),
    ),
    tokenToPlay = token.red,
  ) {
    this.grid = grid;
    this.currentToken = tokenToPlay;
  }

  private displayWelcome(): void {
    console.clear();
    const welcomeArt = `
  _______________________________________________________________
 /                                                               \\
 |   ____ ___  _   _ _   _ _____ ____ _____    _  _              |
 |  / ___/ _ \\| \\ | | \\ | | ____/ ___|_   _|  | || |             |
 | | |  | | | |  \\| |  \\| |  _| | |     | |   | || |_            |
 | | |__| |_| | |\\  | |\\  | |___| |___  | |   |__   _|           |
 |  \\____\\___/|_| \\_|_| \\_|_____|\\____| |_|      |_|             |
 |                                                               |
 |            -- THE ULTIMATE STRATEGY CHALLENGE --              |
 \\_______________________________________________________________/
    `;
    console.log(welcomeArt);
    console.log('\n');
  }

  private displayRedWin(): void {
    console.clear();
    this.displayGrid();
    const redWins = `
  _____________________________________
 /                                     \\
 |   **** RED TAKES THE CROWN ****      |
 \\_____________________________________/
`;
    console.log(redWins);
    console.log('\n');
  }

  private displayYellowWin(): void {
    console.clear();
    this.displayGrid();
    const yellowWins = `
  _____________________________________
 /                                     \\
 |   **** YELLOW TAKES THE CROWN ****   |
 \\_____________________________________/
`;
    console.log(yellowWins);
    console.log('\n');
  }

  private displayDraw(): void {
    console.clear();
    this.displayGrid();
    const drawArt = `
  ______________________________
 /                              \\
 |  --- THE BOARD IS FULL ---   |
 \\_____________________________/
`;
    console.log(drawArt);
    console.log('\n');
  }

  private displayResult(): void {
    switch (this.state) {
      case state.draw:
        this.displayDraw();
      case state.win:
        if (this.currentToken === token.red) this.displayRedWin();
        else this.displayYellowWin();
        break;
    }
  }

  public start(): void {
    this.displayWelcome();

    // Ask for Game Mode
    const mode = readline.question('Ready to play?').toLowerCase();

    // Infinite Game Loop
    while (this.state === state.continue) {
      this.switchPlayer();
      this.displayGrid();

      const choice = this.humanChoice();
      this.putToken(this.currentToken, choice);
    }

    this.displayResult();

    console.log('Game Over! Thanks for playing.');
  }

  private switchPlayer() {
    this.currentToken =
      this.currentToken === token.red ? token.yellow : token.red;
  }

  humanChoice(): number {
    let column;
    const availableMoves = this.giveAvailableMoves();
    if (availableMoves.length === 0)
      throw Error('The draw should have been caught');
    column =
      parseInt(
        readline.question(
          `${this.currentToken === token.red ? RED : YELLOW} player: Choose a column to put your coin: `,
        ),
      ) - 1;
    while (isNaN(column) || !availableMoves.includes(column)) {
      console.log('Please enter a valid column');
      column =
        parseInt(
          readline.question(
            `${this.currentToken === token.red ? RED : YELLOW} player: Choose a column to put your coin: `,
          ),
        ) - 1;
    }
    return column;
  }

  giveAvailableMoves(): number[] {
    const availableMoves: number[] = [];
    for (let i = 0; i < COLS; i++) {
      if (this.grid[i][ROWS - 1] === null) availableMoves.push(i);
    }
    return availableMoves;
  }

  checkLegalMove(columnToPlay: number) {
    return this.grid[columnToPlay][ROWS - 1] === null;
  }

  putToken(tokenPlayed: token, columnPlayed: number): void {
    if (!this.checkLegalMove(columnPlayed))
      throw new Error('The move is not legal');
    let i = 0;
    while (this.grid[columnPlayed][i] !== null) i++;
    this.grid[columnPlayed][i] = tokenPlayed;
    this.state = this.checkState(columnPlayed, i);
  }

  checkState(c: number, r: number): state {
    if (this.giveAvailableMoves().length === 0) return state.draw;
    if (this.checkVictory(c, r)) return state.win;

    return state.continue;
  }

  checkVictory(c: number, r: number): boolean {
    const horizontal = this.checkLeft(c - 1, r) + this.checkRight(c + 1, r);
    const down = this.checkBelow(c, r - 1);
    const diag1 =
      this.checkDiagLeftDown(c - 1, r - 1) +
      this.checkDiagRightUp(c + 1, r + 1);
    const diag2 =
      this.checkDiagLeftUp(c - 1, r + 1) +
      this.checkDiagRightDown(c + 1, r - 1);

    if (diag1 >= 3) {
      this.paintDiagLeftDown(c - 1, r - 1);
      this.paintDiagRightUp(c + 1, r + 1);
    }

    if (diag2 >= 3) {
      this.paintDiagLeftUp(c - 1, r + 1);
      this.paintDiagRightDown(c + 1, r - 1);
    }

    if (horizontal >= 3) {
      this.paintLeft(c - 1, r);
      this.paintRight(c + 1, r);
    }

    if (down >= 3) this.paintBelow(c, r - 1);

    if (horizontal >= 3 || diag1 >= 3 || diag2 >= 3 || down >= 3) {
      console.log(this.grid);
      this.grid[c][r] = token.win;
    }

    return horizontal >= 3 || diag1 >= 3 || diag2 >= 3 || down >= 3;
  }

  paintRight(c: number, r: number): void {
    if (r < 0 || r >= ROWS || c < 0 || c >= COLS) return;
    if (this.grid[c][r] !== this.currentToken) return;
    this.grid[c][r] = token.win;
    this.paintRight(c + 1, r);
  }

  checkRight(c: number, r: number): number {
    if (r < 0 || r >= ROWS || c < 0 || c >= COLS) return 0;
    if (this.grid[c][r] !== this.currentToken) return 0;
    return 1 + this.checkRight(c + 1, r);
  }

  paintLeft(c: number, r: number): void {
    if (r < 0 || r >= ROWS || c < 0 || c >= COLS) return;
    if (this.grid[c][r] !== this.currentToken) return;
    this.grid[c][r] = token.win;
    this.paintLeft(c - 1, r);
  }

  checkLeft(c: number, r: number): number {
    if (r < 0 || r >= ROWS || c < 0 || c >= COLS) return 0;
    if (this.grid[c][r] !== this.currentToken) return 0;
    return 1 + this.checkLeft(c - 1, r);
  }

  paintBelow(c: number, r: number): void {
    if (r < 0 || r >= ROWS || c < 0 || c >= COLS) return;
    if (this.grid[c][r] !== this.currentToken) return;
    this.grid[c][r] = token.win;
    this.paintBelow(c, r - 1);
  }

  checkBelow(c: number, r: number): number {
    if (r < 0 || r >= ROWS || c < 0 || c >= COLS) return 0;
    if (this.grid[c][r] !== this.currentToken) return 0;
    return 1 + this.checkBelow(c, r - 1);
  }

  paintDiagRightDown(c: number, r: number): void {
    if (r < 0 || r >= ROWS || c < 0 || c >= COLS) return;
    if (this.grid[c][r] !== this.currentToken) return;
    this.grid[c][r] = token.win;
    this.paintDiagRightDown(c + 1, r - 1);
  }

  checkDiagRightDown(c: number, r: number): number {
    if (r < 0 || r >= ROWS || c < 0 || c >= COLS) return 0;
    if (this.grid[c][r] !== this.currentToken) return 0;
    return 1 + this.checkDiagRightDown(c + 1, r - 1);
  }

  paintDiagRightUp(c: number, r: number): void {
    if (r < 0 || r >= ROWS || c < 0 || c >= COLS) return;
    if (this.grid[c][r] !== this.currentToken) return;
    this.grid[c][r] = token.win;
    this.paintDiagRightUp(c + 1, r + 1);
  }

  checkDiagRightUp(c: number, r: number): number {
    if (r < 0 || r >= ROWS || c < 0 || c >= COLS) return 0;
    if (this.grid[c][r] !== this.currentToken) return 0;
    return 1 + this.checkDiagRightDown(c + 1, r + 1);
  }

  paintDiagLeftDown(c: number, r: number): void {
    if (r < 0 || r >= ROWS || c < 0 || c >= COLS) return;
    if (this.grid[c][r] !== this.currentToken) return;
    this.grid[c][r] = token.win;
    this.paintDiagLeftDown(c - 1, r - 1);
  }

  checkDiagLeftDown(c: number, r: number): number {
    if (r < 0 || r >= ROWS || c < 0 || c >= COLS) return 0;
    if (this.grid[c][r] !== this.currentToken) return 0;
    return 1 + this.checkDiagLeftDown(c - 1, r - 1);
  }

  paintDiagLeftUp(c: number, r: number): void {
    if (r < 0 || r >= ROWS || c < 0 || c >= COLS) return;
    if (this.grid[c][r] !== this.currentToken) return;
    this.grid[c][r] = token.win;
    this.paintDiagLeftUp(c - 1, r + 1);
  }

  checkDiagLeftUp(c: number, r: number): number {
    if (r < 0 || r >= ROWS || c < 0 || c >= COLS) return 0;
    if (this.grid[c][r] !== this.currentToken) return 0;
    return 1 + this.checkDiagLeftUp(c - 1, r + 1);
  }

  displayGrid(): void {
    //console.clear();
    console.log('    1  2  3  4  5  6  7  '); // Column headers
    console.log(BOARD_BORDER.repeat(COLS + 6));

    for (let r = ROWS - 1; r >= 0; r--) {
      let rowString = '';
      for (let c = 0; c < COLS; c++) {
        const cell = this.grid[c][r];
        // Choose the right icon
        let icon = RED;

        switch (cell) {
          case token.red:
            icon = RED;
            break;
          case token.yellow:
            icon = YELLOW;
            break;
          case token.win:
            icon = WIN;
            break;
          default:
            icon = EMPTY;
            break;
        }
        rowString += ` ${icon}`;
      }
      console.log(BOARD_BORDER + rowString + ' ' + BOARD_BORDER);
    }

    // Add a bottom border to make it look like a frame
    console.log(BOARD_BORDER.repeat(COLS + 6));
  }
}

if (require.main === module) {
  const game = new Connect4();
  game.start();
}
