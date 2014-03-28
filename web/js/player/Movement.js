
var KEYCODE_SPACE = 32,
	KEYCODE_LEFT = 37,
	KEYCODE_RIGHT = 39;

define([
	'createjs'
], function(createjs) {
	var Movement = function() {};

	Movement.prototype.initialize = function() {
		console.log('movement init');

		document.onkeydown = onkeydown;
		document.onkeyup = onkeyup;
	};

	var onkeydown = function(event) {
		switch(event.keyCode) {
			case KEYCODE_SPACE:
				console.log('space down');
				break;

			case KEYCODE_LEFT:
				console.log('left down');
				break;

			case KEYCODE_RIGHT:
				console.log('right down');
				break;
		}
	};

	var onkeyup = function(event) {
		switch(event.keyCode) {
			case KEYCODE_SPACE:
				console.log('space up');
				break;

			case KEYCODE_LEFT:
				console.log('left up');
				break;

			case KEYCODE_RIGHT:
				console.log('right up');
				break;
		}
	};

	return Movement;
});
