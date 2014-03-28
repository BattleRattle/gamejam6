
define('Socket', [
	'socketio'
], function(socketio) {
	var Socket = function() {};

	Socket.prototype.initialize = function() {
		var socket = socketio.connect();
	};

	return Socket;

});
