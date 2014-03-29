
define('App', [
	'createjs',
	'Socket',
	'PreloaderScreen',
	'CharacterScreen',
	'LobbyScreen',
	'GameScreen',
	'GameOverScreen'

], function (createjs, Socket, PreloaderScreen, CharacterScreen, LobbyScreen, GameScreen, GameOverScreen) {
	var socket;

	var App = function() {

	};

	App.prototype.initialize = function () {
		var self = this;

		this.canvas = document.getElementById('canvas');
		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight;
		this.stage = new createjs.Stage(this.canvas);

		var preloader = new PreloaderScreen();
		preloader.registerOnExit(function(assets) {
			self.assets = assets;
			self.gotoCharacter();
		});
		preloader.enter(this.canvas, this.stage);

		socket = new Socket();
		socket.initialize();
	};

	App.prototype.gotoCharacter = function () {
		var self = this,
			character = new CharacterScreen();
		character.registerOnExit(function (monsterId) {
			self.gotoLobby(monsterId);
		});
		character.enter(this.canvas, this.stage, this.assets);
	};

	App.prototype.gotoLobby = function (monsterId) {
		var self = this,
			lobby = new LobbyScreen(socket);
		lobby.registerOnExit(function () {
			self.gotoGame();
		});
		lobby.enter(this.canvas, this.stage, this.assets, monsterId);
	};

	App.prototype.gotoGame = function () {
		var self = this,
			game = new GameScreen(socket);
		game.registerOnExit(function () {
			console.log('exit game');
			self.gotoGameOver();
		});
		game.enter(this.canvas, this.stage, this.assets);
	};

	App.prototype.gotoGameOver = function () {
		var self = this,
			gameOver = new GameOverScreen();
		gameOver.registerOnExit(function () {
			console.log('game over');
		});
		gameOver.enter(this.canvas, this.stage, this.assets);
	};

	return App;
});
