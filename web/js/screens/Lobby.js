define('LobbyScreen', [
	'createjs',
	'Lobby',
	'LobbyServerListener',
	'GameState'
], function (createjs, Lobby, LobbyServerListener, GameState) {
	var container,
		socket,
		lobby;

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
			'entered': function (event) { GameState.playerId = event.event.playerId; self.singleMulti(event); },
			'created': function() { self.exit() },
			'joined': function(event) { if (GameState.playerId == event.event.player.id) self.exit() }
		};

		var listener = new LobbyServerListener();
		listener.initialize(socket, handler);

		lobby = new Lobby();
		lobby.initialize(monsterid);
	};

	LobbyScreen.prototype.singleMulti = function (event) {
		container.removeAllChildren();

		var joined = false;
		var single = new createjs.Shape();
		single.graphics.beginFill("#fff").drawRect(0, 0, CONTENT_WIDTH - 400, CONTENT_HEIGHT / 2 - 100);
		single.graphics.beginStroke("#C33").drawRect(0, 0, CONTENT_WIDTH - 400, CONTENT_HEIGHT / 2 - 100);
		single.x = 200;
		single.y = 75;
		container.addChild(single);

		var label = new createjs.Text("Single Player", "bold 70px Arial", "#C33");
		label.x = 550;
		label.y = 200;
		container.addChild(label);

		single.addEventListener('click', function() {
			if (joined) {
				return;
			}

			joined = true;
			lobby.createGame(true);
		});

		var multi = new createjs.Shape();
		multi.graphics.beginFill("#fff").drawRect(0, 0, CONTENT_WIDTH - 400, CONTENT_HEIGHT / 2 - 100);
		multi.graphics.beginStroke("#C33").drawRect(0, 0, CONTENT_WIDTH - 400, CONTENT_HEIGHT / 2 - 100);
		multi.x = 200;
		multi.y = 75 + CONTENT_HEIGHT / 2;
		container.addChild(multi);

		label = new createjs.Text("Multi Player", "bold 70px Arial", "#C33");
		label.x = 550;
		label.y = 200  + CONTENT_HEIGHT / 2;
		container.addChild(label);

		multi.addEventListener('click', function() {
			if (joined) {
				return;
			}

			joined = true;
			if (event.event.games.length === 0) {
				lobby.createGame(false);
			} else {
				lobby.joinGame(event.event.games[0].id);
			}
		});

		this.stage.update();
	};

	LobbyScreen.prototype.exit = function() {
		this.stage.removeChild(container);
		this.onExit();
	};

	return LobbyScreen;

});
