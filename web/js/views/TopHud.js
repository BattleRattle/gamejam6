define('TopHudView', [
	'createjs',
	'TopHudPlayerView',
	'ViewConstants'
], function (createjs, TopHudPlayer, ViewConstants) {
	var container;

	var TopHud = function() {

	};

	TopHud.prototype.initialize = function (parent, players) {
		container = new createjs.Container();
		container.x = ViewConstants.CONTENT_WIDTH - ViewConstants.HUD_WIDTH;
		parent.addChild(container);

		var shape = new createjs.Shape();
		shape.graphics.beginFill("#fff").drawRect(0, 0, ViewConstants.HUD_WIDTH, ViewConstants.HUD_HEIGHT);
		shape.y = 0;
		container.addChild(shape);

		for (var i in players) {
			var playerHud = new TopHudPlayer();
			playerHud.initialize(container, players[i], i);
		}
	};

	return TopHud;

});
