var Response = require('./Communication/Response.js');
var Player = require('./Player.js');
var PlayerEventHandler = require('./EventHandlers/PlayerEventHandler.js');

var Game = function(connectionHandler) {
	this.connectionHandler = connectionHandler;
	this.connectionEventFactory = this.connectionHandler.connectionEventFactory;
	this.players = [];
	this.connectionHandler.init(this);
}

Game.prototype.start = function() {

};

Game.prototype.createPlayer = function(socket) {
	var player = new Player(socket);
	this.players.push(player);

	var playerHandler = this.connectionEventFactory.getEventHandler(PlayerEventHandler.TYPE);
	playerHandler.callNewPlayer(player);

	return player;
};

Game.prototype.removePlayer = function(socket) {
	var player = this.getPlayerBySocket(socket);
	var playerHandler = this.connectionEventFactory.getEventHandler(PlayerEventHandler.TYPE);
	playerHandler.callPlayerLeft(player);

	this.players.splice(this.players.indexOf(player), 1);
};

Game.prototype.getPlayerBySocket = function(socket) {
	return this.players.reduce(function(previous, player) {
		return previous || (player.getSocket() === socket ? player : null);
	});
};

Game.prototype.getPlayers = function() {
	return this.players;
};

module.exports = Game;