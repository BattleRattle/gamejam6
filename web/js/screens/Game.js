define('GameScreen', [
	'createjs',
	'Movement',
	'TopHudView',
	'GameView',
	'ViewConstants',
	'PlayerView'
], function(createjs, Movement, TopHud, View, ViewConstants, PlayerView){
	var container;

	var Game = function() {

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

		var playerView = new PlayerView();
		playerView.initialize(assets, container, {});


		var movement = new Movement();
		movement.initialize();

		this.stage.update();
//		this.exit();
	};

	Game.prototype.exit = function() {
		this.onExit();
	}

	return Game;

});
