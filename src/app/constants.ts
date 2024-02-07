export const COLS = 10;
export const ROWS = 20;
export const BLOCK_SIZE = 30;
export const LINES_PER_LEVEL = 10;

export class KEY {
  static readonly ArrowLeft = 37;
  static readonly ArrowRight = 39;
  static readonly ArrowDown = 40;
}

export const COLORS = [
  'cyan',
  'blue',
  'orange',
  'yellow',
  'green',
  'purple',
  'red'
]

export const SHAPES = {
  'I' : [[0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]],
  'J' : [[1, 0, 0], [1, 1, 1], [0, 0, 0]],
  'L' : [[0, 0, 1], [1, 1, 1], [0, 0, 0]],
  'O' : [[1, 1], [1, 1]],
  
  'S' : [[0, 0, 0],
         [0, 1, 1],
         [1, 1, 0]],

  'T' : [[0, 1, 0], [1, 1, 1], [0, 0, 0]],
  'Z' : [[0, 0, 0], [1, 1, 0], [0, 1, 1]]
}

export class Points {
  static readonly SINGLE = 100;
  static readonly DOUBLE = 300;
  static readonly TRIPLE = 500;
  static readonly TETRIS = 800;
  static readonly SOFT_DROP = 1;
  static readonly HARD_DROP = 2;
}

export class LEVEL {
  static readonly 0 = 800;
  static readonly 1 = 720;
  static readonly 2 = 630;
  static readonly 3 = 550;
  static readonly 4 = 470;
  static readonly 5 = 380;
  static readonly 6 = 300;
  static readonly 7 = 220;
  static readonly 8 = 130;
  static readonly 9 = 100;
  static readonly 10 = 80;
  static readonly 11 = 80;
  static readonly 12 = 80;
  static readonly 13 = 70;
  static readonly 14 = 70;
  static readonly 15 = 70;
  static readonly 16 = 50;
  static readonly 17 = 50;
  static readonly 18 = 50;
  static readonly 19 = 30;
  static readonly 20 = 30;
  // 29+ is 20ms
}