var AbstractEventHandler = require('./AbstractEventHandler.js');

var PlayerEventHandler = function() {

};

PlayerEventHandler.prototype = AbstractEventHandler.prototype;
PlayerEventHandler.TYPE = 'player';

PlayerEventHandler.prototype.playerJoin = function(player) {
	var playerCopy = {};
	for (var key in player) {
		if (['socket', 'game', 'lobby'].indexOf(key) == -1) {
			playerCopy[key] = player[key];
		}
	}

	this.createBroadcastResponse(player, PlayerEventHandler.TYPE, {
		action: 'join',
		player: playerCopy
	}, false);
};

PlayerEventHandler.prototype.playerLeave = function(player) {
	this.createBroadcastResponse(player, PlayerEventHandler.TYPE, {
		action: 'leave',
		playerId: player.id
	}, false);
};

module.exports = PlayerEventHandler;