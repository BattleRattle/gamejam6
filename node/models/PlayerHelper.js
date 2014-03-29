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

module.exports = {
	extractPlayerData: extractPlayerData
};