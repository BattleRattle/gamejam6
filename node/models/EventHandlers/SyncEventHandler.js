var AbstractEventHandler = require('./AbstractEventHandler.js');

var SyncEventHandler = function() {

};

SyncEventHandler.prototype = AbstractEventHandler.prototype;
SyncEventHandler.TYPE = 'sync';

SyncEventHandler.prototype.start = function(game) {
	this.createBroadcastResponse(null, SyncEventHandler.TYPE, {
		tick: game.tick,
		players: extractPlayerData(game.players)
	});
};

function extractPlayerData(players) {
	var data = [];
	for (var i in players) {
		var player = {};
		for (var key in players[i]) {
			if (['socket', 'game', 'lobby'].indexOf(key) == -1) {
				player[key] = players[i][key];
			}
		}
		data.push(player);
	}

	return data;
}

module.exports = SyncEventHandler;