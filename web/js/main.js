
require.config({
	shim : {
		createjs : { exports: 'createjs' }
	},
	paths: {
		createjs: 'libs/createjs-2013.12.12.min',
		'App': 'app',
		'PreloaderScreen': 'screens/Preloader',
		'MenuScreen': 'screens/Menu',
		'CharacterScreen': 'screens/Character',
		'GameScreen': 'screens/Game',
		'GameOverScreen': 'screens/GameOver'
	}

});

require(['App'], function (App) {
	var app = new App();
	app.initialize();
});
