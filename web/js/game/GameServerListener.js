
define('GameServerListener', [
	'createjs'
], function(createjs) {

	var Listener = function() {};

	createjs.EventDispatcher.initialize(Listener.prototype);

	Listener.prototype.initialize = function (socket, handler) {
		socket.socket.on('message', function(event) {
			event = JSON.parse(event);
			if ('tick' === event['type']) {
				if (handler['tick']) {
					handler['tick'](event);
				}
			} else if ('sync' === event['type']) {
				if (handler['sync']) {
					handler['sync'](event);
				}
			} else if ('game' === event['type']) {
				if (handler[event.event.action]) {
					handler[event.event.action](event);
				}
			} else if ('action' === event['type']) {
				if (handler[event.event.action]) {
					handler[event.event.action](event);
				}
			}
		});
	};

	return Listener;

});
