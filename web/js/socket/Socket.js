
define('Socket', [
	'socketio',
	'Movement'
], function(socketio, Movement) {
	var socket;

	var Socket = function() {};

	Socket.ACTION_MOVE_LEFT = 'moveLeft';
	Socket.ACTION_MOVE_RIGHT = 'moveRight';
	Socket.ACTION_JUMP = 'jump';
	Socket.ACTION_PICKUP_TOY = 'pickupToy';
	Socket.ACTION_DROP_TOY = 'dropToy';

	Socket.STATE_ACTIVATE = 'activate';
	Socket.STATE_DEACTIVATE = 'deactivate';

	Socket.prototype.initialize = function() {
		var self = this;
		socket = socketio.connect();

		Movement.prototype.addEventListener('movement', function(event) {
			self.sendActionEvent(event.data.type, event.data.state);
		});
	};

	Socket.prototype.sendActionEvent = function(action, state) {
		socket.send(JSON.stringify({
			type: 'action',
			'event': {
				action: action,
				state: state
			}
		}));
	};

	return Socket;

});
