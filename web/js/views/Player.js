define('PlayerView', [
	'createjs',
	'ViewConstants',
	'CollisionTester'
], function (createjs, ViewConstants, CollisionTester) {
	var config;

	var Player = function() {
		this.container = null;
		this.actions = {
			moveRight: false,
			moveLeft: false
		};
		this.isFalling = false;
		this.velocity = {
			x: 0,
			y: 0
		};
	};

	Player.prototype.initialize = function (assets, parent, data) {
		this.container = new createjs.Container();
		parent.addChild(this.container);

		var bitmap = new createjs.Bitmap(assets[data.monsterId]);
		this.container.y = ViewConstants.CONTENT_HEIGHT - bitmap.image.height * 0.27;
		this.container.x = data.position.x;
		this.container.addChild(bitmap);

		this.collistionTester = new CollisionTester();
		this.monsterData = assets['monster_data'][data.monsterId];
		this.mapData = assets['map_data']['map1'];
		this.collisioData = assets['collision'];
		this.playerData = data;
		config = assets['params'].movement;
	};

	Player.prototype.update = function(changes) {
		if (changes) {
			for (var i in changes) {
				this.actions[i] = changes[i];
			}
		}

		if (this.actions.moveLeft && !this.actions.moveRight) {
			this.velocity.x -= config.acceleration;
			if (this.velocity.x < -config.max_velocity) this.velocity.x = -config.max_velocity;
		} else if (this.actions.moveRight && !this.actions.moveLeft) {
			this.velocity.x += config.acceleration;
			if (this.velocity.x > config.max_velocity) this.velocity.x = config.max_velocity;
		} else {
			if (this.velocity.x < 0) {
				if (this.velocity.x >= -config.friction) this.velocity.x = 0;
				else this.velocity.x += config.friction;
			} else if (this.velocity.x > 0) {
				if (this.velocity.x <= config.friction) this.velocity.x = 0;
				else this.velocity.x -= config.friction;
			}
		}

		this.container.x += this.velocity.x;

		if (this.actions.jump && !this.isFalling) {
			this.velocity.y = config.jump_velocity;
			this.isFalling = true;
		} else {
			this.velocity.y -= config.gravity;
		}

		this.container.y -= this.velocity.y;

		if (this.collistionTester.collide({
			position: {x: this.container.x, y: this.container.y},
			collision: this.collisioData[this.playerData.monsterId],
			width: this.monsterData.width,
			height: this.monsterData.height
		}, {
			position: {x: 0, y: 0},
			collision: this.collisioData['map1'],
			width: this.mapData['tiles'][0].length * ViewConstants.MAP_TILE_SIZE,
			height: this.mapData['tiles'].length * ViewConstants.MAP_TILE_SIZE + ViewConstants.MAP_TOP_OFFSET
		})) {
			console.log('WHAAAAA!!!! COLLISION!!!!!111');
		}


		if (this.container.y > 660) {
			this.container.y = 660;
			this.velocity.y = 0;
			this.isFalling = false;
		}
	};

	return Player;
});
