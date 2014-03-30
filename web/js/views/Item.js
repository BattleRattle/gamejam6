define('ItemView', [
	'createjs',
	'ViewConstants'
], function (createjs, ViewConstants) {
	var container;

	var Item = function() {

	};

	Item.prototype.initialize = function (assets, parent) {
		container = new createjs.Container();
		parent.addChild(container);

		var bitmap = new createjs.Bitmap(assets['background']);
		bitmap.scaleX = 2100 / 2000;
		container.addChild(bitmap);
	};

	Item.prototype.displayItem = function (item) {

	};

	Item.prototype.dropItem = function () {

	};

	return Item;
});
