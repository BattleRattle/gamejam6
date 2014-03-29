define('PlayerView', [
	'createjs',
	'ViewConstants'
], function (createjs, ViewConstants) {
	var container;

	var Player = function() {

	};

	Player.prototype.initialize = function (assets, parent, data) {
		container = new createjs.Container();
		parent.addChild(container);

		var bitmap = new createjs.Bitmap(assets['monster1']);
		bitmap.scaleX = 0.3;
		bitmap.scaleY = 0.3;
		bitmap.y = ViewConstants.CONTENT_HEIGHT - bitmap.image.height * 0.3;
		container.addChild(bitmap);
	};

	Player.prototype.update = function() {

	};

	return Player;
});
