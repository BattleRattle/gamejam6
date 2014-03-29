var Response = require('../Communication/Response.js');

var AbstractEventHandler = function () {
	throw new Error('AbstractEventHandler is an abstract class');
};

AbstractEventHandler.prototype.setConnectionHandler = function (connectionHandler) {
	this.connectionHandler = connectionHandler;
};

AbstractEventHandler.prototype.getConnectionHandler = function () {
	return this.connectionHandler;
};

AbstractEventHandler.prototype.createDirectResponse = function (player, type, event) {
	var response = new Response(type, event, Response.TYPE_DIRECT);
	this.connectionHandler.handleResponse(player.getSocket(), response);
};

AbstractEventHandler.prototype.createBroadcastResponse = function (player, type, event, includeSelf) {
	if (typeof includeSelf === 'undefined') {
		includeSelf = true;
	}

	var response = new Response(type, event, includeSelf ? Response.TYPE_BROADCAST_INCLUDE_SELF : Response.TYPE_BROADCAST_EXCLUDE_SELF);
	this.connectionHandler.handleResponse(player ? player.getSocket() : null, response);
};

module.exports = AbstractEventHandler;