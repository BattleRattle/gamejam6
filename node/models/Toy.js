var toyId = 0;
var types = ['roboter', 'boot', 'teddy'].sort(function() { return Math.random() - 0.5; });
var typesIndex = 0;

var Toy = function(pos) {
	this.id = ++toyId;
	this.type = types[typesIndex++ % types.length];
	this.position = pos;
	this.owner = null;
};

module.exports = Toy;