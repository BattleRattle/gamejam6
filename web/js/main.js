
require.config({
	shim : {
		createjs : { exports: 'createjs' }
	},
	paths: {
		createjs: 'libs/createjs-2013.12.12.min',
		'App': 'app',
		'Preloader': 'screens/Preloader'
	}

});

require(['App'], function (App) {
	var app = new App();
	app.initialize();
});
