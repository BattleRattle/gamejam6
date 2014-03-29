
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
		'LobbyScreen': 'screens/Lobby',
		'Movement': 'player/Movement',
		'TopHudView': 'views/TopHud',
		'TopHudPlayerView': 'views/TopHudPlayer',
		'GameView': 'views/Game',
		'MapView': 'views/Map',
		'PlayerView': 'views/Player',
		'ToyView': 'views/Toy',
		'BackgroundView': 'views/Background',
		'ViewConstants': 'views/Constants',
		'Lobby': 'lobby/Lobby',
		'ClientSocketListener': 'socket/ClientSocketListener',
		'LobbyClientListener': 'lobby/LobbyClientListener',
		'LobbyServerListener': 'lobby/LobbyServerListener',
		'GameState': 'game/State',
		'GameServerListener': 'game/GameServerListener',
		'CollisionTester': 'player/CollisionTester',
		'GirlView': 'views/Girl'
	}

});

require(['App'], function (App) {
	var app = new App();
	app.initialize();
});
