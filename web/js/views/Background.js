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

		if (typeof assets['background'] !== 'undefined') {
			var bitmap = new createjs.Bitmap(assets['background']);
			container.addChild(bitmap);
		}
	};

	return Background;
});
