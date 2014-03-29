
var KEYCODE_SPACE = 32,
	KEYCODE_LEFT = 37,
	KEYCODE_UP = 38,
	KEYCODE_RIGHT = 39,
	KEYCODE_A = 65,
	KEYCODE_D = 68,
	KEYCODE_W = 87,
	KEYCODE_T = 84,
	KEYCODE_G = 71;

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
	Movement.ACTION_PICKUP_TOY = 'pickupToy';
	Movement.ACTION_DROP_TOY = 'dropToy';

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
				case KEYCODE_UP:
				case KEYCODE_W:
					type = Movement.MOVEMENT_JUMP;
					break;

				case KEYCODE_LEFT:
				case KEYCODE_A:
					type = Movement.MOVEMENT_LEFT;
					break;

				case KEYCODE_RIGHT:
				case KEYCODE_D:
					type = Movement.MOVEMENT_RIGHT;
					break;

				case KEYCODE_T:
					type = Movement.ACTION_PICKUP_TOY;
					break;

				case KEYCODE_G:
					type = Movement.ACTION_DROP_TOY;
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

		var event = new createjs.Event('action');
		event.action = movement_type;
		event.state = state;

		this.dispatchEvent(event);
	};

	return Movement;
});
