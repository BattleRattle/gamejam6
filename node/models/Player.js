var Response = require('./Communication/Response');
var Watte = require('./Watte');

var playerId = 0;
var START_HEALTH = 100;
var MAX_TOY_PICKUP_DISTANCE = 50;
var COLLECT_GOAL = 3;
var HAMMER_DAMAGE_HORIZONTAL_RANGE = 200;
var HAMMER_DAMAGE_VERTICAL_RANGE = 50;
var HAMMER_DAMAGE = 35;

var Player = function(socket, lobby/*, name, spawnPosition*/) {
	this.id = ++playerId;
	this.socket = socket;
	this.game = null;
	this.name = 'player-' + this.id; // TODO: set name
	this.score = 0;
	this.collectedItems = 0;
	this.position = {
		x: 0, // TODO: use spawnPosition
		y: 0
	};
	this.velocity = {
		x: 0,
		y: 0
	};
    this.lastPosition = {
      x: 0,
      y: 0
    };
	this.actions = {
		moveLeft: false,
		moveRight: false,
		jump: false,
		pickupToy: false,
		dropToy: false,
		cry: false,
		useItem: false
	};
	this.paralyzed = false;
	this.isFalling = false;
	this.direction = 1;
	this.health = START_HEALTH;
	this.monsterId = null;
	this.lobby = lobby;
	this.toy = null;
	this.item = null;
	this.cryTicks = 0;
};

Player.prototype.getSocket = function () {
	return this.socket;
};

Player.prototype.setGame = function(game) {
	this.game = game;
};

Player.prototype.getGame = function() {
	return this.game;
};

Player.prototype.addScore = function (score) {
	this.score += score;
};

Player.prototype.getScore = function () {
	return this.score;
};

Player.prototype.getCollectedItems = function() {
	return this.collectedItems;
};

Player.prototype.cry = function (timeout) {
	this.paralyzed = true;
	this.velocity.x = 0;

	if (timeout !== -1) {
		setTimeout(function() {
			this.paralyzed = false;
		}.bind(this), 3000);
		var duration = 90;
	} else {
		var duration = 99999999999;
	}

	var response = new Response('action', {action: 'cried', playerId: this.id, duration: duration }, Response.TYPE_BROADCAST_INCLUDE_SELF);
	this.game.connectionHandler.sendGameBroadcast(this.game, response);
};

Player.prototype.pickupItem = function(item) {
	// check, if toy is already owned
	if (this.toy || this.item) {
		return;
	}

	// check distance
	if (Math.sqrt(Math.pow(this.position.x - item.position.x, 2) + Math.pow(this.position.y - item.position.y, 2)) > MAX_TOY_PICKUP_DISTANCE) {
		return;
	}

	this.item = item;
	var response = new Response('action', {action: 'pickedUpItem', playerId: this.id, itemType: item.type}, Response.TYPE_BROADCAST_INCLUDE_SELF);
	this.game.connectionHandler.sendGameBroadcast(this.game, response);
};

Player.prototype.useItem = function () {
	var item = this.item;
	this.item = null;

	var additional = null;

	switch (item.type) {
		case 'hammer':
			var currentPlayer = this;
			this.game.getPlayers().forEach(function(player) {
				if (player === currentPlayer) return;
				if ((player.position.x - currentPlayer.position.x > 0 && currentPlayer.direction == 1
					|| player.position.x - currentPlayer.position.x < 0 && currentPlayer.direction == -1)
					&& Math.abs(player.position.x - currentPlayer.position.x) < HAMMER_DAMAGE_HORIZONTAL_RANGE
					&& Math.abs(player.position.y - currentPlayer.position.y) < HAMMER_DAMAGE_VERTICAL_RANGE) {
					player.health -= HAMMER_DAMAGE;
					if (player.health > 0) {
						player.cry();
					} else {
						player.cry(-1);
					}

				}
			});
			break;

		case 'watte':
			var w = new Watte(this);
			this.game.watte.push(w);
			additional = {
				id: w.id,
				position: w.position,
				velocity: w.velocity
			};
			break;
	}

	var response = new Response('action', {action: 'itemUsed', playerId: this.id, itemType: item.type, additional: additional}, Response.TYPE_BROADCAST_INCLUDE_SELF);
	this.game.connectionHandler.sendGameBroadcast(this.game, response);
}

Player.prototype.pickup = function(toy) {
	// check, if toy is already owned
	if (toy.owner || this.toy || this.item) {
		return;
	}

	// check distance
	if (Math.sqrt(Math.pow(this.position.x - toy.position.x, 2) + Math.pow(this.position.y - toy.position.y, 2)) > MAX_TOY_PICKUP_DISTANCE) {
		return;
	}

	this.toy = toy;
	toy.owner = this;
	var response = new Response('action', {action: 'pickedUp', playerId: this.id, toyId: toy.id}, Response.TYPE_BROADCAST_INCLUDE_SELF);
	this.game.connectionHandler.sendGameBroadcast(this.game, response);
};

Player.prototype.drop = function() {
	if (!this.toy) {
		return;
	}

	var toyId = this.toy.id;
	this.collectedItems++;
	this.toy.owner = null;
	this.game.toys.splice(this.game.toys.indexOf(this.toy), 1);
	this.toy = null;

	var response = new Response('action', {action: 'dropped', playerId: this.id, toyId: toyId}, Response.TYPE_BROADCAST_INCLUDE_SELF);
	this.game.connectionHandler.sendGameBroadcast(this.game, response);

	if (this.collectedItems === COLLECT_GOAL) {
		response = new Response('game', {action: 'end'}, Response.TYPE_BROADCAST_INCLUDE_SELF);
		this.game.connectionHandler.sendGameBroadcast(this.game, response);
	}
};

module.exports = Player;
