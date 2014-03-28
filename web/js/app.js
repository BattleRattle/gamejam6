
define('App', [
	'createjs',
	'Preloader'

], function (createjs, Preloader) {
	var App = function() {

	};


	App.prototype.initialize = function () {
		this.canvas = document.getElementById('canvas');
		this.stage = new createjs.Stage(this.canvas);

		var preloader = new Preloader();
		preloader.registerOnExit(function(assets) {

		});
		preloader.enter(this.canvas, this.stage);
		// init canvas
	};

	return App;
});
