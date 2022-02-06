class Maze {
    constructor(width, height) {
        this.length = width * height;
        this.width = width;
        this.height = height;
        this.visited = 0;
	    this.current_x = 0;
	    this.current_y = 0;
	    this.choices = 0;
	    this.directions = 0;
	    this.direction = 0;
        this.start_x = 0;
        this.start_y = 0;
        this.cells = new Array(this.length);
        this.completeCells = new Array(this.length);
        this.order = new Array(this.length);
	}

    generate() {
		
		this.visited = this.length - 1;
		this.current_x = 0;
		this.current_y = 0;
		this.choices = 2;
		this.directions = 6;
		this.direction = 0;
		this.start_x = 0;
		this.start_y = 0;
		
		for (let i = 0; i < this.length; i++)
            this.cells[i] = 0;

        while (this.visited > 0) {
            
            if (this.choices == 0) 
                this.jumpToNewPosition();
            this.selectDirection();
            this.moveInDirection();
            this.investigateCurrentPosition();

            this.visited--;

            let offset = this.getOffset( this.current_x, this.current_y );                        	
            let step = (this.length - 1) - this.visited;
            this.order[step] = offset;
        }

        // saves a maze copy, so we can run Ariadne on cells array
        for (let i = 0; i < this.length; i++)
            this.completeCells[i] = this.cells[i];    
	}
	
	jumpToNewPosition()
	{  
	    for (let y = this.start_y; y < this.height; y++) {
	    	for (let x = this.start_x; x < this.width; x++) {
	    		this.current_x = x;
	    		this.current_y = y;
	    		this.investigateCurrentPosition();
	    		if ((this.positionVisited(0, 0) != false) && (this.choices > 0) ) {
	    			this.start_x = x;
	    			return;
	    		}
	    	}
	    	this.start_x = 0;
	    	this.start_y = y + 1;
	    }
	    this.visited = 0;
	}
	
	moveInDirection()
	{
		let offset = this.getOffset( this.current_x, this.current_y );
		
		if (this.direction == 1) {
			this.cells[offset] |= 1;		
			this.current_y--;
			offset = this.getOffset( this.current_x, this.current_y );
			this.cells[ offset ] |= 4;
		}
		else if (this.direction == 2) {
			this.cells[offset] |= 2;
			this.current_x++;
			offset = this.getOffset( this.current_x, this.current_y );
			this.cells[offset] |= 8;
		}
		else if (this.direction == 3) {
			this.cells[offset] |= 4;
			this.current_y++;
			offset = this.getOffset( this.current_x, this.current_y );
			this.cells[offset] |= 1;
		}
		else if (this.direction == 4) {
			this.cells[offset] |= 8;
			this.current_x--;
			offset = this.getOffset( this.current_x, this.current_y );
			this.cells[offset] |= 2;
		}
	}
	
	investigateCurrentPosition()
	{
		this.directions = 0;
		this.choices = 0;
		this.direction = 0;
	
		if ((this.current_y > 0) && (!this.positionVisited(0,-1))) {
			this.choices++;
			this.directions |= 1;
		}

		if ((this.current_x < (this.width -1 )) && (!this.positionVisited(1,0))) {
			this.choices++;
			this.directions |= 2;
		}    

		if ((this.current_y < (this.height - 1)) && (!this.positionVisited(0,1))) {
			this.choices++;
			this.directions |= 4;
		}

		if ((this.current_x > 0) && (!this.positionVisited(-1,0))) {
			this.choices++;
			this.directions |= 8;
		}
    
	}
	
	positionVisited(x, y ) {
		if (this.cells[ this.getOffset( this.current_x + x, this.current_y +  y ) ] != 0)
			return true;
		else
			return false;
	}
	
	getOffset(x, y) {
		return ((this.width * y) +  x);
	}
	
	selectDirection() {
		const directionsList = new Array(this.choices);
		let pos = 0;
		let pos2;
		
		if (this.choices == 0)
			return;
			
		if ((this.directions & 1) != 0) {
			directionsList[pos] = 1;
			pos++;
		}
		if ((this.directions & 2) != 0) {
			directionsList[pos] = 2;
			pos++;
		}
		if ((this.directions & 4) != 0) {
			directionsList[pos] = 3;
			pos++;
		}
		if ((this.directions & 8) != 0) {
			directionsList[pos] = 4;
			pos++;
		}
		
		pos2 = Math.floor( fxrand() * this.choices );
		this.direction = directionsList[ pos2 ];
	}
}

export default Maze;