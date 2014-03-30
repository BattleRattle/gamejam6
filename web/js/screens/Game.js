define('GameScreen', [
	'createjs',
	'Movement',
	'TopHudView',
	'GameView',
	'ViewConstants',
	'PlayerView',
	'GirlView',
	'ToyView',
	'WatteView',
	'ItemView',
	'GameServerListener',
	'GameState'
], function(createjs, Movement, TopHud, View, ViewConstants, PlayerView, GirlView, ToyView, WatteView, ItemView, GameServerListener, GameState) {
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

		var view = new View(),
			topHud = new TopHud(),
			girl = new GirlView(),
			toy = new ToyView(),
			item = new ItemView(),
			watte = new WatteView(),
			movement = new Movement();

		var waiting = new createjs.Bitmap(assets['waiting']);;
		waiting.x = (2100 - waiting.image.width) / 2;
		waiting.y = (1050 - waiting.image.height) / 2;
		container.addChild(waiting);

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
				watte.update();
				self.stage.update();
			},
			'start': function(event) {
				container.removeChild(waiting);

				view.initialize(assets, container, event.event);
				topHud.initialize(assets, container, event.event.players);
				girl.initialize(assets, container);
				toy.initialize(assets, container, event.event.toys);
				item.initialize(assets, container);
				watte.initialize(assets, container);
				movement.initialize();

				for (var i in event.event.players) {
					var player = event.event.players[i];
					players[player.id] = new PlayerView();
					players[player.id].initialize(assets, container, player);
				}

				stage.update();
			},
			'end': function () {
				self.exit();
			},
			'sync': function (event) {
				topHud.update(event.event.players);
				for (var i in event.event.players) {
					var player = event.event.players[i];
//					players[player.id].updateSync(player);
				}
				stage.update();
			},
			'pickedUp': function (event) {
				toy.pickup(event.event.toyId, event.event.playerId);
				if (event.event.playerId == GameState.playerId) {
					//item.displayItem(toy.toys[toy.owned[GameState.playerId]]);
				}
				stage.update();
			},
			'dropped': function (event) {
				toy.drop(event.event.toyId, event.event.playerId);
				if (event.event.playerId == GameState.playerId) {
					//item.dropItem();
				}
				stage.update();
			},
			'cried': function (event) {
				players[event.event.playerId].cry(event)
			},
			'pickedUpItem': function (event) {
				players[event.event.playerId].transform(event.event.itemType);
				stage.update();
			},
			'itemUsed': function (event) {
				players[event.event.playerId].transform();
				if (event.event.itemType === 'watte') {
					watte.spawn(event.event.additional);
				}
				stage.update();
			},
			'disappeared': function (event) {
				watte.disappear(event.event.watteId);
				stage.update();
			}
		});

		this.stage.update();
	};

	Game.prototype.exit = function() {
		this.onExit(container);
	};

	return Game;

});
