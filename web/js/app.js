
define('App', [
	'createjs',
	'PreloaderScreen',
	'MenuScreen',
	'CharacterScreen',
	'GameScreen',
	'GameOverScreen'

], function (createjs, PreloaderScreen, MenuScreen, CharacterScreen, GameScreen, GameOverScreen) {
	var App = function() {

	};


	App.prototype.initialize = function () {
		var self = this;

		this.canvas = document.getElementById('canvas');
		this.stage = new createjs.Stage(this.canvas);

		var preloader = new PreloaderScreen();
		preloader.registerOnExit(function(assets) {
			console.log('exit preloader');
			self.gotoMenu();
		});
		preloader.enter(this.canvas, this.stage);
	};

	App.prototype.gotoMenu = function () {
		var self = this,
			menu = new MenuScreen();
		menu.registerOnExit(function () {
			console.log('exit menu');
			self.gotoCharacter();
		});
		menu.enter(this.canvas, this.stage);
	};

	App.prototype.gotoCharacter = function () {
		var self = this,
			character = new CharacterScreen();
		character.registerOnExit(function () {
			console.log('exit character');
			self.gotoGame();
		});
		character.enter(this.canvas, this.stage);
	};

	App.prototype.gotoGame = function () {
		var self = this,
			game = new GameScreen();
		game.registerOnExit(function () {
			console.log('exit game');
			self.gotoGameOver();
		});
		game.enter(this.canvas, this.stage);
	};

	App.prototype.gotoGameOver = function () {
		var self = this,
			gameOver = new GameOverScreen();
		gameOver.registerOnExit(function () {
			console.log('game over');
		});
		gameOver.enter(this.canvas, this.stage);
	};

	return App;
});
