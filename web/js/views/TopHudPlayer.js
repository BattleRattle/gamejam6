define('TopHudPlayerView', [
	'createjs'
], function (createjs) {
	var container;

	var TopHudPlayer = function() {

	};

	TopHudPlayer.prototype.initialize = function (parent, player) {
		container = new createjs.Container();
		parent.addChild(container);
	};

	TopHudPlayer.prototype.update = function (player) {

	};

	return TopHudPlayer;

});
