var AbstractEventHandler = require('./AbstractEventHandler.js');

var PlayerEventHandler = function() {

};

PlayerEventHandler.prototype = AbstractEventHandler.prototype;
PlayerEventHandler.TYPE = 'player';

PlayerEventHandler.prototype.callNewPlayer = function(player) {
	var playerCopy = {};
	for (var key in player) {
		if (key !== 'socket') {
			playerCopy[key] = player[key];
		}
	}

	this.createBroadcastResponse(player, PlayerEventHandler.TYPE, {
		action: 'join',
		player: playerCopy
	}, false);
};

PlayerEventHandler.prototype.callPlayerLeft = function(player) {
	this.createBroadcastResponse(player, PlayerEventHandler.TYPE, {
		action: 'leave',
		playerId: player.id
	}, false);
};

module.exports = PlayerEventHandler;