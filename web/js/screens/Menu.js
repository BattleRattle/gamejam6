define('MenuScreen', [
	'createjs'
], function(createjs){
	var container;

	var PRELOAD_WIDTH = 1000,
		PRELOAD_HEIGHT = 500,
		CONTENT_WIDTH = 400,
		CONTENT_HEIGHT = 300;

	var Menu = function() {

	};

	Menu.prototype.registerOnExit = function(callback) {
		this.onExit = callback;
	}

	Menu.prototype.enter =  function (canvas, stage, assets) {
		var self = this;
		this.stage = stage;
		this.canvas = canvas;
		this.assets = assets;

		container = new createjs.Container();
		var scale = Math.min(this.canvas.width / PRELOAD_WIDTH, this.canvas.height / PRELOAD_HEIGHT);
		container.scaleX = scale;
		container.scaleY = scale;
		this.stage.addChild(container);

		var play = new createjs.Shape();
		play.graphics.beginFill("#fff").drawRect(0, 0, CONTENT_WIDTH, CONTENT_HEIGHT);
		play.graphics.beginStroke("#C33").drawRect(0, 0, CONTENT_WIDTH, CONTENT_HEIGHT);
		play.x = (PRELOAD_WIDTH - CONTENT_WIDTH) / 2;
		play.y = (PRELOAD_HEIGHT - CONTENT_HEIGHT) / 2;
		container.addChild(play);

		var label = new createjs.Text("Play!", "bold 70px Arial", "#C33");
		label.text = "Play!";
		label.x = (PRELOAD_WIDTH - CONTENT_WIDTH / 2) / 2;
		label.y = (PRELOAD_HEIGHT - CONTENT_HEIGHT / 2) / 2;
		container.addChild(label);
		this.stage.update();

		play.addEventListener('click', function() {
			self.exit();
		});
	};

	Menu.prototype.exit = function() {
		this.stage.removeChild(container);
		this.stage.update();
		this.onExit();
	}

	return Menu;

});
