var express = require('express'),
	routes = require('./routes'),
	http = require('http'),
	path = require('path'),
	io = require('socket.io').listen(3001),
	ConnectionHandler = require('./models/ConnectionHandler'),
	Game = require('./models/Game');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, '/../web')));

// development only
if ('development' == app.get('env')) {
	app.use(express.errorHandler());
}

app.get('/', routes.index);

http.createServer(app).listen(app.get('port'), function () {
	console.log('Express server listening on port ' + app.get('port'));
});

connectionHandler = new ConnectionHandler(io);
var game = new Game(connectionHandler);
game.start();