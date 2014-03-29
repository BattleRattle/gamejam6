var AbstractEventHandler = require('./AbstractEventHandler.js');
var Response = require('./../Communication/Response');

var TickEventHandler = function() {};

TickEventHandler.prototype = AbstractEventHandler.prototype;
TickEventHandler.TYPE = 'tick';

TickEventHandler.prototype.tick = function(game, tick, changes) {
	var response = new Response(TickEventHandler.TYPE, {tick: tick, changes: changes}, Response.TYPE_BROADCAST_INCLUDE_SELF);
	this.connectionHandler.sendGameBroadcast(game, response);
};

module.exports = TickEventHandler;