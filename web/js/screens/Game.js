define('GameScreen', [
	'createjs',
	'Movement'
], function(createjs, Movement){
	var Game = function() {

	};

	Game.prototype.registerOnExit = function(callback) {
		this.onExit = callback;
	}

	Game.prototype.enter =  function (canvas, stage) {
		var movement = new Movement();
		movement.initialize();

//		this.exit();
	};

	Game.prototype.exit = function() {
		this.onExit();
	}

	return Game;

});
