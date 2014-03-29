
var KEYCODE_SPACE = 32,
	KEYCODE_LEFT = 37,
	KEYCODE_RIGHT = 39;

define([
	'createjs'
], function(createjs) {
	var movement_states = {
		MOVEMENT_LEFT: false,
		MOVEMENT_RIGHT: false,
		MOVEMENT_JUMP: false

	};

	var Movement = function() {};

	Movement.MOVEMENT_LEFT = 'moveLeft';
	Movement.MOVEMENT_RIGHT = 'moveRight';
	Movement.MOVEMENT_JUMP = 'jump';

	createjs.EventDispatcher.initialize(Movement.prototype);

	Movement.prototype.initialize = function() {
		console.log('movement init');

		document.onkeydown = onKey(this);
		document.onkeyup = onKey(this);
	};

	var onKey = function(scope) {
		return function(event) {
			var type;

			switch(event.keyCode) {
				case KEYCODE_SPACE:
					type = Movement.MOVEMENT_JUMP;
					break;

				case KEYCODE_LEFT:
					type = Movement.MOVEMENT_LEFT;
					break;

				case KEYCODE_RIGHT:
					type = Movement.MOVEMENT_RIGHT;
					break;
			}

			if (type) {
				scope.changeMovement(type, event.type === 'keydown');
			}
		}
	};

	Movement.prototype.changeMovement = function(movement_type, state) {
		if (movement_states[movement_type] === state) {
			return;
		}

		movement_states[movement_type] = state;

		var event = new createjs.Event('movement');
		event.data = {
			'type': movement_type,
			'state': state
		};

		this.dispatchEvent(event);
	};

	return Movement;
});
