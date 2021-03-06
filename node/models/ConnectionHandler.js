var ConnectionEventFactory = require('./ConnectionEventFactory.js');
var Response = require('./Communication/Response.js');

var ConnectionHandler = function(io) {
	this.io = io;
	this.lobby = null;
	this.connectionEventFactory = new ConnectionEventFactory(this);
};

ConnectionHandler.prototype.init = function(lobby) {
	this.lobby = lobby;

	this.io.sockets.on('connection', function(socket) {
		this.handleConnection(socket);
	}.bind(this));
};

ConnectionHandler.prototype.handleConnection = function(socket) {
	var player = this.lobby.createPlayer(socket);

	socket.emit('debug', process.env.DEBUG ? true : false);

	socket.on('message', function(data) {
		this.callEventHandler(player, data);
	}.bind(this));

	socket.on('disconnect', function() {
		this.handleDisconnect(socket);
	}.bind(this));
};

ConnectionHandler.prototype.handleDisconnect = function(socket) {
	this.lobby.removePlayer(socket);
};

ConnectionHandler.prototype.callEventHandler = function(player, data) {
	var object = JSON.parse(data);
	var handler = this.connectionEventFactory.getEventHandler(object.type);

	return handler ? handler[object.event.action](player, object.event) : null;
};

ConnectionHandler.prototype.handleResponse = function(socket, response) {
	if (!response) {
		return;
	}

	if (response.getBroadcastType() === Response.TYPE_DIRECT) {
		this.sendResponse(socket, response);
	} else if (response.getBroadcastType() === Response.TYPE_BROADCAST_INCLUDE_SELF) {
		this.sendBroadcast(socket, response, true);
	} else if (response.getBroadcastType() === Response.TYPE_BROADCAST_EXCLUDE_SELF) {
		this.sendBroadcast(socket, response, false);
	} else {
		throw new Error('Response type not implemented: ' + response.getType());
	}
};

ConnectionHandler.prototype.sendResponse = function(socket, response) {
	socket.send(this.createRawResponse(response));
};

ConnectionHandler.prototype.sendBroadcast = function(socket, response, includeSelf) {
	var sendingPlayer = this.lobby.getPlayerBySocket(socket);
	if (!sendingPlayer && !includeSelf) {
		return;
	}

	this.lobby.players.forEach(function(player) {
		if (!includeSelf && sendingPlayer === player) return;
		player.getSocket().send(this.createRawResponse(response));
	}.bind(this));
};

ConnectionHandler.prototype.sendGameBroadcast = function(game, response) {
	game.getPlayers().forEach(function(player) {
		player.getSocket().send(this.createRawResponse(response));
	}.bind(this));
};

ConnectionHandler.prototype.createRawResponse = function(response) {
	return JSON.stringify({
		type: response.getType(),
		event: response.getEvent()
	});
};

module.exports = ConnectionHandler;
