
define('App', [
	'createjs',
	'Socket',
	'PreloaderScreen',
	'MenuScreen',
	'CharacterScreen',
	'LobbyScreen',
	'GameScreen',
	'GameOverScreen'

], function (createjs, Socket, PreloaderScreen, MenuScreen, CharacterScreen, LobbyScreen, GameScreen, GameOverScreen) {
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
			console.log('exit preloader');
			self.assets = assets;
			self.gotoMenu();
		});
		preloader.enter(this.canvas, this.stage);

		socket = new Socket();
		socket.initialize();
	};

	App.prototype.gotoMenu = function () {
		var self = this,
			menu = new MenuScreen();
		menu.registerOnExit(function () {
			console.log('exit menu');
			self.gotoCharacter();
		});
		menu.enter(this.canvas, this.stage, this.assets);
	};

	App.prototype.gotoCharacter = function () {
		var self = this,
			character = new CharacterScreen();
		character.registerOnExit(function (monsterId) {
			console.log('exit character');
			self.gotoLobby(monsterId);
		});
		character.enter(this.canvas, this.stage, this.assets);
	};

	App.prototype.gotoLobby = function (monsterId) {
		var self = this,
			lobby = new LobbyScreen(socket);
		lobby.registerOnExit(function () {
			console.log('exit lobby');
			self.gotoGame();
		});
		lobby.enter(this.canvas, this.stage, this.assets, monsterId);
	};

	App.prototype.gotoGame = function () {
		var self = this,
			game = new GameScreen();
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
