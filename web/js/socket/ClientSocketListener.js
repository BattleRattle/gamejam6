
define('ClientSocketListener', [
	'Socket',
	'Movement',
	'LobbyClientListener'
], function(Socket, Movement, LobbyClientListener) {

	var Listener = function() {};

	Listener.prototype.initialize = function (callback) {
		Movement.prototype.addEventListener('action', function(event) {
			console.log('action')
			callback('action', event);
		});

		var lobby = new LobbyClientListener();
		lobby.initialize(callback);
	};


	return Listener;

});
