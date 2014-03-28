var Response = function(type, event, broadcastType) {
	this.type = type;
	this.event = event;
	this.broadcastType = broadcastType;
};

Response.TYPE_DIRECT = 'direct';
Response.TYPE_BROADCAST_INCLUDE_SELF = 'broadcast_include_self';
Response.TYPE_BROADCAST_EXCLUDE_SELF = 'broadcast_exclude_self';

Response.prototype.getType = function () {
	return this.type;
};

Response.prototype.getEvent = function () {
	return this.event;
};

Response.prototype.getBroadcastType = function() {
	return this.broadcastType;
};

module.exports = Response;