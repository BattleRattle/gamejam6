var Response = require('./Communication/Response.js');
var Player = require('./Player.js');
var PlayerEventHandler = require('./EventHandlers/PlayerEventHandler.js');
var SyncEventHandler = require('./EventHandlers/GameEventHandler.js');
var TickEventHandler = require('./EventHandlers/TickEventHandler.js');
var StateChangeList = require('./StateChangeList.js');
var playerHelper = require('./PlayerHelper.js');
var CollisionTester = require('./CollisionTester.js');
var params = require('../../web/data/params.json');
var collisions = require('../../web/data/collisions.json');
var monsters = require('../../web/data/monsters.json');
var maps = require('../../web/data/maps.json');
var Toy = require('./Toy');

var gameId = 0;
var TICK_RATE = 30;
var SYNC_RATE = 1;
var MAX_TOY_PICKUP_DISTANCE = 30;

var Game = function(connectionHandler, slots) {
	this.connectionHandler = connectionHandler;
	this.connectionEventFactory = this.connectionHandler.connectionEventFactory;
	this.players = [];
	this.tickInterval = null;
	this.syncInterval = null;
	this.id = ++gameId;
	this.currentTick = 0;
	this.changes = new StateChangeList();
	this.slotsTotal = Math.min(3, Math.max(1, parseInt(slots)));
	this.collisionTester = new CollisionTester();
	this.mapId = Object.keys(maps)[parseInt(Math.random() * Object.keys(maps).length)];
	this.toys = generateToys(maps[this.mapId].girl);
};

Game.prototype.start = function() {
	for (var i in this.players) {
		var random = Object.keys(maps[this.mapId].spawns)[parseInt(Math.random() * Object.keys(maps[this.mapId].spawns).length)],
			y = maps[this.mapId].spawns[random].position.y,
			x = maps[this.mapId].spawns[random].position.x;
		this.players[i].position = {
			y: 200 - 50 + (1 + y) * 275,
			x: 300 * x + 50
		};
	}

	console.log('Start Game #' + this.id);
	var event = {
		action: 'start',
		gameId: this.id,
		mapId: this.mapId,
		players: playerHelper.extractPlayerData(this.players),
		toys: this.toys
	};
	var response = new Response('game', event, Response.TYPE_BROADCAST_INCLUDE_SELF);
	this.connectionHandler.sendGameBroadcast(this, response);

	this.tickInterval = setInterval(this.tick.bind(this), 1000 / TICK_RATE);
	this.syncInterval = setInterval(this.sync.bind(this), 1000 / SYNC_RATE);
};

Game.prototype.end = function() {
	console.log('Game #' + this.id + ' has ended');

	if (this.tickInterval) clearInterval(this.tickInterval);
	if (this.syncInterval) clearInterval((this.syncInterval));
};

Game.prototype.addPlayer = function(player) {
	this.players.push(player);
	player.setGame(this);
    player.lastPosition.x = player.position.x;
    player.lastPosition.y = player.position.y;

	if (this.players.length === this.slotsTotal) {
		setTimeout(function() {
			this.start();
		}.bind(this), 500);
	}
};

Game.prototype.removePlayer = function(player) {
	var playerHandler = this.connectionEventFactory.getEventHandler(PlayerEventHandler.TYPE);
	playerHandler.playerLeave(player);
	this.players.splice(this.players.indexOf(player), 1);

	if (!this.players.length) {
		this.end();
	}
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
	var max_velocity = params.movement.max_velocity;
	var max_acceleration = params.movement.acceleration;
	var friction = params.movement.friction;
	var jump_velocity = params.movement.jump_velocity;
	var gravity = params.movement.gravity;

	this.players.forEach(function(player) {
		if (player.actions.moveLeft && !player.actions.moveRight) {
			player.velocity.x -= max_acceleration;
			if (player.velocity.x < -max_velocity) player.velocity.x = -max_velocity;
		} else if (player.actions.moveRight && !player.actions.moveLeft) {
			player.velocity.x += max_acceleration;
			if (player.velocity.x > max_velocity) player.velocity.x = max_velocity;
		} else {
			if (player.velocity.x < 0) {
				if (player.velocity.x >= -friction) player.velocity.x = 0;
				else player.velocity.x += friction;
			} else if (player.velocity.x > 0) {
				if (player.velocity.x <= friction) player.velocity.x = 0;
				else player.velocity.x -= friction;
			}
		}

		player.position.x += player.velocity.x;

		if (player.actions.jump && !player.isFalling && !player.velocity.y) {
			player.velocity.y = jump_velocity;
			player.isFalling = true;
		} else {
			player.velocity.y -= gravity;
		}

		player.position.y -= player.velocity.y;

        var TILE_SIZE = 300;
        var OFFSET = 150;
        var mapWidth = maps[this.mapId]['tiles'][0].length * TILE_SIZE;
        var monsterWidth = monsters[player.monsterId].width;

        if (this.collisionTester.collide({
			position: player.position,
			collision: collisions[player.monsterId],
			width: monsterWidth,
			height: monsters[player.monsterId].height
		}, {
			position: {x: 0, y: -60},
			collision: collisions[this.mapId],
			width: mapWidth,
			height: maps[this.mapId]['tiles'].length * 270 + OFFSET
		})) {
            if (player.lastPosition.y < player.position.y) {
                player.position.y += player.velocity.y;
                player.velocity.y = 0;
                player.isFalling = false;
            } else {
                player.position.y += player.velocity.y;
                player.velocity.y = 0;
                player.isFalling = true;
            }
        }

        if (player.actions.pickupToy) {
            var nearestToy = null;
            var nearestDistance = null;
            this.toys.forEach(function(toy) {
				var distance = Math.sqrt(Math.pow(toy.position.x - player.position.x, 2) + Math.pow(toy.position.y - player.position.y, 2));
				if (distance > MAX_TOY_PICKUP_DISTANCE) {
					return;
				}

				if (nearestDistance == null || distance < nearestDistance) {
					nearestDistance = distance;
					nearestToy = toy;
				}
			});

            if (nearestToy) {
                player.pickup(nearestToy);
            }
        }

        if (player.position.y > 1050 - monsters[player.monsterId].height + 25) {
            player.position.y = 1050 - monsters[player.monsterId].height + 25;
            player.velocity.y = 0;
            player.isFalling = false;
        }

        if(player.position.x < 0){
            player.position.x = 0;
            if(player.velocity.x < 0){
                player.velocity.x = 0;
            }
        }else if(player.position.x + monsterWidth > mapWidth){
            player.position.x =  mapWidth - monsterWidth;
            player.velocity.x = 0;
        }

        player.lastPosition.x = player.position.x;
        player.lastPosition.y = player.position.y;

	}.bind(this));

	this.connectionEventFactory.getEventHandler(TickEventHandler.TYPE).tick(this, this.currentTick, changes);
	this.changes.reset();
};

Game.prototype.sync = function() {
	this.connectionEventFactory.getEventHandler(SyncEventHandler.TYPE).start(this);
};

function generateToys(girl) {
	var toys = [];
	for (var i=0; i<7; i++) {
		toys.push(new Toy({x: parseInt(girl.x + 300 * Math.random()), y: girl.y + 120}));
	}
	return toys;
}

module.exports = Game;
