var Response = require('./Communication/Response.js');
var Player = require('./Player.js');
var PlayerEventHandler = require('./EventHandlers/PlayerEventHandler.js');
var GameEventHandler = require('./EventHandlers/GameEventHandler.js');
var SyncEventHandler = require('./EventHandlers/GameEventHandler.js');

var gameId = 0;
var TICK_RATE = 30;
var SYNC_RATE = 1;

var Game = function(connectionHandler) {
	this.connectionHandler = connectionHandler;
	this.connectionEventFactory = this.connectionHandler.connectionEventFactory;
	this.players = [];
	this.connectionHandler.init(this);
	this.tickInterval = null;
	this.syncInterval = null;
	this.id = ++gameId;
	this.currentTick = 0;
};

Game.prototype.start = function() {
	console.log('Start Game #' + this.id);
	this.connectionEventFactory.getEventHandler(GameEventHandler.TYPE).start(this);

	this.tickInterval = setInterval(this.tick.bind(this), 1000 / TICK_RATE);
	this.syncInterval = setInterval(this.sync.bind(this), 1000 / SYNC_RATE);
};

Game.prototype.createPlayer = function(socket) {
	var player = new Player(socket);
	this.players.push(player);

	var playerHandler = this.connectionEventFactory.getEventHandler(PlayerEventHandler.TYPE);
	playerHandler.playerJoin(player);

	return player;
};

Game.prototype.removePlayer = function(socket) {
	var player = this.getPlayerBySocket(socket);
	var playerHandler = this.connectionEventFactory.getEventHandler(PlayerEventHandler.TYPE);
	playerHandler.playerLeave(player);
	this.players.splice(this.players.indexOf(player), 1);
};

Game.prototype.getPlayerBySocket = function(socket) {
	for (var i in this.players) {
		if (this.players[i].getSocket() === socket) {
			return this.players[i];
		}
	}

	return null;
};

Game.prototype.getPlayers = function() {
	return this.players;
};

Game.prototype.tick = function() {
	this.currentTick++;
};

Game.prototype.sync = function() {
	this.connectionEventFactory.getEventHandler(SyncEventHandler.TYPE).start(this);
};

module.exports = Game;