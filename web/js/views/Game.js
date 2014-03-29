define('GameView', [
	'createjs',
	'MapView',
	'BackgroundView'
], function (createjs, Map, Background) {
	var container;

	var GameView = function() {

	};

	GameView.prototype.initialize = function (assets, parent, gameData) {
		container = new createjs.Container();
		parent.addChild(container);

		var background = new Background();
		background.initialize(assets, container);

		var map = new Map();
		map.initialize(assets, container, gameData.mapId);
	};

	return GameView;

});
