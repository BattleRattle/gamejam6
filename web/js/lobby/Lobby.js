define('Lobby', [
	'createjs'
], function (createjs) {

	var Lobby = function() {

	};

	createjs.EventDispatcher.initialize(Lobby.prototype);

	Lobby.prototype.initialize = function (monsterId) {
		// tell the backend that we are ready for some action
		var event = new createjs.Event('lobby.enter');
		event.data = {
			action: 'enter',
			monsterId: monsterId
		};
		this.dispatchEvent(event);

		event = new createjs.Event('lobby.create');
		event.data = {
			action: 'create'
		};
		this.dispatchEvent(event);
	};

	return Lobby;
});
