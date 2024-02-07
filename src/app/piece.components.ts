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
    let shape = Math.floor(Math.random()*COLORS.length);
    let color = Math.floor(Math.random()*COLORS.length);
    switch(shape) {
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

    this.color = COLORS[color];
    this.x = shape == 3 ? 4 : 3;
    this.y = 0;

    //apply random color to shape matrix
    this.shape = this.shape.map( (row) => row.map( (cell) => cell = cell*(color+1)));
  }

  draw() {
    this.shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if(value > 0)
          Piece.drawBlock(this.color, this.x+x, this.y+y, this.renderContext);
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
            Piece.drawBlock(this.color, x, y, renderContext);
        });
      });
    }
  }

  public static drawBlock(color:string, x:number, y:number, renderContext:CanvasRenderingContext2D|null) {
    if(renderContext != null) {
      //BLOCK
      renderContext.fillStyle = color;
      renderContext.fillRect(x, y, 1, 1);
      //BLOCK FILLS
      renderContext.fillStyle = "black";
      renderContext.lineWidth = .1;
      renderContext.strokeRect(x, y, 1, 1);

      renderContext.beginPath();
      renderContext.lineWidth = .05;
      renderContext.moveTo(x, y);
      renderContext.lineTo(x+.2,y+.2);
      renderContext.moveTo(x+1,y);
      renderContext.lineTo(x+.8,y+.2);
      renderContext.moveTo(x,y+1);
      renderContext.lineTo(x+.2,y+.8);
      renderContext.moveTo(x+1,y+1);
      renderContext.lineTo(x+.8,y+.8);
      renderContext.stroke();
    
      renderContext.strokeRect(x+.2, y+.2, .6, .6);
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