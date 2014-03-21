function AI() {
    // constants
    this.up = 0;
    this.right = 1;
    this.down = 2;
    this.left = 3;

    this.build_up = 'building_up';
    this.random = 'random';

    this.state;
    this.setup();
}

AI.prototype.setup = function() {
    this.state = this.build_up;
};

AI.prototype.move = function(grid, last_move_effect) {
    if (this.state === this.build_up) {
	this.state = this.random;
	return this.up;

    } else if (this.state === this.random) {
	this.state = this.build_up;
	return Math.floor(Math.random() * 4);
    }
};
