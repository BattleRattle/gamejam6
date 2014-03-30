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

		var mapData = assets['map_data'][mapId],
			deco,
			bitmap,
			mapTiles = mapData.tiles,
			i;
		for (i in mapData.deco) {
			deco = mapData.deco[i];
			bitmap = new createjs.Bitmap(assets[deco.type]);
			bitmap.y = ViewConstants.HUD_HEIGHT - ViewConstants.MAP_TOP_OFFSET + (1 + deco.position.y) * ViewConstants.MAP_TILE_HEIGHT + 95 - bitmap.image.height;
			bitmap.x = ViewConstants.MAP_TILE_WIDTH * deco.position.x + 50;
			if (deco.position.y == 2) {
				bitmap.y += 20;
			}
			container.addChild(bitmap);
		}

		for (i in mapTiles) {
			for (var j in mapTiles[i]) {
				if (0 === mapTiles[i][j]) {
					continue;
				}

				bitmap = new createjs.Bitmap(assets['tile'+mapTiles[i][j]]);
				bitmap.y = ViewConstants.HUD_HEIGHT - ViewConstants.MAP_TOP_OFFSET + i * ViewConstants.MAP_TILE_HEIGHT;
				bitmap.x = j * ViewConstants.MAP_TILE_WIDTH;
				container.addChild(bitmap);
			}
		}

		bitmap = new createjs.Bitmap(assets['stage_bottom']);
		bitmap.y = ViewConstants.HUD_HEIGHT + i * ViewConstants.MAP_TILE_HEIGHT + ViewConstants.MAP_TILE_HEIGHT + ViewConstants.MAP_TOP_OFFSET;
		container.addChild(bitmap);
	};

	Map.prototype.update = function (data) {

	};

	return Map;

});
