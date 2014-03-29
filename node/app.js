var express = require('express'),
	routes = require('./routes'),
	http = require('http'),
	path = require('path'),
	socketio = require('socket.io'),
	ConnectionHandler = require('./models/ConnectionHandler'),
	Lobby = require('./models/Lobby');

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

	var io = socketio.listen(this);
	var connectionHandler = new ConnectionHandler(io);
	new Lobby(connectionHandler);
});
