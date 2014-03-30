define('LobbyScreen', [
	'createjs',
	'Lobby',
	'LobbyServerListener',
	'GameState'
], function (createjs, Lobby, LobbyServerListener, GameState) {
	var container,
		socket,
		lobby;

	var CONTENT_WIDTH = 2100,
		CONTENT_HEIGHT = 1050;

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

		var joined = false,
			self = this,
			bitmap,
			bitmap2,
			glow,
			pressed,
			glow2,
			pressed2;

		bitmap = new createjs.Bitmap(this.assets['background']);
		bitmap.scaleX = CONTENT_WIDTH / bitmap.image.width;
		container.addChild(bitmap);

		glow = new createjs.Bitmap(this.assets['button_glow']);
		glow.y = (CONTENT_HEIGHT - glow.image.height) / 3;
		glow.x = (CONTENT_WIDTH - glow.image.width) / 2;
		glow.visible = false;
		container.addChild(glow);

		bitmap = new createjs.Bitmap(this.assets['button']);
		bitmap.y = (CONTENT_HEIGHT - bitmap.image.height) / 3;
		bitmap.x = (CONTENT_WIDTH - bitmap.image.width) / 2;
		container.addChild(bitmap);

		pressed = new createjs.Bitmap(this.assets['button_pressed']);
		pressed.y = (CONTENT_HEIGHT - pressed.image.height) / 3;
		pressed.x = (CONTENT_WIDTH - pressed.image.width) / 2;
		pressed.visible = false;
		container.addChild(pressed);

		bitmap.addEventListener('mousedown', function () {
			pressed.visible = true;
			self.stage.update();
		});

		bitmap.addEventListener('mouseover', function () {
			glow.visible = true;
			self.stage.update();
		});

		bitmap.addEventListener('mouseout', function () {
			glow.visible = false;
			pressed.visible = false;
			self.stage.update();
		});

		bitmap.addEventListener('click', function () {
			if (joined) {
				return;
			}

			joined = true;
			lobby.createGame(true);
		});

		glow2 = new createjs.Bitmap(this.assets['button_glow']);
		glow2.y = (CONTENT_HEIGHT - glow2.image.height) * 2 / 3;
		glow2.x = (CONTENT_WIDTH - glow2.image.width) / 2;
		glow2.visible = false;
		container.addChild(glow2);

		bitmap2 = new createjs.Bitmap(this.assets['button']);
		bitmap2.y = (CONTENT_HEIGHT - bitmap2.image.height) * 2/ 3;
		bitmap2.x = (CONTENT_WIDTH - bitmap2.image.width) / 2;
		container.addChild(bitmap2);

		pressed2 = new createjs.Bitmap(this.assets['button_pressed']);
		pressed2.y = (CONTENT_HEIGHT - pressed2.image.height) * 2 / 3;
		pressed2.x = (CONTENT_WIDTH - pressed2.image.width) / 2;
		pressed2.visible = false;
		container.addChild(pressed2);

		bitmap2.addEventListener('mousedown', function () {
			pressed2.visible = true;
			self.stage.update();
		});

		bitmap2.addEventListener('mouseover', function () {
			glow2.visible = true;
			self.stage.update();
		});

		bitmap2.addEventListener('mouseout', function () {
			glow2.visible = false;
			pressed2.visible = false;
			self.stage.update();
		});

		bitmap2.addEventListener('click', function () {
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

		this.stage.enableMouseOver(20);

		var label = new createjs.Text("Single Player", "bold 70px Arial", "#fff");
		label.x = 800;
		label.y = 345;
		container.addChild(label);

		label = new createjs.Text("Multi Player", "bold 70px Arial", "#fff");
		label.x = 815;
		label.y = 605;
		container.addChild(label);

		this.stage.update();
	};

	LobbyScreen.prototype.exit = function() {
		this.stage.removeChild(container);
		this.onExit();
	};

	return LobbyScreen;

});
