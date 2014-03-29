define('PlayerView', [
	'createjs',
	'ViewConstants'
], function (createjs, ViewConstants) {
	var config;

	var Player = function() {
		this.container = null;
		this.actions = {
			moveRight: false,
			moveLeft: false
		};
		this.velocity = {
			x: 0,
			y: 0
		};
	};

	Player.prototype.initialize = function (assets, parent, data) {
		this.container = new createjs.Container();
		parent.addChild(this.container);

		var bitmap = new createjs.Bitmap(assets['monster1']);
		bitmap.scaleX = 0.3;
		bitmap.scaleY = 0.3;
		this.container.y = ViewConstants.CONTENT_HEIGHT - bitmap.image.height * 0.27;
		this.container.x = data.position.x;
		this.container.addChild(bitmap);

		config = assets['params'].movement;
	};

	Player.prototype.update = function(changes) {
		if (changes) {
			for (var i in changes) {
				this.actions[i] = changes[i];
			}
		}

		if (this.actions.moveLeft && !this.actions.moveRight) {
			this.velocity.x -= config.friction;
			if (this.velocity.x < -config.max_velocity) this.velocity.x = -config.max_velocity;
		} else if (this.actions.moveRight && !this.actions.moveLeft) {
			this.velocity.x += config.acceleration;
			if (this.velocity.x > config.max_velocity) this.velocity.x = config.max_velocity;
		} else {
			if (this.velocity.x < 0) {
				this.velocity.x += config.acceleration;
			} else if (this.velocity.x > 0) {
				this.velocity.x -= config.friction;
			}
		}

		this.container.x += this.velocity.x;
	};

	return Player;
});
