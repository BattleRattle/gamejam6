var AbstractEventHandler = require('./AbstractEventHandler.js');

var PlayerEventHandler = function() {

};

PlayerEventHandler.prototype = AbstractEventHandler.prototype;
PlayerEventHandler.TYPE = 'player';

PlayerEventHandler.prototype.callNewPlayer = function(player) {
	this.createBroadcastResponse(player, PlayerEventHandler.TYPE, {
		action: 'join',
		player: player
	}, false);
};

PlayerEventHandler.prototype.callPlayerLeft = function(player) {
	this.createBroadcastResponse(player, PlayerEventHandler.TYPE, {
		action: 'leave',
		playerId: player.id
	}, false);
};

module.exports = PlayerEventHandler;