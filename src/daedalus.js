class Daedalus
{
    constructor(maze, edge, sourceCanvas, targetCanvas) {
        this.maze = maze;
        this.edge = edge;
        this.step = 0;
        this.finished = false
        this.sourceCanvas = sourceCanvas;
        this.targetCanvas = targetCanvas;
        this.sourceContext = sourceCanvas.getContext('2d');
        this.targetContext = targetCanvas.getContext('2d');

        this.paintCell( 0, 0 );
    }
  
    drawStep() {
    
        let cell = this.maze.order[ this.step ];
        let x = cell % this.maze.width;
        let y = Math.floor(cell / this.maze.width);
        
        if ((this.maze.completeCells[ this.maze.getOffset(x, y) ] & 1) != 0) {
            this.paintCell( (x * 2) + 1, y * 2 );
        }
        
        if ((this.maze.completeCells[ this.maze.getOffset(x, y) ] & 8) != 0) {
            this.paintCell( x * 2, (y * 2) + 1);
            this.paintCell( (x * 2) + 1, (y * 2) + 1);
        }
        else {
            this.paintCell( (x*2)+1, (y*2)+1);
        }
        
        ++this.step;
        
        this.finished = !(this.step < (this.maze.order.length));
    }  
  
    paintCell( x, y )
    {
        this.targetContext.drawImage(this.sourceCanvas, (x * this.edge), (y * this.edge), this.edge + 1, this.edge + 1, (x * this.edge), (y * this.edge), this.edge + 1, this.edge + 1);
    }
}

export default Daedalus;