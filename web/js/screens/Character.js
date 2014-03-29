define('CharacterScreen', [
	'createjs'
], function (createjs) {
	var container,
		assets;

	var CONTENT_WIDTH = 2100,
		CONTENT_HEIGHT = 1050,
		BOX_WIDTH = 610;

	var drawBox = function (box, image, stage) {
		var data = assets['monster_data'][image],
			bitmap,
			glow,
			label;

		glow = new createjs.Bitmap(assets['selection_glow']);
		glow.y = 100;
		glow.visible = false;
		box.addChild(glow);

		bitmap = new createjs.Bitmap(assets[data.selection]);
		bitmap.y = 100;
		box.addChild(bitmap);

		label = new createjs.Text(data.name.toUpperCase(), "bold 40px Arial", "#fff");
		label.y = BOX_WIDTH - 70;
		label.x = 190;
		box.addChild(label);

		box.y = 250;

		box.addEventListener('mouseover', function () {
			glow.visible = true;
			stage.update();
		});

		box.addEventListener('mouseout', function () {
			glow.visible = false;
			stage.update();
		});
	};

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

		drawBox.bind(this);

		container = new createjs.Container();
		this.resize();
		stage.addChild(container);
		window.onresize = function () {
			self.resize();
		};

		var bitmap = new createjs.Bitmap(assets['background']);
		bitmap.scaleX = CONTENT_WIDTH / bitmap.image.width;
		container.addChild(bitmap);

		this.stage.enableMouseOver(20);

		var header = new createjs.Bitmap(assets['character_selection']);
		header.x = (CONTENT_WIDTH - header.image.width) / 2;
		header.y = 50;
		container.addChild(header);

		var monster1Box = new createjs.Container();
		monster1Box.x = (CONTENT_WIDTH - BOX_WIDTH) / 2 - BOX_WIDTH + 75;
		drawBox(monster1Box, 'monster1', stage);
		container.addChild(monster1Box);
		monster1Box.addEventListener('click', function () {
			self.exit('monster1');
		});

		var monster2Box = new createjs.Container();
		drawBox(monster2Box, 'monster2', stage);
		monster2Box.x = (CONTENT_WIDTH - BOX_WIDTH) / 2;
		container.addChild(monster2Box);
		monster2Box.addEventListener('click', function () {
			self.exit('monster2');
		});

		var monster3Box = new createjs.Container();
		monster3Box.x = (CONTENT_WIDTH - BOX_WIDTH) / 2 + BOX_WIDTH - 75;
		drawBox(monster3Box, 'monster3', stage);
		container.addChild(monster3Box);
		monster3Box.addEventListener('click', function () {
			self.exit('monster3');
		});

		stage.update();
	};

	Character.prototype.exit = function(monster) {
		this.stage.enableMouseOver(0);
		this.stage.removeChild(container);
		this.stage.update();
		this.onExit(monster);
	};

	return Character;

});
