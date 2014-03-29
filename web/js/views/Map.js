define('MapView', [
	'createjs',
	'ViewConstants'
], function (createjs, ViewConstants) {
	var container;

	var Map = function() {

	};

	Map.prototype.initialize = function (assets, parent, mapId) {
		container = new createjs.Container();
		parent.addChild(container);
		
		var mapTiles = assets['map_data'][mapId].tiles;
		for (var i in mapTiles) {
			for (var j in mapTiles[i]) {
				if (0 === mapTiles[i][j]) {
					continue;
				}

				var bitmap = new createjs.Bitmap(assets['tile'+mapTiles[i][j]]);
				bitmap.y = ViewConstants.HUD_HEIGHT + i * ViewConstants.MAP_TILE_SIZE;
				bitmap.x = j * ViewConstants.MAP_TILE_SIZE;
				container.addChild(bitmap);
			}
		}
	};

	Map.prototype.update = function (data) {

	};

	return Map;

});
