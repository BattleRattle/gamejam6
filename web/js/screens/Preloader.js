define('PreloaderScreen', [
	'createjs'
], function(createjs){
	var assetManifest,
		logo;

	var Preloader = function() {

	};

	Preloader.prototype.registerOnExit = function(callback) {
		this.onExit = callback;
	}

	Preloader.prototype.enter =  function (canvas, stage) {
		var self = this;

		this.stage = stage;
		this.canvas = canvas;

		var preloaderPreloader = new createjs.LoadQueue(true);
		preloaderPreloader.loadFile('data/assets.json');
		preloaderPreloader.loadFile('img/logo.jpg');
		preloaderPreloader.on('fileload', function (event) {
			if ("data/assets.json" === event.item.id) {
				assetManifest = event.result;
			} else if ("img/logo.jpg" === event.item.id) {
				logo = event.result;
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
			self.loader.on('fileload', function(loadedFile){
				self.handleFileLoad(loadedFile);
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
		this.onExit(this.assets);
	};

	Preloader.prototype.handleFileLoad = function (loadedFile) {
			this.assets[loadedFile.id] = loadedFile.result;

			this.loadedAssets++;
	};

	Preloader.prototype.handleComplete = function () {
			this.exit();
	};

	return Preloader;

});
