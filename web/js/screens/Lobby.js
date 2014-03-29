define('LobbyScreen', [
	'createjs',
	'Lobby',
	'LobbyServerListener',
	'GameState'
], function (createjs, Lobby, LobbyServerListener, GameState) {
	var container,
		socket;

	var CONTENT_WIDTH = 1600,
		CONTENT_HEIGHT = 800;

	var LobbyScreen = function(so) {
		socket = so;
	};

	LobbyScreen.prototype.registerOnExit = function(callback) {
		this.onExit = callback;
	};

	LobbyScreen.prototype.resize = function () {
		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight;

		var scale = Math.min(this.canvas.width / CONTENT_WIDTH, this.canvas.height / (100 + CONTENT_HEIGHT));
		container.scaleX = scale;
		container.scaleY = scale;
		container.x = (this.canvas.width - CONTENT_WIDTH * scale) / 2;
		this.stage.update();
	};

	LobbyScreen.prototype.enter =  function (canvas, stage, assets, monsterid) {
		var self = this;
		this.stage = stage;
		this.canvas = canvas;
		this.assets = assets;

		container = new createjs.Container();
		this.resize();
		this.stage.addChild(container);
		window.onresize = function () {
			self.resize();
		};

		var handler = {
			'entered': function (event) { GameState.playerId = event.event.playerId },
			'created': function() { self.exit() }
		};

		var listener = new LobbyServerListener();
		listener.initialize(socket, handler);

		var lobby = new Lobby();
		lobby.initialize(monsterid);
	};

	LobbyScreen.prototype.exit = function() {
		this.onExit();
	};

	return LobbyScreen;

});
