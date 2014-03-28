define('GameScreen', [
	'createjs'
], function(createjs){
	var Game = function() {

	};

	Game.prototype.registerOnExit = function(callback) {
		this.onExit = callback;
	}

	Game.prototype.enter =  function (canvas, stage) {
		this.exit();
	};

	Game.prototype.exit = function() {
		this.onExit();
	}

	return Game;

});
