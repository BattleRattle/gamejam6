var PlayerEventHandler = require('./EventHandlers/PlayerEventHandler.js');

var ConnectionEventFactory = function(connectionHandler) {
	this.connectionHandler = connectionHandler;
	this.eventHandlers = {};
};

ConnectionEventFactory.prototype.getEventHandler = function(type) {
	if (this.eventHandlers[type]) {
		return this.eventHandlers[type];
	}

	switch (type) {
		case PlayerEventHandler.TYPE:
			this.eventHandlers[type] = new PlayerEventHandler();
			break;

		default:
			console.log('WARNING: Event handler is not implemented: ' + type);
			return null;
	}

	this.eventHandlers[type].setConnectionHandler(this.connectionHandler);

	return this.eventHandlers[type];
};

module.exports = ConnectionEventFactory;