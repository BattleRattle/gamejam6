
define('Socket', [
	'socketio',
	'ClientSocketListener'
], function(socketio, ClientSocketListener) {
	var socket;

	var Socket = function() {};

	Socket.prototype.initialize = function() {
		this.socket = socket = socketio.connect();
		var clientListener = new ClientSocketListener();
		clientListener.initialize(this.sendEvent);
	};

	Socket.prototype.sendEvent = function(type, event) {
		socket.send(JSON.stringify({
			type: type,
			'event': event
		}));
	};

	return Socket;

});
