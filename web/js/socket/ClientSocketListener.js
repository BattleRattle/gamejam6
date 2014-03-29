
define('ClientSocketListener', [
	'Socket',
	'Movement',
	'LobbyClientListener'
], function(Socket, Movement, LobbyClientListener) {

	var Listener = function() {};

	Listener.prototype.initialize = function (callback) {
		Movement.prototype.addEventListener('movement', function(event) {
			callback('action', event);
		});

		var lobby = new LobbyClientListener();
		lobby.initialize(callback);
	};


	return Listener;

});
