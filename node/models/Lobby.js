var Game = require('./Game');
var Player = require('./Player');
var Response = require('./Communication/Response');

var Lobby = function(connectionHandler) {
	this.players = [];
	this.games = [];
	this.connectionHandler = connectionHandler;
	this.connectionHandler.init(this);
};

Lobby.prototype.createGame = function() {
	var game = new Game(this.connectionHandler);
	this.games.push(game);

	var event = {
		action: 'created',
		gameId: game.id,
		slotsTotal: game.slotsTotal,
		slotsUsed: game.players.length
	};

	var response = new Response('lobby', event, Response.TYPE_BROADCAST_INCLUDE_SELF);
	this.connectionHandler.handleResponse(null, response);

	console.log('Created Game #' + game.id);

	return game;
};

Lobby.prototype.createPlayer = function(socket) {
	var player = new Player(socket, this);
	this.players.push(player);

	console.log('Created Player #' + player.id);

	return player;
};

Lobby.prototype.removePlayer = function(socket) {
	var player = this.getPlayerBySocket(socket);
	this.players.splice(this.players.indexOf(player), 1);
};

Lobby.prototype.getPlayerBySocket = function(socket) {
	for (var i in this.players) {
		if (this.players[i].getSocket() === socket) {
			return this.players[i];
		}
	}

	return null;
};

module.exports = Lobby;