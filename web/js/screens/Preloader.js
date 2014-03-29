define('PreloaderScreen', [
	'createjs'
], function(createjs){
	var assetManifest,
		logo,
		container,
		progress;

	var PRELOAD_WIDTH = 1000,
		PRELOAD_HEIGHT = 500,
		CONTENT_WIDTH = 400;

	var Preloader = function() {

	};

	Preloader.prototype.registerOnExit = function(callback) {
		this.onExit = callback;
	};

	Preloader.prototype.resize = function () {
		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight;

		var scale = Math.min(this.canvas.width / PRELOAD_WIDTH, this.canvas.height / PRELOAD_HEIGHT);
		container.scaleX = scale;
		container.scaleY = scale;
		container.x = (this.canvas.width - PRELOAD_WIDTH * scale) / 2;
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

		progress = new createjs.Shape(); // Remember to define the progress variable at the top!
		progress.graphics.beginStroke("#C33").drawRect(0, 0, CONTENT_WIDTH, 20);
		progress.x = (PRELOAD_WIDTH - CONTENT_WIDTH) / 2;
		progress.y = 400;
		container.addChild(progress);

		var preloaderPreloader = new createjs.LoadQueue(true);
		preloaderPreloader.loadFile('data/assets.json');
		preloaderPreloader.loadFile('img/logo.jpg');
		preloaderPreloader.on('fileload', function (event) {
			if ("data/assets.json" === event.item.id) {
				assetManifest = event.result;
			} else if ("img/logo.jpg" === event.item.id) {
				var bitmap = new createjs.Bitmap(event.result);
				bitmap.y = 100;
				bitmap.x = (PRELOAD_WIDTH - CONTENT_WIDTH) / 2;

				bitmap.scaleX = CONTENT_WIDTH / bitmap.image.width;
				bitmap.scaleY = 250 /bitmap.image.height;
				container.addChild(bitmap);
				self.stage.update();
			}
		});

		preloaderPreloader.on('complete', function (event) {
			self.assets = {};

			self.totalAssets = assetManifest.length;
			self.loadedAssets = 0;

			//call preload, and install soundjs as plugin
			self.loader = new createjs.LoadQueue();
			self.loader.installPlugin(createjs.SoundJS);

			//define callbacks
			self.loader.on('fileload', function(event){
				self.handleFileLoad(event);
			});

			self.loader.on('complete', function() {
				self.handleComplete();
			});

			//load file from manifest
			self.loader.loadManifest(assetManifest);
		});

		preloaderPreloader.load();
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

		this.loadedAssets++;

		progress.graphics.clear();
		// Draw the progress bar
		progress.graphics.beginFill("#C33").drawRect(0, 0, CONTENT_WIDTH * this.loadedAssets / this.totalAssets, 20);
		// Draw the outline again.
		progress.graphics.beginStroke("#C33").drawRect(0, 0, CONTENT_WIDTH, 20);
		this.stage.update();
	};

	Preloader.prototype.handleComplete = function () {
		this.exit();
	};

	return Preloader;

});
