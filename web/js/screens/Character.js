define('CharacterScreen', [
	'createjs'
], function (createjs) {
	var container,
		assets;

	var CONTENT_HEIGHT = 1000,
		CONTENT_WIDTH = 1500,
		BOX_WIDTH = 500;

	var drawBox = function (box, image) {
		var data = assets['monster_data'][image];
		var bitmap = new createjs.Bitmap(assets[image]);
		bitmap.y = 100;
		bitmap.x = 50;
		var scale = BOX_WIDTH / (bitmap.image.width + 100);
		bitmap.scaleX = scale;
		bitmap.scaleY = scale;
		box.addChild(bitmap);

		var label = new createjs.Text(data.name, "bold 60px Arial", "#fff");
		label.y = 50 + BOX_WIDTH;
		label.x = 50;
		box.addChild(label);

		var shape = new createjs.Shape();
		shape.graphics.beginStroke("#fff").drawRect(0, 0, BOX_WIDTH - 20, CONTENT_HEIGHT - 70);
		shape.x = 20;
		shape.y = 70;
		box.addChild(shape);

		box.y = 40;
	}

	var Character = function() {

	};

	Character.prototype.registerOnExit = function(callback) {
		this.onExit = callback;
	};

	Character.prototype.resize = function () {
		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight;

		var scale = Math.min(this.canvas.width / CONTENT_WIDTH, this.canvas.height / (100 + CONTENT_HEIGHT));
		container.scaleX = scale;
		container.scaleY = scale;
		container.x = (this.canvas.width - CONTENT_WIDTH * scale) / 2;
		this.stage.update();
	};

	Character.prototype.enter =  function (canvas, stage, as) {
		var self = this;
		this.stage = stage;
		this.canvas = canvas;
		assets = as;

		container = new createjs.Container();
		this.resize();
		stage.addChild(container);
		window.onresize = function () {
			self.resize();
		};

		var header = new createjs.Text("Character Selection", "bold 60px Arial", "#fff");
		header.y = 40;
		header.x = 500;
		container.addChild(header);

		var monster1Box = new createjs.Container();
		monster1Box.x = 0;
		drawBox(monster1Box, 'monster1');
		container.addChild(monster1Box);
		monster1Box.addEventListener('click', function () {
			self.exit('monster1');
		});

		var monster2Box = new createjs.Container();
		monster2Box.x = CONTENT_WIDTH / 3;
		drawBox(monster2Box, 'monster1');
		container.addChild(monster2Box);
		monster2Box.addEventListener('click', function () {
			self.exit('monster1');
		});

		var monster3Box = new createjs.Container();
		monster3Box.x = CONTENT_WIDTH / 3 * 2;
		drawBox(monster3Box, 'monster1');
		container.addChild(monster3Box);
		monster3Box.addEventListener('click', function () {
			self.exit('monster1');
		});

		stage.update();
	};

	Character.prototype.exit = function(monster) {
		this.stage.removeChild(container);
		this.stage.update();
		this.onExit(monster);
	};

	return Character;

});
