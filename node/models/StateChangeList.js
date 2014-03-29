var StateChangeList = function() {
	this.changes = {};
};

StateChangeList.prototype.add = function(playerId, property, value) {
	if (!this.changes[playerId]) {
		this.changes[playerId] = {};
	}
	this.changes[playerId][property] = value;
};

StateChangeList.prototype.getChanges = function() {
	return this.changes;
};

StateChangeList.prototype.reset = function() {
	this.changes = {};
};

module.exports = StateChangeList;