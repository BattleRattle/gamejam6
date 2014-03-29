var toyId = 0;
var types = ['roboter', 'boot', 'teddy'].sort(function() { return Math.random() - 0.5; });
var typesIndex = 0;

var Toy = function() {
	this.id = ++toyId;
	this.type = types[typesIndex++ % types.length];
	this.position = {
		x: parseInt(50 + Math.random() * 150),
		y: 25 // <-- don't try this hardcoded stuff at home, kids!
	};
};

module.exports = Toy;