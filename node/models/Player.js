var Response = require('./Communication/Response');

var playerId = 0;
var START_HEALTH = 100;
var MAX_TOY_PICKUP_DISTANCE = 50;
var COLLECT_GOAL = 3;

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
		dropToy: false
	};
	this.isFalling = false;
	this.direction = 'right';
	this.health = START_HEALTH;
	this.monsterId = null;
	this.lobby = lobby;
	this.toy = null;
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

Player.prototype.pickup = function(toy) {
	// check distance
	if (Math.sqrt(Math.pow(this.position.x - toy.position.x, 2) + Math.pow(this.position.x - toy.position.x, 2)) > MAX_TOY_PICKUP_DISTANCE) {
		return;
	}

	// check, if toy is already owned
	if (toy.owner || this.toy) {
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