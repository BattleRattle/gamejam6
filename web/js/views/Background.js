define('BackgroundView', [
	'createjs',
	'ViewConstants'
], function (createjs, ViewConstants) {
	var container;

	var Background = function() {

	};

	Background.prototype.initialize = function (assets, parent) {
		container = new createjs.Container();
		parent.addChild(container);

		var bitmap = new createjs.Bitmap(assets['background']);
		bitmap.scaleX = 2100 / 2000;
		container.addChild(bitmap);
	};

	return Background;
});
