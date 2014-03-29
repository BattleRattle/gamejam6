
define('LobbyClientListener', [
	'createjs',
	'Lobby'
], function(createjs, Lobby) {

	var Listener = function() {};

	createjs.EventDispatcher.initialize(Listener.prototype);

	Listener.prototype.initialize = function (callback) {
		Lobby.prototype.addEventListener('lobby.enter', function(event) {
			callback('lobby', event);
		});

		Lobby.prototype.addEventListener('lobby.create', function(event) {
			callback('lobby', event);
		});

		Lobby.prototype.addEventListener('lobby.join', function(event) {
			callback('lobby', event);
		});

		Lobby.prototype.addEventListener('lobby.leave', function(event) {
			callback('lobby', event);
		});
	};


	return Listener;

});
