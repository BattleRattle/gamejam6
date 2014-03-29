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
		this.toys = {};
	};

	Toy.prototype.initialize = function (assets, parent, toys) {
		this.container = new createjs.Container();
		parent.addChild(this.container);

		var data;
		for (var i in toys) {
			data = toys[i];
			this.toys[data.id] = new createjs.Bitmap(assets[data.type]);
			this.toys[data.id].y = data.position.y;
			this.toys[data.id].x = data.position.x;
			this.container.addChild(this.toys[data.id]);
		}
	};

	Toy.prototype.pickup = function(toyId, playerId) {
		this.owner = playerId;
		this.toys[toyId].visible = false;
	};

	Toy.prototype.drop = function(toyId) {
		this.owner = null;
		delete this.toys[toyId];
	};

	return Toy;
});
