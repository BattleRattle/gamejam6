define('TopHudView', [
	'createjs',
	'TopHudPlayerView',
	'ViewConstants'
], function (createjs, TopHudPlayer, ViewConstants) {
	var container;

	var TopHud = function() {

	};

	TopHud.prototype.initialize = function (assets, parent, players) {
		container = new createjs.Container();
		container.x = ViewConstants.CONTENT_WIDTH - ViewConstants.HUD_WIDTH;
		parent.addChild(container);

		for (var i in players) {
			var playerHud = new TopHudPlayer();
			playerHud.initialize(assets, container, players[i], i);
		}
	};

	return TopHud;

});
