var Response = require('./Communication/Response.js');
var Player = require('./Player.js');
var PlayerEventHandler = require('./EventHandlers/PlayerEventHandler.js');
var SyncEventHandler = require('./EventHandlers/GameEventHandler.js');
var TickEventHandler = require('./EventHandlers/TickEventHandler.js');
var StateChangeList = require('./StateChangeList.js');
var playerHelper = require('./PlayerHelper.js');

var gameId = 0;
var TICK_RATE = 30;
var SYNC_RATE = 1;
var GAME_SLOTS = 1; // TODO: change to 3 later?

var Game = function(connectionHandler) {
	this.connectionHandler = connectionHandler;
	this.connectionEventFactory = this.connectionHandler.connectionEventFactory;
	this.players = [];
	this.tickInterval = null;
	this.syncInterval = null;
	this.id = ++gameId;
	this.currentTick = 0;
	this.changes = new StateChangeList();
	this.slotsTotal = GAME_SLOTS;
};

Game.prototype.start = function() {
	console.log('Start Game #' + this.id);
	var event = {
		action: 'start',
		gameId: this.id,
		players: playerHelper.extractPlayerData(this.players)
	};
	var response = new Response('game', event, Response.TYPE_BROADCAST_INCLUDE_SELF);
	this.connectionHandler.sendGameBroadcast(this, response);

	this.tickInterval = setInterval(this.tick.bind(this), 1000 / TICK_RATE);
	this.syncInterval = setInterval(this.sync.bind(this), 1000 / SYNC_RATE);
};

Game.prototype.addPlayer = function(player) {
	this.players.push(player);
	player.setGame(this);
};

Game.prototype.removePlayer = function(player) {
	var playerHandler = this.connectionEventFactory.getEventHandler(PlayerEventHandler.TYPE);
	playerHandler.playerLeave(player);
	this.players.splice(this.players.indexOf(player), 1);
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
					break;
				}
			}
		}
	}

	// calculate movements
	this.players.forEach(function(player) {
		if (player.actions.moveLeft && !player.actions.moveRight) {
			player.velocity.x -= 1;
			if (player.velocity.x < -10) player.velocity.x = -10;
		} else if (player.actions.moveRight && !player.actions.moveLeft) {
			player.velocity.x += 1;
			if (player.velocity.x > 10) player.velocity.x = 10;
		} else {
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
