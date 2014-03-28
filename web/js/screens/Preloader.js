define('Preloader', [
	'createjs'
], function(createjs){
	var assetManifest = [

	];

	var Preloader = function() {

	};

	Preloader.prototype.registerOnExit = function(callback) {
		this.onExit = callback;
	}

	Preloader.prototype.enter =  function (canvas, stage) {
			var that = this;

			this.stage = stage;
			this.canvas = canvas;

			this.assets = {};

			this.totalAssets = assetManifest.length;
			this.loadedAssets = 0;

			//call preload, and install soundjs as plugin
			this.loader = new createjs.LoadQueue();
			this.loader.installPlugin(createjs.SoundJS);

			//define callbacks
			this.loader.onFileLoad = function(loadedFile){
				that.handleFileLoad(loadedFile);
			};

			this.loader.onComplete = function(){
				that.handleComplete();
			};

			//load file from manifest
			this.loader.loadManifest(assetManifest);

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
