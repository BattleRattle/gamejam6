var Response = require('./Communication/Response.js');
var Player = require('./Player.js');
var PlayerEventHandler = require('./EventHandlers/PlayerEventHandler.js');
var GameEventHandler = require('./EventHandlers/GameEventHandler.js');
var SyncEventHandler = require('./EventHandlers/GameEventHandler.js');
var TickEventHandler = require('./EventHandlers/TickEventHandler.js');
var StateChangeList = require('./StateChangeList.js');

var gameId = 0;
var TICK_RATE = 1;
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
	this.changes = new StateChangeList();
};

Game.prototype.start = function() {
	console.log('Start Game #' + this.id);
	this.connectionEventFactory.getEventHandler(GameEventHandler.TYPE).start(this);

	this.tickInterval = setInterval(this.tick.bind(this), 1000 / TICK_RATE);
	this.syncInterval = setInterval(this.sync.bind(this), 1000 / SYNC_RATE);
};

Game.prototype.createPlayer = function(socket) {
	var player = new Player(socket, this);
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

	// apply changes to game state
	var changes = this.changes.getChanges();
	for (var index in changes) {
		for (var property in changes[index]) {
			for (var p in this.players) {
				if (this.players[p].id == index) {
					this.players[p].actions[property] = changes[index][property];
					continue;
				}
			}
		}
	}

	// calculate movements
	this.players.forEach(function(player) {
		if (player.actions.moveLeft && !player.actions.moveRight) {
			player.velocity.x -= 1;
			if (player.velocity.x < -10) player.velocity.x = -10;
		}
		if (player.actions.moveRight && !player.actions.moveLeft) {
			player.velocity.x += 1;
			if (player.velocity.x > 10) player.velocity.x = 10;
		}
		if (!player.actions.moveLeft && !player.actions.moveRight) {
			if (player.velocity.x < 0) {
				player.velocity.x += 1;
			} else if (player.velocity.x > 0) {
				player.velocity.x -= 1;
			}
		}

		player.position.x += player.velocity.x;	
	});

	this.connectionEventFactory.getEventHandler(TickEventHandler.TYPE).tick(this.currentTick, changes);
	this.changes.reset();
};

Game.prototype.sync = function() {
	this.connectionEventFactory.getEventHandler(SyncEventHandler.TYPE).start(this);
};

module.exports = Game;