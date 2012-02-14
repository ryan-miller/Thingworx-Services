var board = {
      grid : [],
      dimensions : {
         rows: 5,
         columns: 4
      },
      bombs: 5,
      initialize: function() {
         var totalcells = this.dimensions.columns*this.dimensions.rows;
         // initialize the array with "0" in all indexes
         var _grid = (new Array(totalcells).toString().replace(/,/g, "0,") + "0").split(",")
         
         var bombCount = 0;

         // bombs should only be created after revealing first cell
         // to ensure that every game has at least one safe move
         while (bombCount < this.bombs && this.bombs < totalcells) {
            
            randomElement = Math.floor(Math.random() * _grid.length);

            if (randomElement > 0 && _grid[randomElement] != "b") {
               _grid[randomElement] = "b";
               bombCount++;
            }
            
         }
         console.log(_grid);
         // the convert to 2d array
         
         
         
         // then, calculate each cell's bombsTouch
         
         return this;
         
      },
      restart: {
         // function
      },
      toString: function() {
         // function
        
         var s = "[\n";
         
         for (var i=0;i<this.grid.length; i++) {
            s+="["
            for (var j=0;j<this.grid[i].length; j++) {
               s += this.grid[i][j]+",";
            }
            s = s.substring(0,s.length-1);
            s+= "],\n";
         }
         s = s.substring(0,s.length-2);
         s+="\n]";
         
         return s;
         
      }
   },
   cell = {
      index : {
         row: 0,
         column: 0
      },
      isBomb : false,
      bombsTouch: 0,
      review : {
         // function
      }
   };
   
var newBoard = board.initialize();
//alert(newBoard.toString());
/*var getUniqueRandoms = function(b) {
   console.log(b.bombs); 
   console.log()
};*/

//getUniqueRandoms(newBoard);




