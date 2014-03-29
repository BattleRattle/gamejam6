var AbstractEventHandler = require('./AbstractEventHandler.js');

var ActionEventHandler = function() {

};

ActionEventHandler.prototype = AbstractEventHandler.prototype;
ActionEventHandler.TYPE = 'action';


ActionEventHandler.prototype.moveLeft = function(player, event) {
    console.log(event.action + " -> " + event.state);
};

ActionEventHandler.prototype.moveRight = function(player, event) {
    console.log(event.action + " -> " + event.state);
};

ActionEventHandler.prototype.jump = function(player, event) {
    console.log(event.action + " -> " + event.state);
};

ActionEventHandler.prototype.pickupToy = function(player, event) {
    console.log(event.action + " -> " + event.state);
};

ActionEventHandler.prototype.dropToy = function(player, event) {
    console.log(event.action + " -> " + event.state);
};

module.exports = ActionEventHandler;