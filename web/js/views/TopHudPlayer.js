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
	};

	TopHudPlayer.prototype.update = function (player) {

	};

	return TopHudPlayer;

});
