var playerId = 0;
var START_HEALTH = 100;

var Player = function(socket/*, name, spawnPosition*/) {
	this.id = ++playerId;
	this.socket = socket;
	this.name = 'player-' + this.id; // TODO: set name
	this.score = 0;
	this.position = {
		x: 0, // TODO: use spawnPosition
		y: 0
	};
	this.velocity = {
		x: 0,
		y: 0
	};
	this.direction = 'right';
	this.health = START_HEALTH;
};

Player.prototype.getSocket = function () {
	return this.socket;
};

Player.prototype.addScore = function (score) {
	this.score += score;
};

Player.prototype.getScore = function () {
	return this.score;
};

module.exports = Player;