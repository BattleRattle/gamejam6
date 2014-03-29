var playerId = 0;
var START_HEALTH = 100;

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
	this.actions = {
		moveLeft: false,
		moveRight: false,
		jump: false,
		pickupToy: false,
		dropToy: false
	};
	this.direction = 'right';
	this.health = START_HEALTH;
	this.monsterId = null;
	this.lobby = lobby;
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

module.exports = Player;