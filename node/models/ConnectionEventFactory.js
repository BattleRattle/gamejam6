var PlayerEventHandler = require('./EventHandlers/PlayerEventHandler.js');

var ConnectionEventFactory = function(connectionHandler) {
	this.connectionHandler = connectionHandler;
	this.eventHandlers = {};
};

ConnectionEventFactory.prototype.getEventHandler = function(remoteClass) {
	if (this.eventHandlers[remoteClass]) {
		return this.eventHandlers[remoteClass];
	}

	switch (remoteClass) {
		case ActionEventHandler.CLASS_NAME:
			this.eventHandlers[remoteClass] = new ActionEventHandler();
			break;

		default:
			throw new Error('event handler is not implemented: ' + remoteClass);
	}

	this.eventHandlers[remoteClass].setConnectionHandler(this.connectionHandler);

	return this.eventHandlers[remoteClass];
};

module.exports = ConnectionEventFactory;