import * as readline from 'readline-sync';

enum token {
  red,
  yellow,
}
enum state {
  continue,
  win,
  draw,
}

//Yellow always start
const ROWS = 6;
const COLS = 7;

class Connect4 {
  private grid: token[][] = [];
  private currentToken = token.red;
  private state: state = state.continue;

  constructor() {
    this.grid = Array.from({ length: COLS }, () => Array(ROWS).fill(null));
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
 |                                                               |
 |           [ 1 ] START GAME      [ 2 ] EXIT                    |
 \\_______________________________________________________________/
    `;
    console.log(welcomeArt);
    console.log('\n');
  }

  private displayRedWin(): void {
    console.clear();
    const redWins = `
  ___________________________________________________
 /                                                   \\
 |   ____  _____ ____    __        _____ _   _ ____  |
 |  |  _ \\| ____|  _ \\   \\ \\      / /_ _| \\ | / ___| |
 |  | |_) |  _| | | | |   \\ \\ /\\ / / | ||  \\| \\___ \\ |
 |  |  _ <| |___| |_| |    \\ V  V /  | || |\\  |___) ||
 |  |_| \\_\\_____|____/      \\_/\\_/  |___|_| \\_|____/ |
 |                                                   |
 |             >>>>  RED IS VICTORIOUS  <<<<         |
 \\___________________________________________________/
`;
    console.log(redWins);
    console.log('\n');
  }

  private displayYellowWin(): void {
    console.clear();
    const yellowWins = `
  ___________________________________________________
 /                                                   \\
 |  __   __ _____ _     _     _____  _ _ _  _  _     |
 |  \\ \\ / /| ____| |   | |   /  _  \\| | | || || |    |
 |   \\   / |  _| | |   | |   | | | || | | || || |    |
 |    | |  | |___| |___| |___| |_| || |_| || ||_|    |
 |    |_|  |_____|_____|_____|\\_____/\\_____/|_|(_)   |
 |                                                   |
 |            **** YELLOW TAKES THE CROWN **** |
 \\___________________________________________________/
`;
    console.log(yellowWins);
    console.log('\n');
  }

  private displayDraw(): void {
    console.clear();
    const drawArt = `
  ___________________________________________________
 /                                                   \\
 |   ____    ____        _        __        __       |
 |  |  _ \\  |  _ \\      / \\       \\ \\      / /       |
 |  | | | | | |_) |    / _ \\       \\ \\ /\\ / /        |
 |  | |_| | |  _ <    / ___ \\       \\ V  V /         |
 |  |____/  |_| \\_\\  /_/   \\_\\       \\_/\\_/          |
 |                                                   |
 |             --- THE BOARD IS FULL ---             |
 \\___________________________________________________/
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
          `${this.currentToken === token.red ? 'Red' : 'Yellow'} player: Choose a column to put your coin`,
        ),
      ) - 1;
    while (isNaN(column) || !availableMoves.includes(column)) {
      console.log('Pelase enter a valid column');
      column =
        parseInt(
          readline.question(
            `${this.currentToken === token.red ? 'Red' : 'Yellow'} player: Choose a column to put your coin`,
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

    return horizontal === 3 || diag1 === 3 || diag2 === 3 || down === 3;
  }

  checkRight(c: number, r: number): number {
    if (r < 0 || r >= ROWS || c < 0 || c >= COLS) return 0;
    if (this.grid[c][r] !== this.currentToken) return 0;
    return 1 + this.checkRight(c + 1, r);
  }

  checkLeft(c: number, r: number): number {
    if (r < 0 || r >= ROWS || c < 0 || c >= COLS) return 0;
    if (this.grid[c][r] !== this.currentToken) return 0;
    return 1 + this.checkLeft(c - 1, r);
  }

  checkBelow(c: number, r: number): number {
    if (r < 0 || r >= ROWS || c < 0 || c >= COLS) return 0;
    if (this.grid[c][r] !== this.currentToken) return 0;
    return 1 + this.checkBelow(c, r - 1);
  }

  checkDiagRightDown(c: number, r: number): number {
    if (r < 0 || r >= ROWS || c < 0 || c >= COLS) return 0;
    if (this.grid[c][r] !== this.currentToken) return 0;
    return 1 + this.checkDiagRightDown(c + 1, r - 1);
  }

  checkDiagRightUp(c: number, r: number): number {
    if (r < 0 || r >= ROWS || c < 0 || c >= COLS) return 0;
    if (this.grid[c][r] !== this.currentToken) return 0;
    return 1 + this.checkDiagRightDown(c + 1, r + 1);
  }

  checkDiagLeftDown(c: number, r: number): number {
    if (r < 0 || r >= ROWS || c < 0 || c >= COLS) return 0;
    if (this.grid[c][r] !== this.currentToken) return 0;
    return 1 + this.checkDiagLeftDown(c - 1, r - 1);
  }

  checkDiagLeftUp(c: number, r: number): number {
    if (r < 0 || r >= ROWS || c < 0 || c >= COLS) return 0;
    if (this.grid[c][r] !== this.currentToken) return 0;
    return 1 + this.checkDiagLeftUp(c - 1, r + 1);
  }

  displayGrid(): void {
    const RED = '🔴';
    const YELLOW = '🟡';
    const EMPTY = '⚪';
    const BOARD_BORDER = '🟦';

    //console.clear();
    console.log('  1  2  3  4  5  6  7  '); // Column headers

    for (let r = ROWS - 1; r >= 0; r--) {
      let rowString = '';
      for (let c = 0; c < COLS; c++) {
        const cell = this.grid[c][r];
        // Choose the right icon
        const icon =
          cell === token.red ? RED : cell === token.yellow ? YELLOW : EMPTY;
        rowString += ` ${icon}`;
      }
      console.log(rowString);
    }

    // Add a bottom border to make it look like a frame
    console.log(BOARD_BORDER.repeat(COLS + 4));
  }
}

const game = new Connect4();
game.start();
