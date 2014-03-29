define('TopHudPlayerView', [
	'createjs',
	'ViewConstants'
], function (createjs, ViewConstants) {
	var container;

	var TopHudPlayer = function() {

	};

	TopHudPlayer.prototype.initialize = function (parent, player, i) {
		container = new createjs.Container();
		parent.addChild(container);

		var shape = new createjs.Shape();
		shape.graphics.beginFill("#444").drawRect(0, 0, ViewConstants.PLAYER_HUD_WIDTH, ViewConstants.HUD_HEIGHT);
		shape.x = i * ViewConstants.PLAYER_HUD_WIDTH + 50 * i;
		shape.y = 0;
		container.addChild(shape);
	};

	TopHudPlayer.prototype.update = function (player) {

	};

	return TopHudPlayer;

});
