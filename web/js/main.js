
require.config({
	paths: {
		createjs: 'libs/createjs-2013.12.12.min'
	}

});

require([

	// Load our app module and pass it to our definition function
	'app',
], function(App){
	// The "app" dependency is passed in as "App"
	App.initialize();
});
