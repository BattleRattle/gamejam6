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
var MAX_TOY_PICKUP_DISTANCE = 50;
var MAX_TOY_DROP_DISTANCE = 4900; // squared -> 70 is actual distance
var WATTE_GRAVITY = 0.1;
var WATTE_DAMAGE = 35;

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
	this.toys = generateToys(maps[this.mapId].girl, this.slotsTotal * 3);
	this.watte = [];
    this.usableItem = getUsableItems(this.mapId);
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

	var TILE_SIZE = 300;
	var OFFSET = 150;
	var mapWidth = maps[this.mapId]['tiles'][0].length * TILE_SIZE;

	this.players.forEach(function(player) {
		if (player.actions.cry && player.cryTicks == 0) {
			player.cryTicks = 90;
			player.cry();
		}

		if (player.actions.useItem && player.item) {
			player.useItem();
		}

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

		if (player.paralyzed) player.velocity.x = 0;
		if (player.cryTicks > 0) player.cryTicks--;

		player.position.x += player.velocity.x;

		if (player.actions.jump && !player.isFalling && !player.velocity.y && !player.paralyzed) {
			player.velocity.y = jump_velocity;
			player.isFalling = true;
		} else {
			player.velocity.y -= gravity;
		}

		player.position.y -= player.velocity.y;

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

		if (player.actions.dropToy) {
			var dropPosition = maps[this.mapId].drops[0].position;

            var dx = dropPosition.x - player.position.x;
            var dy = dropPosition.y - player.position.y;
			var distance = dx*dx + dy*dy;

			if (distance < MAX_TOY_DROP_DISTANCE) {
				player.drop();
			}
		}

        if (player.position.y > 1050 - monsters[player.monsterId].height + 25) {
            player.position.y = 1050 - monsters[player.monsterId].height + 25;
            player.velocity.y = 0;
            player.isFalling = false;
        }

        if (player.position.x < 0) {
            player.position.x = 0;
            if(player.velocity.x < 0){
                player.velocity.x = 0;
            }
        } else if (player.position.x + monsterWidth > mapWidth) {
            player.position.x =  mapWidth - monsterWidth;
            player.velocity.x = 0;
        }

		if (player.velocity.x > 0 && player.direction === -1 || player.velocity.x < 0 && player.direction === 1) {
			player.direction *= -1;
		}

        player.lastPosition.x = player.position.x;
        player.lastPosition.y = player.position.y;

        if(!player.item){
            for (var i in this.usableItem) {
                player.pickupItem(this.usableItem[i]);
            }
        }

	}.bind(this));

	this.watte.forEach(function(watte) {
		watte.velocity.y -= WATTE_GRAVITY;
		watte.position.x += watte.velocity.x;
		watte.position.y -= watte.velocity.y;

		// map collision
		if (watte.position.x <= 0 || watte.position.x >= mapWidth) {
			this.watte.splice(this.watte.indexOf(watte), 1);

			var response = new Response('watte', {action: 'disappeared', watteId: watte.id}, Response.TYPE_BROADCAST_INCLUDE_SELF);
			this.connectionHandler.sendGameBroadcast(this, response);

			return;
		}

		// player collision (approximated)
		var watteRadius = 22;
		var monsterRadius = 50;
		var monsterCenterOffsets = {
			'monster1': {x: 80, y: 80},
			'monster2': {x: 62, y: 67},
			'monster3': {x: 50, y: 68}
		};

		var watteCenter = {
			x: watte.position.x + watteRadius,
			y: watte.position.y + watteRadius
		};

		for (var i in this.players) {
			if (this.players[i] === watte.owner) {
				continue;
			}

			var playerCenter = {
				x: this.players[i].position.x + monsterCenterOffsets[this.players[i].monsterId].x,
				y: this.players[i].position.y + monsterCenterOffsets[this.players[i].monsterId].y
			};
			var distance = Math.sqrt(Math.pow(playerCenter.x - watteCenter.x, 2) + Math.pow(playerCenter.y - watteCenter.y, 2));
			if (distance <= watteRadius + monsterRadius) {
				this.players[i].health -= WATTE_DAMAGE;
				this.watte.splice(this.watte.indexOf(watte), 1);

				if (this.players[i].health <= 0) {
					this.players[i].cry(-1);
				}

				var response = new Response('watte', {action: 'disappeared', watteId: watte.id}, Response.TYPE_BROADCAST_INCLUDE_SELF);
				this.connectionHandler.sendGameBroadcast(this, response);

				return;
			}
		}
	}.bind(this));

	this.players.forEach(function(player) {
		if (player.health <= 0) {
			var response = new Response('player', {action: 'died', playerId: player.id}, Response.TYPE_BROADCAST_INCLUDE_SELF);
			this.connectionHandler.sendGameBroadcast(this, response);
		}
	}.bind(this));

	this.connectionEventFactory.getEventHandler(TickEventHandler.TYPE).tick(this, this.currentTick, changes);
	this.changes.reset();
};

Game.prototype.sync = function() {
	this.connectionEventFactory.getEventHandler(SyncEventHandler.TYPE).start(this);
};

function generateToys(girl, amount) {
	var toys = [];
	for (var i=0; i<amount; i++) {
		toys.push(new Toy({x: parseInt(girl.x + 300 * Math.random()), y: girl.y + 120}));
	}
	return toys;
}

function getUsableItems(mapId) {
	var items = maps[mapId].deco,
		usable = [],
		item;

	for (var i in items) {
		item = items[i];

		// adjust last value based on monster height and item height
		if ("watte" === item.type) {
            usable.push({type: item.type,
                position: {
                    x: 300 * item.position.x + 50,
                    y: 200 - 50 + (1 + item.position.y) * 270 + 95 - 120}});
		}

		if ("hammer" === item.type) {
			usable.push({type: item.type,
                position: {
                    x: 300 * item.position.x + 50,
                    y: 200 - 50 + (1 + item.position.y) * 270 + 95 - 120}});
		}
	}

	return usable;
}

module.exports = Game;
