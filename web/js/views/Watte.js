define('WatteView', [
	'createjs',
	'ViewConstants'
], function (createjs, ViewConstants) {
	var Watte = function() {
		this.position = {
			x: 0,
			y: 0
		};
		this.watte = {};
	};

	Watte.prototype.initialize = function (assets, parent) {
		this.assets = assets;
		this.container = new createjs.Container();
		parent.addChild(this.container);
	};

	Watte.prototype.update = function () {
		for (var i in this.watte) {
			this.watte[i].velocity.y -= 0.1;
			this.watte[i].position.x += this.watte[i].velocity.x;
			this.watte[i].position.y -= this.watte[i].velocity.y;
			this.watte[i].setTransform(this.watte[i].position.x, this.watte[i].position.y);
		}
	};

	Watte.prototype.spawn = function(data) {
		console.log('spawn watte ' + data.id);
		this.watte[data.id] = new createjs.Bitmap(this.assets['watteball']);
		this.watte[data.id].setTransform(data.position.x, data.position.y + 56, 1, 1, parseInt(Math.random() * 360), 0, 0, 16, 16);
		this.watte[data.id].position = data.position;
		this.watte[data.id].velocity = data.velocity;
		this.container.addChild(this.watte[data.id]);
	};

	Watte.prototype.disappear = function(watteId) {
		console.log('remove watte ' + watteId);
		this.container.removeChild(this.watte[watteId]);
		delete this.watte[watteId];
	};

	return Watte;
});
