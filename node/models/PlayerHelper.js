function extractPlayerData(players) {
	var data = [];
	for (var i in players) {
		var player = {};
		for (var key in players[i]) {
			if (['socket', 'game', 'lobby', 'toy'].indexOf(key) == -1) {
				player[key] = players[i][key];
			}
			player.toy = players[i].toy ? extractToy(players[i].toy) : null;
		}
		data.push(player);
	}

	return data;
}

function extractToy(toy) {
	var cleared = {};

	for (var key in toy) {
		if (['owner'].indexOf(key) == -1) {
			cleared[key] = toy[key];
		}
	}

	return cleared;
}

module.exports = {
	extractPlayerData: extractPlayerData
};