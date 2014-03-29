define('TopHudView', [
	'createjs',
	'TopHudPlayerView',
	'ViewConstants'
], function (createjs, TopHudPlayer, ViewConstants) {
	var container;

	var TopHud = function() {
		this.playerHuds = [];
	};

	TopHud.prototype.initialize = function (assets, parent, players) {
		container = new createjs.Container();
		container.x = ViewConstants.CONTENT_WIDTH - ViewConstants.HUD_WIDTH;
		parent.addChild(container);

		var count = 2;
		for (var i in players) {
			this.playerHuds[players[i].id] = new TopHudPlayer();
			this.playerHuds[players[i].id].initialize(assets, container, players[i], count--);
		}
	};

	TopHud.prototype.update = function (players) {
		var player;
		for (var i in players) {
			player = players[i];
			this.playerHuds[player.id].update(player);
		}
	};

	return TopHud;

});
