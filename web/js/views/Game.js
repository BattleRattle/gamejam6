define('GameView', [
	'createjs',
	'MapView'
], function (createjs, Map) {
	var container;

	var GameView = function() {

	};

	GameView.prototype.initialize = function (assets, parent, gameData) {
		container = new createjs.Container();
		parent.addChild(container);

		var map = new Map();
		map.initialize(assets, container, 'map1');
	};

	return GameView;

});
