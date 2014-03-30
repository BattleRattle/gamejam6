var WATTE_SPEED = 15;
var id = 0;

var Watte = function(player) {
	this.id = ++id;
	this.position = {
		x: player.position.x,
		y: player.position.y
	};
	this.velocity = {
		x: player.direction * WATTE_SPEED,
		y: 2
	};
	this.owner = player;
};

module.exports = Watte;