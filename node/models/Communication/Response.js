var Response = function(type, event) {
	this.type = type;
	this.event = event;
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

module.exports = Response;