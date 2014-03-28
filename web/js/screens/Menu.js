define('MenuScreen', [
	'createjs'
], function(createjs){
	var Menu = function() {

	};

	Menu.prototype.registerOnExit = function(callback) {
		this.onExit = callback;
	}

	Menu.prototype.enter =  function (canvas, stage) {
		this.exit();
	};

	Menu.prototype.exit = function() {
		this.onExit();
	}

	return Menu;

});
