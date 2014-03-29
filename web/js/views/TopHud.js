define('TopHudView', [
	'createjs',
	'TopHudPlayerView'
], function (createjs, TopHudPlayer) {
	var container;

	var TopHud = function() {

	};

	TopHud.prototype.initialize = function (parent, players) {
		container = new createjs.Container();
		parent.addChild(container);
	};

	return TopHud;

});
