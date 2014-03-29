
var KEYCODE_SPACE = 32,
	KEYCODE_LEFT = 37,
	KEYCODE_RIGHT = 39;

define([
	'createjs'
], function(createjs) {
	var Movement = function() {};

	createjs.EventDispatcher.initialize(Movement.prototype);

	Movement.prototype.initialize = function() {
		console.log('movement init');

		document.onkeydown = onkeydown(this);
		document.onkeyup = onkeyup(this);
	};

	var onkeydown = function(scope) {
		return function(event) {
			switch(event.keyCode) {
				case KEYCODE_SPACE:
					scope.dispatchEvent('space_down');
					break;

				case KEYCODE_LEFT:
					scope.dispatchEvent('left_down');
					break;

				case KEYCODE_RIGHT:
					scope.dispatchEvent('right_down');
					break;
			}
		}
	};

	var onkeyup = function(scope) {
		return function(event) {
			switch(event.keyCode) {
				case KEYCODE_SPACE:
					scope.dispatchEvent('space_up');
					break;

				case KEYCODE_LEFT:
					scope.dispatchEvent('left_up');
					break;

				case KEYCODE_RIGHT:
					scope.dispatchEvent('right_up');
					break;
			}
		}
	};

	return Movement;
});
