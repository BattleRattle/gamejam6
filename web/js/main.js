
require.config({
	shim : {
		createjs : { exports: 'createjs' },
		'socketio': { exports: 'io' }
	},
	paths: {
		createjs: 'libs/createjs-2013.12.12.min',
		socketio: '/socket.io/socket.io',
		'Socket': 'socket/Socket',
		'App': 'app',
		'PreloaderScreen': 'screens/Preloader',
		'MenuScreen': 'screens/Menu',
		'CharacterScreen': 'screens/Character',
		'GameScreen': 'screens/Game',
		'GameOverScreen': 'screens/GameOver',
		'Movement': 'player/Movement',
		'TopHudView': 'views/TopHud',
		'TopHudPlayerView': 'views/TopHudPlayer',
		'GameView': 'views/Game',
		'MapView': 'views/Map',
		'BackgroundView': 'views/Background',
		'ViewConstants': 'views/Constants'
	}

});

require(['App'], function (App) {
	var app = new App();
	app.initialize();
});
