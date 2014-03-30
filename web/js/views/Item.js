define('ItemView', [
	'createjs',
	'ViewConstants'
], function (createjs, ViewConstants) {
	var container;

	var Item = function() {
	};

	Item.prototype.initialize = function (assets, parent) {
		container = new createjs.Container();
		container.x = ViewConstants.CONTENT_WIDTH;
		container.y = ViewConstants.CONTENT_HEIGHT;
		parent.addChild(container);
	};

	Item.prototype.displayItem = function (item) {
		this.item = item;
		container.addChild(item);
		item.x -= item.image.width + 250;
		item.y -= item.image.height + 75;
		item.visible = true;
	};

	Item.prototype.dropItem = function () {
		console.log('remove')
		this.item.visible = false;
		container.removeChild(this.item);
	};

	return Item;
});
