import { COLORS, SHAPES } from "./constants";

export interface IPiece {
  x: number;
  y: number;
  color: string;
  shape: number[][];
}

export class Piece implements IPiece {
  x: number;
  y: number;
  color: string;
  shape: number[][];

  constructor(private renderContext: CanvasRenderingContext2D) {
    this.x = 0;
    this.y = 0;
    this.color = '';
    this.shape = Array<Array<number>>();
    this.spawn();
  }

  spawn() {
    let colorId = Math.floor(Math.random()*COLORS.length);
    console.log(colorId);
    switch(colorId) {
      case 0:
        this.shape = SHAPES['I'];
        break;
      case 1:
        this.shape = SHAPES['J'];
        break;
      case 2:
        this.shape = SHAPES['L'];
        break;
      case 3:
        this.shape = SHAPES['O'];
        break;
      case 4:
        this.shape = SHAPES['S'];
        break;
      case 5:
        this.shape = SHAPES['T'];
        break;
      case 6:
        this.shape = SHAPES['Z'];
        break;
      default:
        break;
    }

    this.color = COLORS[colorId];
    this.x = colorId == 3 ? 4 : 3;
    this.y = 0; 
  }

  draw() {
    this.renderContext.fillStyle = this.color;

    this.shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if(value > 0)
          this.renderContext.fillRect(this.x+x, this.y+y, 1, 1);
      });
    });
  }

  drawNext(renderContext: CanvasRenderingContext2D | null) {
    if (renderContext != null) {
      renderContext.clearRect(0, 0, renderContext.canvas.width, renderContext.canvas.height);
      renderContext.fillStyle = this.color;
      
      this.shape.forEach((row, y) => {
        row.forEach((value, x) => {
          if (value > 0)
            renderContext.fillRect(x, y, 1, 1);
        });
      });
    }
  }

  move(p: IPiece){
    this.x = p.x;
    this.y = p.y;
    this.shape = p.shape;
  }

  rotate(){
    // Transpose matrix
    for(let y = 0; y < this.shape.length; ++y) {
      for(let x = 0; x < y ; ++x) {
        [this.shape[x][y], this.shape[y][x]] = [this.shape[y][x], this.shape[x][y]];
      }
    }

    // Reverse column order
    this.shape.forEach(row => row.reverse());
  }
}