define('TopHudPlayerView', [
	'createjs'
], function (createjs) {
	var container;

	var CONTENT_WIDTH = 1600,
		CONTENT_HEIGHT = 800,
		HUD_HEIGHT = 200,
		HUD_WIDTH = 1000,
		PLAYER_HUD_WIDTH = 300;

	var TopHudPlayer = function() {

	};

	TopHudPlayer.prototype.initialize = function (parent, player, i) {
		container = new createjs.Container();
		parent.addChild(container);

		var shape = new createjs.Shape();
		shape.graphics.beginFill("#444").drawRect(0, 0, PLAYER_HUD_WIDTH, HUD_HEIGHT);
		shape.x = i * PLAYER_HUD_WIDTH + 50 * i;
		shape.y = 0;
		container.addChild(shape);
	};

	TopHudPlayer.prototype.update = function (player) {

	};

	return TopHudPlayer;

});
