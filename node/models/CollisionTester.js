var CollisionTester = function() {};

CollisionTester.prototype.collide = function(a, b) {
	if (a.position.x + a.width <= b.position.x || b.position.x + b.width <= a.position.x) {
		return false;
	}

	if (a.position.y + a.height <= b.position.y || b.position.y + b.height <= a.position.y) {
		return false;
	}

	var rel_x, rel_y;
	for (var x in a.collision) {
		rel_x = parseInt(parseInt(x) + a.position.x - b.position.x);
		if (typeof b.collision[rel_x] === 'undefined') {
			continue;
		}

		for (var y  in a.collision[x]) {
			rel_y = parseInt(parseInt(y) + a.position.y - b.position.y);

			if (typeof b.collision[rel_x][rel_y] !== 'undefined') {
				return true;
			}
		}
	}

	return false;
};

module.exports = CollisionTester;