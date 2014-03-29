define('TopHudView', [
	'createjs',
	'TopHudPlayerView'
], function (createjs, TopHudPlayer) {
	var container;

	var CONTENT_WIDTH = 1600,
		CONTENT_HEIGHT = 800,
		HUD_HEIGHT = 200,
		HUD_WIDTH = 1000;

	var TopHud = function() {

	};

	TopHud.prototype.initialize = function (parent, players) {
		container = new createjs.Container();
		container.x = CONTENT_WIDTH - HUD_WIDTH;
		parent.addChild(container);

		var shape = new createjs.Shape();
		shape.graphics.beginFill("#fff").drawRect(0, 0, HUD_WIDTH, HUD_HEIGHT);
		shape.y = 0;
		container.addChild(shape);

		for (var i in players) {
			var playerHud = new TopHudPlayer();
			playerHud.initialize(container, players[i], i);
		}
	};

	return TopHud;

});
