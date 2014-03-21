/** Runs the ai */
function Zeus() {
    // visual delay between moves. For fun and debug.
    var delay = 300;

    // holds true if the last move changed the grid layout.
    // holds false if the last move did nothing.
    var last_move_effect = null;
}

/** returns an array of columns, where each column is an array of
 * values in each row. Empty cells are null. The position [0][0] is
 * the top left corner. */
Zeus.prototype.makegrid = function(gm) {
    var grid = [[], [], [], []]
    for (var col = 0; col < gm.grid.size; col++) {
	for (var row = 0; row < gm.grid.size; row++) {
	    var value = null;
	    var cell = gm.grid.cells[col][row]
	    if (cell !== null) {
		value = cell.value
	    }
	    grid[col].push(value);
	}
    }
    return grid
};

Zeus.prototype.main = function(gm, ai) {
    var self = this;
    if (!gm.over) {
	self.last_move_effect = gm.move(ai.move(self.makegrid(gm), 
						self.last_move_effect));
	setTimeout(function() {
		self.main(gm, ai);
	    }, 300);
    }
};

// Wait till the browser is ready to render the game (avoids glitches)
var gm;
var ai;
var zeus;
window.requestAnimationFrame(function () {
	gm = new GameManager(4, KeyboardInputManager, HTMLActuator, LocalScoreManager);
	ai = new AI(4);
	zeus = new Zeus();
	zeus.main(gm, ai);
});
