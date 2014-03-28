define('GameOverScreen', [
	'createjs'
], function(createjs){
	var GameOver = function() {

	};

	GameOver.prototype.registerOnExit = function(callback) {
		this.onExit = callback;
	}

	GameOver.prototype.enter =  function (canvas, stage) {
		this.exit();
	};

	GameOver.prototype.exit = function() {
		this.onExit();
	}

	return GameOver;

});
