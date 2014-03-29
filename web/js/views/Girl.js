define('GirlView', [
	'createjs',
	'ViewConstants'
], function (createjs, ViewConstants) {
	var container;

	var Girl = function() {

	};

	Girl.prototype.initialize = function (assets, parent) {
		container = new createjs.Container();
		parent.addChild(container);

		var bitmap = new createjs.Bitmap(assets['maedchen']);
		bitmap.y = ViewConstants.HUD_HEIGHT - ViewConstants.MAP_TOP_OFFSET - 125;
		bitmap.x = 125;
		container.addChild(bitmap);
	};

	return Girl;
});
