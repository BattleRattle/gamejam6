define('CharacterScreen', [
	'createjs'
], function(createjs){
	var Character = function() {

	};

	Character.prototype.registerOnExit = function(callback) {
		this.onExit = callback;
	}

	Character.prototype.enter =  function (canvas, stage) {
		this.exit();
	};

	Character.prototype.exit = function() {
		this.onExit();
	}

	return Character;

});
