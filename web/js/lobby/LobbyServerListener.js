
define('LobbyServerListener', [
	'createjs'
], function(createjs) {

	var Listener = function() {};

	createjs.EventDispatcher.initialize(Listener.prototype);

	Listener.prototype.initialize = function (socket, handler) {
		socket.socket.on('message', function(event) {
			event = JSON.parse(event);
			if ('lobby' === event['type']) {
				if (handler[event.action]) {
					handler[event.action](event);
				}
			}
		});
	};

	return Listener;

});
