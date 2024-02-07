import { ValueConverter } from "@angular/compiler/src/render3/view/template";
import { Component, ViewChild, ElementRef, OnInit, HostListener } from "@angular/core";
import { COLS, ROWS, BLOCK_SIZE, KEY, COLORS, Points, LINES_PER_LEVEL, LEVEL } from "../constants";
import { IPiece, Piece } from "../piece.components";

@Component({
  selector: 'game-board',
  templateUrl: 'board.component.html',
  styleUrls: ['./board.component.scss']
})

export class BoardComponent implements OnInit {
  //Get canvas ref
  @ViewChild('board', { static: true })
  canvas!: ElementRef<HTMLCanvasElement>;
  renderContext!: CanvasRenderingContext2D | null;

  @ViewChild('next', { static: true })
  canvasNext!: ElementRef<HTMLCanvasElement>
  nextRenderContext!: CanvasRenderingContext2D | null;

  requestContextId: number = 0;
  time = {start: 0, elapsed: 0, level: 1000};
  points: number = 0;
  lines: number = 0;
  level: number = 0;
  board: number [][] = this.getEmptyBoard();
  piece!: Piece;
  next!: Piece;

  ngOnInit(): void {
    this.initBoard();
    this.initNext();
    this.resetGame();
  }

  resetGame() {
    this.points = 0;
    this.lines = 0;
    this.level = 0;
    this.board = this.getEmptyBoard();
    this.time = { start: 0, elapsed: 0, level: LEVEL[this.level as keyof LEVEL]};
  }

  initBoard() {
    //Get canvas render context
    if ( this.canvas != null) {
      this.renderContext = this.canvas.nativeElement.getContext('2d');
    }

    //Compute canvas size
    if ( this.renderContext != null ) {
      this.renderContext.canvas.width = COLS * BLOCK_SIZE;
      this.renderContext.canvas.height = ROWS * BLOCK_SIZE;
      this.renderContext.scale(BLOCK_SIZE, BLOCK_SIZE);
    } 
  }

  initNext() {
    if( this.canvasNext != null) {
      this.nextRenderContext = this.canvasNext.nativeElement.getContext('2d');
    }

    if( this.nextRenderContext != null) {
      this.nextRenderContext.canvas.width = 4 * BLOCK_SIZE;
      this.nextRenderContext.canvas.height = 4 * BLOCK_SIZE;
      this.nextRenderContext.scale(BLOCK_SIZE, BLOCK_SIZE);
    }
  }

  getEmptyBoard(): number[][] {
    return Array.from({length: ROWS}, () => Array(COLS).fill(0))
  }

  play() {
    //Cancel old game
    if (this.requestContextId > 0) {
      cancelAnimationFrame(this.requestContextId);
    }

    this.resetGame();
    this.board = this.getEmptyBoard();

    if(this.renderContext){
      this.piece = new Piece(this.renderContext);
      this.next = new Piece(this.renderContext);
    }
    // preview 
    if(this.nextRenderContext)
      this.next.drawNext(this.nextRenderContext);
    
    this.time.start = performance.now();
    this.animate();
  }

  gameOver() {
    cancelAnimationFrame(this.requestContextId);
    if (this.renderContext != null) {
      this.renderContext.fillStyle = 'black';
      this.renderContext.fillRect(1, 3, 8, 1.2);
      this.renderContext.font = '1px Arial';
      this.renderContext.fillStyle = 'white';
      this.renderContext.fillText('GAME OVER', 1.8, 4);
    }
    console.table(this.board);
  }

  animate(now = 0) {
    // Update elapsed time
    this.time.elapsed = now - this.time.start;
    // Check time level
    if (this.time.elapsed > this.time.level) {
      // Reset time
      this.time.start = now;
      //let isLastDrop = this.drop();
      if(this.drop()) {
        this.gameOver();
        return;
      }
    }

    this.renderContext?.clearRect(0, 0, this.renderContext.canvas.width, this.renderContext.canvas.height);
    this.piece.draw();
    this.drawBoard();

    this.requestContextId = requestAnimationFrame(this.animate.bind(this));
  }

