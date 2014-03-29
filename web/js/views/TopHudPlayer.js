define('TopHudPlayerView', [
	'createjs',
	'ViewConstants'
], function (createjs, ViewConstants) {
	var container;

	var TopHudPlayer = function() {

	};

	TopHudPlayer.prototype.initialize = function (assets, parent, player, i) {
		container = new createjs.Container();
		parent.addChild(container);

		var bitmap = new createjs.Bitmap(assets['temp_top_hud']);
		bitmap.x = i * ViewConstants.PLAYER_HUD_WIDTH + 8 * i;
		container.addChild(bitmap);

		var data = assets['monster_data'][player.monsterId];
		var label = new createjs.Text(data.name.toUpperCase(), "20px Arial", "#fff");
		label.x = i * ViewConstants.PLAYER_HUD_WIDTH + 8 * i + 50;
		label.y = 135;
		container.addChild(label);
	};

	TopHudPlayer.prototype.update = function (player) {

	};

	return TopHudPlayer;

});
