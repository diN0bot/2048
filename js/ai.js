function AI() {
    // constants
    this.up = 0;
    this.right = 1;
    this.down = 2;
    this.left = 3;

    // phases
    this.phases = {populate_right_col: 'populate_right_col',
		   build_numbers_to_collapse: 'build_numbers_to_collapse',
		   shake_it_up: 'shake_it_up'};

    // state changes
    this.phase;
    // record of past. a list with most recent elements last.
    // { move: 0-3, effect: t/f, from: <phase>, to: <phase> }
    this.past;
    this.setup();
}

AI.prototype.can_collapse_right = function(grid) {
    for (var c = 0; c < 3; c++) {
	for (var r = 0; r < 4; r++) {
	    // check if neighbors along row match
	    if (grid[c][r] !== null &&
		grid[c+1][r] !== null &&
		grid[c][r] === grid[c+1][r]) {
		return true;
	    }
	    // check if cell with value has empty cell to right
	    if (grid[c][r] !== null &&
		grid[c+1][r] === null) {
		return true;
	    }
	}
    }
    return false;
};

AI.prototype.can_collapse_down = function(grid) {
    for (var c = 0; c < 4; c++) {
	for (var r = 0; r < 3; r++) {
	    // check if neighbors along col match
	    if (grid[c][r] !== null &&
		grid[c][r+1] !== null &&
		grid[c][r] === grid[c][r+1]) {
		return true;
	    }
	    // check if cell with value has empty cell below
	    if (grid[c][r] !== null &&
		grid[c][r+1] === null) {
		return true;
	    }
	}
    }
    return false;
};

AI.prototype.can_collapse_up = function(grid) {
    for (var c = 0; c < 4; c++) {
	for (var r = 0; r < 3; r++) {
	    // check if neighbors along col match
	    if (grid[c][r] !== null &&
		grid[c][r+1] !== null &&
		grid[c][r] === grid[c][r+1]) {
		return true;
	    }
	    // check if cell with value has empty cell above
	    if (grid[c][r] === null &&
		grid[c][r+1] !== null) {
		return true;
	    }
	}
    }
    return false;
};

AI.prototype.right_col_solid = function(grid) {
    return !(null === grid[3][0] ||
	     null === grid[3][1] ||
	     null === grid[3][2] ||
	     null === grid[3][3] ||
	     grid[3][0] === grid[3][1] ||
	     grid[3][1] === grid[3][2] ||
	     grid[3][2] === grid[3][3]);
};

AI.prototype.keep_on_doing_it = function(dir1) {
    if (this.did() !== dir1) {
	return dir1
    } else {
	if (this.changed()) {
	    return this.did();
	} else {
	    return this.down;
	}
    }
};

AI.prototype.keep_on_doing_then_switching = function(dir1, dir2) {
    if (this.did() !== dir1 && this.did() !== dir2) {
	return dir1
    } else {
	if (this.changed()) {
	    return this.did();
	} else {
	    if (!this.changed(2)) {
		return this.down;
	    } else {
		if (this.did() === dir1) {
		    return dir2;
		} else if (this.did() === dir2) {
		    return dir1;
		}
	    }
	}
    }
};

AI.prototype.highest = function(grid) {
    var highest = 0;
    for (var c = 0; c < 4; c++) {
	for (var r = 0; r < 4; r++) {
	    if (grid[c][r] !== null && grid[c][r] > highest) {
		highest = grid[c][r];
	    }
	}
    }
    console.log("highest "+highest);
    return highest;
}

AI.prototype.move = function(grid, last_move_effect) {
    // next move to return
    var move;
    // starting phase
    var from = this.phase;
    this.record_effect(last_move_effect);

    if (this.past.length === 0) {
	console.log("BASE CASE 0");
	move = this.up;
    } else if (this.past.length === 1) {
	console.log("BASE CASE 1");
	move = this.right;
    } else {
	// if right column is not solid, make it solid (collapse right and up)
	if (!this.right_col_solid(grid)) {
	    console.log("right column is not solid");

	    // if the last move was a down and the highest number is above 16, go up!!
	    if (this.did() === this.down && this.highest(grid) > 8) {
		move = this.up;
	    }
	    // if the last move was a left and the highest number is above 16, go right!!
	    else if (this.did() === this.left && this.highest(grid) > 8) {
		move = this.right;
	    }
	    // else build it up
	    else {
		move = this.keep_on_doing_then_switching(this.right, this.up);
	    }
	}
	// check what would be more monotonic
	

	// else if can collapse right do that
	else if (this.can_collapse_right(grid)) {
	    console.log("can collapse right");
	    move = this.right;
	}
	// else if can collapse up do that
	else if (this.can_collapse_up(grid)) {
	    console.log("can collapse up");
	    move = this.up;
	}
	// else if can collapse down do that
	else if (this.can_collapse_down(grid)) {
	    console.log("can collapse down");
	    move = this.down;
	}
	// else go left :-(
	else {
	    move = this.left;
	}
    }

    this.record_move(move, from, this.phase);
    return move;
};


AI.prototype.setup = function() {
    this.phase = this.phases.populate_right_col;
    this.past = [];
};

AI.prototype.record_effect = function(last_move_effect) {
    if (this.past.length > 0) {
	this.past[this.past.length - 1].effect = last_move_effect;
    }
};

AI.prototype.record_move = function(move, from, to) {
    this.past.push({move: move,
		    effect: null,
		    from: from,
		    to: to
	});
};

AI.prototype.was = function(phase, ago) {
    return (this.past[this.idx(ago)].from === phase)
};

AI.prototype.did = function(ago) {
    return this.past[this.idx(ago)].move;
};

// to check if last move had effect, use changed(1) or changed()
// to check if move before last had effect, use changed(2)
AI.prototype.changed = function(ago) {
    return this.past[this.idx(ago)].effect;
};

AI.prototype.idx = function(ago) {
    var idx = this.past.length - 1;
    if (undefined !== ago) {
	idx = idx - ago + 1;
    }
    return idx;
};
