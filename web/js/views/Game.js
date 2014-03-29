define('GameView', [
	'createjs'
], function (createjs) {
	var container;

	var GameView = function() {

	};

	GameView.prototype.initialize = function (parent, gameData) {
		container = new createjs.Container();
		parent.addChild(container);
	};

	return GameView;

});
