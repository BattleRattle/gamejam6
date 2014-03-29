define('Lobby', [
	'createjs'
], function (createjs) {

	var Lobby = function() {

	};

	createjs.EventDispatcher.initialize(Lobby.prototype);

	Lobby.prototype.initialize = function (monsterId) {
		// tell the backend that we are ready for some action
		var event = new createjs.Event('lobby.enter');
		event.action = 'enter';
		event.monsterId = monsterId;
		this.dispatchEvent(event);
	};

	Lobby.prototype.joinGame = function (gameId) {
		var event = new createjs.Event('lobby.join');
		event.action = 'join';
		event.gameId = gameId;
		this.dispatchEvent(event);
	};

	Lobby.prototype.createGame = function (isSingle) {
		var event = new createjs.Event('lobby.create');
		event.action = 'create';
		event.slots = isSingle ? 1 : 3;
		this.dispatchEvent(event);
	};

	return Lobby;
});
