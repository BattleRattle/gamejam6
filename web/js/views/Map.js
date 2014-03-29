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

		bitmap = new createjs.Bitmap(assets['steine']);
		bitmap.y = ViewConstants.HUD_HEIGHT - ViewConstants.MAP_TOP_OFFSET + 2 * ViewConstants.MAP_TILE_HEIGHT - 75;
		bitmap.x = ViewConstants.MAP_TILE_WIDTH * 2.5;
		container.addChild(bitmap);
		
		var mapTiles = assets['map_data'][mapId].tiles,
			bitmap;
		for (var i in mapTiles) {
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

		bitmap = new createjs.Bitmap(assets['maedchen']);
		bitmap.y = ViewConstants.HUD_HEIGHT - ViewConstants.MAP_TOP_OFFSET - 125;
		bitmap.x = ViewConstants.MAP_TILE_WIDTH - 100;
		container.addChild(bitmap);

		bitmap = new createjs.Bitmap(assets['roboter']);
		bitmap.y = ViewConstants.HUD_HEIGHT - ViewConstants.MAP_TOP_OFFSET;
		bitmap.x = ViewConstants.MAP_TILE_WIDTH + 150;
		container.addChild(bitmap);

		bitmap = new createjs.Bitmap(assets['boot']);
		bitmap.y = ViewConstants.HUD_HEIGHT - ViewConstants.MAP_TOP_OFFSET;
		bitmap.x = ViewConstants.MAP_TILE_WIDTH + 110;
		container.addChild(bitmap);

		bitmap = new createjs.Bitmap(assets['teddy']);
		bitmap.y = ViewConstants.HUD_HEIGHT - ViewConstants.MAP_TOP_OFFSET;
		bitmap.x = ViewConstants.MAP_TILE_WIDTH + 90;
		container.addChild(bitmap);

		bitmap = new createjs.Bitmap(assets['roboter']);
		bitmap.y = ViewConstants.HUD_HEIGHT - ViewConstants.MAP_TOP_OFFSET + 20;
		bitmap.x = ViewConstants.MAP_TILE_WIDTH + 50;
		bitmap.rotation = -25;
		container.addChild(bitmap);

		bitmap = new createjs.Bitmap(assets['teddy']);
		bitmap.y = ViewConstants.HUD_HEIGHT - ViewConstants.MAP_TOP_OFFSET - 25;
		bitmap.x = ViewConstants.MAP_TILE_WIDTH + 75;
		bitmap.rotation = 45;
		container.addChild(bitmap);
	};

	Map.prototype.update = function (data) {

	};

	return Map;

});
