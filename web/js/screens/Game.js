define('GameScreen', [
	'createjs',
	'Movement',
	'TopHudView',
	'GameView',
	'ViewConstants',
	'PlayerView',
	'GameServerListener',
	'GameState'
], function(createjs, Movement, TopHud, View, ViewConstants, PlayerView, GameServerListener, GameState) {
	var container,
		socket,
		players = {};

	var Game = function(so) {
		socket = so;
	};

	Game.prototype.registerOnExit = function(callback) {
		this.onExit = callback;
	};

	Game.prototype.resize = function () {
		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight;

		var scale = Math.min(this.canvas.width / ViewConstants.CONTENT_WIDTH, this.canvas.height / (100 + ViewConstants.CONTENT_HEIGHT));
		container.scaleX = scale;
		container.scaleY = scale;
		container.x = (this.canvas.width - ViewConstants.CONTENT_WIDTH * scale) / 2;
		this.stage.update();
	};

	Game.prototype.enter =  function (canvas, stage, assets) {
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

		var view = new View();
		view.initialize(assets, container, {/** game data */});

		var topHud = new TopHud();
		topHud.initialize(assets, container, [{}, {}, {}/** push players here */]);

		var movement = new Movement();
		movement.initialize();

		var listener = new GameServerListener();
		listener.initialize(socket, {
			'tick': function(event) {
				for (var i in players) {
					if (event.event.changes[i]) {
						players[i].update(event.event.changes[i]);
					} else {
						players[i].update({});
					}
				}
				self.stage.update();
			}, 'start': function(event) {
				for (var i in event.event.players) {
					var player = event.event.players[i];
					players[player.id] = new PlayerView();
					players[player.id].initialize(assets, container, player);
				}
			}
		});

		this.stage.update();
//		this.exit();
	};

	Game.prototype.exit = function() {
		this.onExit();
	}

	return Game;

});
