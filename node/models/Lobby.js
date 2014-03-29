var Game = require('./Game');
var Player = require('./Player');
var Response = require('./Communication/Response');

var Lobby = function(connectionHandler) {
	this.players = [];
	this.games = [];
	this.connectionHandler = connectionHandler;
	this.connectionHandler.init(this);
};

Lobby.prototype.createGame = function(slots) {
	var game = new Game(this.connectionHandler, slots);
	this.games.push(game);

	console.log('Created Game #' + game.id + ' with ' + slots + ' slots');

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