  drop(): boolean {
    let p = this.moves(this.piece, 'ArrowDown');
    if (this.valid(p)) {
      this.piece.move(p);
    } else {
      this.freeze();
      this.clearLines();

      //Game over state
      if(this.piece.y === 0) {
        return true;
      }

      // TODO : debug same color 
      if (this.renderContext != null) {
        this.piece = this.next; 
        this.next = new Piece(this.renderContext);
        this.next.drawNext(this.nextRenderContext);
      }
    }
    return false;
  }

  freeze() {
    this.piece.shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if(value > 0) {
          this.board[y + this.piece.y][x + this.piece.x] = value;
        }
      });
    });
  }

  clearLines() {
    let lines = 0;

    this.board.forEach((row, y) => {
      if (row.every(value => value > 0)) {
        this.board.splice(y, 1);
        this.board.unshift(Array(COLS).fill(0));
        lines++;
      }
    });

    if (lines > 0) {
      this.points += lines === 1 ? Points.SINGLE * (this.level+1) :
                    lines === 2 ? Points.DOUBLE * (this.level+1) :
                    lines === 3 ? Points.TRIPLE * (this.level+1) :
                    lines === 4 ? Points.TETRIS * (this.level+1) : 0;
      this.lines += lines;

      //cleared line limit
      if(this.lines >= LINES_PER_LEVEL) {
        this.level++;
        this.lines -= LINES_PER_LEVEL;
        this.time.level = LEVEL[this.level as keyof LEVEL];
      }
    }
  }

  drawBoard(){
    this.board.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value >  0 && this.renderContext != null) {
          Piece.drawBlock(COLORS[value-1], x, y, this.renderContext);
        }
      });
    });
  }
  
  @HostListener('window:keydown', ['$event'])
  keyEvent(event: KeyboardEvent) {
    event.preventDefault();
    // next move 
    let p = this.moves(this.piece, event.key);
   
    // drop move on space event key
    if(event.key == ' ') {
      while(this.valid(p)) {
        this.piece.move(p);
        p = this.moves(this.piece, ' ');
        // add score
        this.points += Points.HARD_DROP;
      }
    }
     // is a valid move
    else if (this.valid(p)) {
      // apply move
      this.piece.move(p);
      
      // add score
      if (event.key == 'ArrowDown')
        this.points += Points.SOFT_DROP;
    }
  }

  moves(p :Piece, eventKey :string): Piece {
    let pCopy = Object.create(p);
    //deep copy of shape
    let oldShape = p.shape.map(y => y.map(x=>x));

    if(eventKey == 'ArrowLeft') 
      pCopy.x -= 1;
    else if(eventKey == 'ArrowRight')
      pCopy.x += 1;
    else if (eventKey == 'ArrowUp'){
      pCopy.rotate();
      if(this.valid(pCopy)===false)
        pCopy.shape=oldShape;
    }
    else if (eventKey == 'ArrowDown' || eventKey == ' ')
      pCopy.y += 1;

    return pCopy;
  }

  valid(p: IPiece): boolean {
    return p.shape.every((row, dy) => {
      return row.every((value, dx) => {
        let x = p.x + dx;
        let y = p.y + dy;
        return (this.isEmpty(value) 
        || (this.insideWalls(x) 
          && this.aboveFloor(y) 
          && this.notOccupied(this.board, x, y)));
      });
    });
  }

  isEmpty(value : number) {
    return value === 0;
  }

  insideWalls(x: number) {
    return x >= 0 && x < COLS;
  }

  aboveFloor(y: number) {
    return y < ROWS;
  }

  notOccupied(board: number[][], x: number, y: number): boolean {
    return this.isEmpty(board[y][x]);
  }
}