var AbstractEventHandler = require('./AbstractEventHandler.js');

var GameEventHandler = function() {

};

GameEventHandler.prototype = AbstractEventHandler.prototype;
GameEventHandler.TYPE = 'game';

GameEventHandler.prototype.start = function(game) {
	this.createBroadcastResponse(null, GameEventHandler.TYPE, {
		action: 'start',
		gameId: game.id
	})
};

GameEventHandler.prototype.end = function(player, event) {
	this.createBroadcastResponse(null, GameEventHandler.TYPE, {
		action: 'end'
	});
};

module.exports = GameEventHandler;