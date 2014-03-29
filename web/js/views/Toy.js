define('ToyView', [
	'createjs',
	'ViewConstants'
], function (createjs, ViewConstants) {
	var Toy = function() {
		this.position = {
			x: 0,
			y: 0
		};
		this.owner = null;
	};

	Toy.prototype.initialize = function (assets, parent, data) {
		this.container = new createjs.Container();
		parent.addChild(this.container);

		this.bitmap = new createjs.Bitmap(assets[data.toyId]);
		this.bitmap.y = ViewConstants.HUD_HEIGHT - ViewConstants.MAP_TOP_OFFSET + 20;
		this.bitmap.x = data.position.x || ViewConstants.MAP_TILE_WIDTH + parseInt(Math.random() * 150);
		this.container.addChild(this.bitmap);
	};

	Toy.prototype.pickup = function(owner) {
		this.owner = owner;
	};

	Toy.prototype.drop = function() {
		this.owner = null;
	};

	return Toy;
});
