define('GameOverScreen', [
	'createjs'
], function (createjs) {
	var container;

	var CONTENT_WIDTH = 1600,
		CONTENT_HEIGHT = 800;

	var GameOver = function() {

	};

	GameOver.prototype.registerOnExit = function(callback) {
		this.onExit = callback;
	};

	GameOver.prototype.resize = function () {
		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight;

		var scale = Math.min(this.canvas.width / CONTENT_WIDTH, this.canvas.height / (100 + CONTENT_HEIGHT));
		container.scaleX = scale;
		container.scaleY = scale;
		container.x = (this.canvas.width - CONTENT_WIDTH * scale) / 2;
		this.stage.update();
	};

	GameOver.prototype.enter =  function (canvas, stage, assets) {
		var self = this;
		this.stage = stage;
		this.canvas = canvas;
		this.assets = assets;

		container = new createjs.Container();
		this.resize();
		this.stage.addChild(container);
		window.onresize = function () {
			self.resize();
		};

		this.exit();
	};

	GameOver.prototype.exit = function() {
		this.onExit();
	}

	return GameOver;

});
