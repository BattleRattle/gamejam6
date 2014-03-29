var AbstractEventHandler = require('./AbstractEventHandler.js');

var TickEventHandler = function() {};

TickEventHandler.prototype = AbstractEventHandler.prototype;
TickEventHandler.TYPE = 'tick';

TickEventHandler.prototype.tick = function(tick, changes) {
	this.createBroadcastResponse(null, TickEventHandler.TYPE, {
		tick: tick,
		changes: changes
	});
};

module.exports = TickEventHandler;