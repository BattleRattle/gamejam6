define('TopHudPlayerView', [
	'createjs',
	'ViewConstants'
], function (createjs, ViewConstants) {

	var TopHudPlayer = function() {
		this.container = null;
		this.health = [];
		this.stars = [];
		this.starCount = 0;
	};

	TopHudPlayer.prototype.initialize = function (assets, parent, player, i) {
		this.container = new createjs.Container();
		this.assets = assets;
		parent.addChild(this.container);

		var data = assets['monster_data'][player.monsterId];

		var bitmap = new createjs.Bitmap(assets['tophud_bg']);
		bitmap.x = i * ViewConstants.PLAYER_HUD_WIDTH + 8 * i;
		this.container.addChild(bitmap);

		bitmap = new createjs.Bitmap(assets[player.monsterId]);
		bitmap.x = i * ViewConstants.PLAYER_HUD_WIDTH + 8 * i + 150 - data.width;
		bitmap.y = 115 - data.height;
		this.container.addChild(bitmap);

		bitmap = new createjs.Bitmap(assets['health3']);
		bitmap.x = i * ViewConstants.PLAYER_HUD_WIDTH + 8 * i + 159;
		bitmap.y = 78;
		this.health[0] = bitmap;
		this.container.addChild(bitmap);

		bitmap = new createjs.Bitmap(assets['health2']);
		bitmap.x = i * ViewConstants.PLAYER_HUD_WIDTH + 8 * i + 153;
		bitmap.y = 32;
		this.health[1] = bitmap;
		this.container.addChild(bitmap);

		bitmap = new createjs.Bitmap(assets['health1']);
		bitmap.x = i * ViewConstants.PLAYER_HUD_WIDTH + 8 * i + 113;
		this.health[2] = bitmap;
		this.container.addChild(bitmap);

		bitmap = new createjs.Bitmap(assets['star_empty']);
		bitmap.x = i * ViewConstants.PLAYER_HUD_WIDTH + 8 * i + 45;
		bitmap.y = 133;
		this.stars[0] = bitmap;
		this.container.addChild(bitmap);

		bitmap = new createjs.Bitmap(assets['star_empty']);
		bitmap.x = i * ViewConstants.PLAYER_HUD_WIDTH + 8 * i + 90;
		bitmap.y = 133;
		this.stars[1] = bitmap;
		this.container.addChild(bitmap);

		bitmap = new createjs.Bitmap(assets['star_empty']);
		bitmap.x = i * ViewConstants.PLAYER_HUD_WIDTH + 8 * i + 135;
		bitmap.y = 133;
		this.stars[2] = bitmap;
		this.container.addChild(bitmap);

		var label = new createjs.Text(data.name.toUpperCase(), "20px Arial", "#fff");
		label.x = i * ViewConstants.PLAYER_HUD_WIDTH + 8 * i + 60;
		label.y = 115;
		this.container.addChild(label);
	};

	TopHudPlayer.prototype.update = function (player) {
		if (typeof this.health[2] !== 'undefined' && player.health < 66) {
			this.container.removeChild(this.health[2]);
			delete this.health[2];
		}

		if (typeof this.health[1] !== 'undefined' && player.health < 33) {
			this.container.removeChild(this.health[1]);
			delete this.health[1];
		}

		if (typeof this.health[0] !== 'undefined' && player.health <= 0) {
			this.container.removeChild(this.health[0]);
			delete this.health[0];
		}

		while ( this.starCount < player.collectedItems) {
			var oldStar = this.stars[this.starCount],
				bitmap = new createjs.Bitmap(this.assets['star_full']);
			bitmap.x = oldStar.x;
			bitmap.y = oldStar.y;
			this.stars[this.starCount] = bitmap;
			this.container.removeChild(oldStar);
			this.container.addChild(bitmap);
			this.starCount++;
		}
	};

	return TopHudPlayer;

});
