
define('Socket', [
	'socketio',
	'Movement'
], function(socketio, Movement) {
	var socket;

	var Socket = function() {};

	Socket.ACTION_PICKUP_TOY = 'pickupToy';
	Socket.ACTION_DROP_TOY = 'dropToy';

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
