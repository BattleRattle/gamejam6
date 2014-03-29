define('PreloaderScreen', [
	'createjs'
], function(createjs){
	var assetManifest,
		container;

	var CONTENT_WIDTH = 2100,
		CONTENT_HEIGHT = 1050,
		HEIGHT_OFFSET = 150;

	var Preloader = function() {

	};

	Preloader.prototype.registerOnExit = function(callback) {
		this.onExit = callback;
	};

	Preloader.prototype.resize = function () {
		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight;

		var scale = Math.min(this.canvas.width / CONTENT_WIDTH, this.canvas.height / CONTENT_HEIGHT);
		container.scaleX = scale;
		container.scaleY = scale;
		container.x = (this.canvas.width - CONTENT_WIDTH * scale) / 2;
		this.stage.update();
	};

	Preloader.prototype.enter =  function (canvas, stage) {
		var self = this;

		this.stage = stage;
		this.canvas = canvas;

		container = new createjs.Container();
		this.resize();
		this.stage.addChild(container);

		window.onresize = function () {
			self.resize();
		};

		var assets = {},
			preloaderPreloader = new createjs.LoadQueue(true);
		preloaderPreloader.loadFile('data/assets.json');
		preloaderPreloader.loadFile('img/background.jpg');
		preloaderPreloader.loadFile('img/stage_bottom.png');
		preloaderPreloader.loadFile('img/preloader/startscreen_maedchen.png');
		preloaderPreloader.loadFile('img/preloader/startscreen_monster.png');
		preloaderPreloader.loadFile('img/preloader/startscreen_button.png');
		preloaderPreloader.on('fileload', function (event) {
			if ("data/assets.json" === event.item.id) {
				assetManifest = event.result;
			} else {
				assets[event.item.id] = event.result;
			}
		});

		preloaderPreloader.on('complete', function () {
			self.drawScreen(assets);
			self.loadAssets();
		});

		preloaderPreloader.load();
	};

	Preloader.prototype.drawScreen = function (assets) {
		var bitmap;

		bitmap = new createjs.Bitmap(assets['img/background.jpg']);
		bitmap.scaleX = CONTENT_WIDTH / bitmap.image.width;
		container.addChild(bitmap);

		bitmap = new createjs.Bitmap(assets['img/stage_bottom.png']);
		bitmap.y = CONTENT_HEIGHT - bitmap.image.height + HEIGHT_OFFSET;
		container.addChild(bitmap);

		bitmap = new createjs.Bitmap(assets['img/preloader/startscreen_maedchen.png']);
		bitmap.y = CONTENT_HEIGHT - bitmap.image.height + 17;
		container.addChild(bitmap);

		bitmap = new createjs.Bitmap(assets['img/preloader/startscreen_monster.png']);
		bitmap.y = CONTENT_HEIGHT - bitmap.image.height + 13;
		bitmap.x = CONTENT_WIDTH - bitmap.image.width;
		container.addChild(bitmap);

		this.stage.update();
	};

	Preloader.prototype.loadAssets = function () {
		var self = this;
		this.assets = {};

		//call preload, and install soundjs as plugin
		this.loader = new createjs.LoadQueue();
		this.loader.installPlugin(createjs.SoundJS);

		//define callbacks
		this.loader.on('fileload', function(event){
			self.handleFileLoad(event);
		});

		this.loader.on('complete', function() {
			self.handleComplete();
		});

		//load file from manifest
		this.loader.loadManifest(assetManifest);
	};

	Preloader.prototype.exit = function () {
		var self = this;
		setTimeout(function () {
			self.stage.removeChild(container);
			self.stage.update();
			self.onExit(self.assets);
		}, 500);
	};

	Preloader.prototype.handleFileLoad = function (event) {
		this.assets[event.item.id] = event.result;
	};

	Preloader.prototype.handleComplete = function () {
		var self = this,
			bitmap,
			glow,
			pressed;

		glow = new createjs.Bitmap(this.assets['play_hover']);
		glow.y = (CONTENT_HEIGHT - glow.image.height) / 2;
		glow.x = (CONTENT_WIDTH - glow.image.width) / 2;
		glow.visible = false;
		container.addChild(glow);

		bitmap = new createjs.Bitmap(this.assets['play']);
		bitmap.y = (CONTENT_HEIGHT - bitmap.image.height) / 2;
		bitmap.x = (CONTENT_WIDTH - bitmap.image.width) / 2;
		container.addChild(bitmap);

		pressed = new createjs.Bitmap(this.assets['play_pressed']);
		pressed.y = (CONTENT_HEIGHT - pressed.image.height) / 2;
		pressed.x = (CONTENT_WIDTH - pressed.image.width) / 2;
		pressed.visible = false;
		container.addChild(pressed);

		this.stage.enableMouseOver(20);

		this.stage.update();

		bitmap.addEventListener('mousedown', function () {
			pressed.visible = true;
			self.stage.update();
		});

		bitmap.addEventListener('mouseover', function () {
			glow.visible = true;
			self.stage.update();
		});

		bitmap.addEventListener('mouseout', function () {
			glow.visible = false;
			pressed.visible = false;
			self.stage.update();
		});

		bitmap.addEventListener('click', function () {
			self.exit();
		});
	};

	Preloader.prototype.exit = function() {
		this.stage.enableMouseOver(0);
		this.stage.removeChild(container);
		this.stage.update();
		this.onExit(this.assets);
	};

	return Preloader;

});
