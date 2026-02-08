import { describe, expect, test } from '@jest/globals';
import { Connect4, token, state } from './connect4';

type Scenario = {
  lastPlayed: { token: token; c: number; r: number };
  grid: (token | null)[][];
};

const scenario1 = {
  lastPlayed: { token: token.red, c: 0, r: 3 },
  grid: [
    [token.red, token.red, token.red, token.red, null, null],
    [token.yellow, token.yellow, token.yellow, token.red, null, null],
    [token.yellow, null, null, null, null, null],
    [null, null, null, null, null, null],
    [null, null, null, null, null, null],
    [null, null, null, null, null, null],
    [null, null, null, null, null, null],
  ],
};

const scenario2 = {
  lastPlayed: { token: token.red, c: 0, r: 3 },
  grid: [
    [token.red, token.red, token.yellow, token.red, null, null],
    [token.yellow, token.yellow, token.yellow, token.red, null, null],
    [token.red, null, null, null, null, null],
    [null, null, null, null, null, null],
    [null, null, null, null, null, null],
    [null, null, null, null, null, null],
    [null, null, null, null, null, null],
  ],
};

const scenario3 = {
  lastPlayed: { token: token.red, c: 5, r: 0 },
  grid: [
    [token.red, token.red, token.yellow, token.red, null, null],
    [token.yellow, token.yellow, token.yellow, token.red, null, null],
    [token.red, null, null, null, null, null],
    [token.red, null, null, null, null, null],
    [token.red, null, null, null, null, null],
    [token.red, null, null, null, null, null],
    [null, null, null, null, null, null],
  ],
};

const scenario4 = {
  lastPlayed: { token: token.yellow, c: 1, r: 3 },
  grid: [
    [token.red, token.red, token.yellow, token.red, null, null],
    [token.yellow, token.yellow, token.yellow, token.yellow, null, null],
    [token.red, null, null, null, null, null],
    [token.red, null, null, null, null, null],
    [token.red, null, null, null, null, null],
    [token.yellow, null, null, null, null, null],
    [null, null, null, null, null, null],
  ],
};

const scenario5 = {
  lastPlayed: { token: token.yellow, c: 5, r: 0 },
  grid: [
    [token.red, token.red, token.yellow, token.red, null, null],
    [token.yellow, token.yellow, token.red, token.red, token.yellow, null],
    [token.red, null, null, token.yellow, null, null],
    [token.red, null, token.yellow, null, null, null],
    [token.red, token.yellow, null, null, null, null],
    [token.yellow, null, null, null, null, null],
    [null, null, null, null, null, null],
  ],
};

const scenario6 = {
  lastPlayed: { token: token.yellow, c: 3, r: 2 },
  grid: [
    [token.red, token.red, token.yellow, token.red, null, null],
    [token.yellow, token.yellow, token.red, token.red, token.yellow, null],
    [token.red, null, null, token.yellow, null, null],
    [token.red, null, token.yellow, null, null, null],
    [token.red, token.yellow, null, null, null, null],
    [token.yellow, null, null, null, null, null],
    [null, null, null, null, null, null],
  ],
};

const scenario7 = {
  lastPlayed: { token: token.yellow, c: 5, r: 5 },
  grid: [
    [token.red, token.red, token.yellow, token.red, token.yellow, token.yellow],
    [token.yellow, token.yellow, token.red, token.red, token.yellow, token.red],
    [token.red, token.red, null, token.yellow, token.red, token.red],
    [token.red, token.yellow, token.yellow, token.red, token.red, token.red],
    [token.yellow, token.red, token.red, token.red, token.yellow, token.red],
    [token.red, token.red, token.red, token.yellow, token.yellow, token.yellow],
    [token.red, token.red, token.yellow, token.red, token.yellow, token.red],
  ],
};

function testScenario(scenario: Scenario, state: state) {
  const game = new Connect4(scenario.grid, scenario.lastPlayed.token);

  expect(game.checkState(scenario.lastPlayed.c, scenario.lastPlayed.r)).toEqual(
    state,
  );
}

function debugScenario(scenario: Scenario, state: state) {
  const game = new Connect4(scenario.grid, scenario.lastPlayed.token);

  game.displayGrid();

  expect(game.checkState(scenario.lastPlayed.c, scenario.lastPlayed.r)).toEqual(
    state,
  );
}

describe('Connect4', () => {
  test('Scenario 1 - victoire rouge horizontale', () => {
    testScenario(scenario1, state.win);
  });

  test('Scenario 2 - continue', () => {
    testScenario(scenario2, state.continue);
  });

  test('Scenario 3 - victoire rouge vetical', () => {
    testScenario(scenario3, state.win);
  });

  test('Scenario 4 - victoire jaune vertical', () => {
    testScenario(scenario4, state.win);
  });

  test('Scenario 5 - victoire jaune diaguonal', () => {
    testScenario(scenario5, state.win);
  });

  test('Scenario 6 - victoire jaune diaguonal', () => {
    testScenario(scenario6, state.win);
  });

  test('Scenario 7 - victoire jaune diaguonal', () => {
    testScenario(scenario7, state.draw);
  });
});
