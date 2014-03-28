var AbstractEventHandler = require('./AbstractEventHandler.js');

var PlayerEventHandler = function() {

};

PlayerEventHandler.prototype = AbstractEventHandler.prototype;
PlayerEventHandler.TYPE = 'player';

PlayerEventHandler.prototype.callNewPlayer = function(player) {
	this.createBroadcastResponse(player, PlayerEventHandler.TYPE, 'newPlayer', {
		'id': player.playerId,
		'x': 0,
		'y': 0
	}, false);
};

PlayerEventHandler.prototype.callPlayerLeft = function(player) {
	this.createBroadcastResponse(player, PlayerEventHandler.TYPE, 'playerLeft', {
		'id': player.playerId
	}, false);
};

module.exports = PlayerEventHandler;