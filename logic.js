var SYMBOLS = {
	CIRCLE: "<svg class='circle' viewBox='0 0 128 128'><path d='M64,16A48,48 0 1,0 64,112A48,48 0 1,0 64,16'></path></svg>",
	CROSS: "<svg class='cross' viewBox='0 0 128 128'><path d='M16,16L112,112'></path><path d='M112,16L16,112'></path></svg>",
	TIE: "<svg class='circle' viewBox='0 0 128 128'><path d='M64,16A48,48 0 1,0 64,112A48,48 0 1,0 64,16'></path></svg>" +
		 "<svg class='cross' viewBox='0 0 128 128'><path d='M16,16L112,112'></path><path d='M112,16L16,112'></path></svg>",
};

var MESSAGES = {
	CIRCLE: "CIRCLE wins!",
	CROSS: "CROSS wins!",
	TIE: "It's a TIE!"
};

/* Game's state */
var GAME = {
	
	TURN: true,
	
	BOARD: [[0,0,0],
			[0,0,0],
			[0,0,0]],
	
	PIECES: 0,

	RESULT: "TIE",
	
	/* 'checkSum': Returns 'true' if a player has won the game */
	checkSum: function(sum) {
		if (sum === 3) {
			this.RESULT = "CIRCLE";
			return true;
		}
		else if (sum === -3) {
			this.RESULT = "CROSS";
			return true;
		}
		else { return false; }
	},
	
	/* 'checkGame': Returns 'true' if the game has been won by someone */
	checkGame: function() {
		// Column and row check
		for (var i = 0; i < 3; ++i) {
			// Row
			var res_row = this.checkSum( this.BOARD[0][i] + this.BOARD[1][i] + this.BOARD[2][i] );
			
			// Column
			var res_col = this.checkSum( this.BOARD[i][0] + this.BOARD[i][1] + this.BOARD[i][2] );
			
			// Resul
			if (res_row || res_col) { return true; }
		}
		
		// Main diagonal
		if ( this.checkSum( this.BOARD[0][0] + this.BOARD[1][1] + this.BOARD[2][2] ) ) { return true; }
		
		// Other diagonal
		if ( this.checkSum( this.BOARD[0][2] + this.BOARD[1][1] + this.BOARD[2][0] ) ) { return true; }
		
		// No winner
		return false;
	},
	
	/* 'putPiece': Puts a 'piece' inside the cell */
	putPiece: function(square) {
		// Get 'row' and 'col' from the element
		var row = square.getAttribute("data-row");
		var col = square.getAttribute("data-col");
		
		// Circle
		if (this.TURN) {
			square.innerHTML = SYMBOLS.CIRCLE;
			this.BOARD[row][col]++;
		}
		// Cross
		else {
			square.innerHTML = SYMBOLS.CROSS;
			this.BOARD[row][col]--;
		}
		
		// Count piece number
		++this.PIECES;
		
		// Switch turns
		this.TURN = !this.TURN;
	},
	
	/* 'isFinished': Returns 'true' if all the cells have been chosen */
	isFinished: function() { return this.PIECES === 9; }
};

/**
 * Main functions
 */

/* 'onGameFinished': Builds and shows the 'end of game' message. */
function onGameFinished() {
	// Player
	var text = document.getElementById("result-text");
	text.innerHTML = MESSAGES[GAME.RESULT];
	
	// Symbol
	var symbol = document.getElementById("result-symbol");
	symbol.innerHTML = SYMBOLS[GAME.RESULT];
	
	// Show container
	var modal = document.getElementById("modal");
	modal.classList.add("visible");
}

/* 'onSquareClick': Places the piece inside the cell. */
function onSquareClick() {
	// Place the piece.
	GAME.putPiece(this);

	// Check the game
	if ( GAME.checkGame() || GAME.isFinished() ) { setTimeout(onGameFinished, 300); }

	// Remove the "event listener".
	this.removeEventListener("click", onSquareClick);
}

window.onload = function() {
	// Add the "event listener" to each cell.
	var list = document.getElementsByClassName("square");

	for (var i = 0; i < list.length; ++i) {
		list.item(i).addEventListener("click", onSquareClick);
	}

	// New game "event listener" (reloads the page)
	var button = document.getElementById("newGameButton");
	button.addEventListener("click", function() { window.location.reload(false); });
};