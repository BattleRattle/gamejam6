var AbstractEventHandler = require('./AbstractEventHandler.js');
var Response = require('./../Communication/Response');
var PlayerHelper = require('./../PlayerHelper');

var SyncEventHandler = function() {};

SyncEventHandler.prototype = AbstractEventHandler.prototype;
SyncEventHandler.TYPE = 'sync';

SyncEventHandler.prototype.start = function(game) {
	var event = {tick: game.currentTick, players: PlayerHelper.extractPlayerData(game.players)};
	var response = new Response(SyncEventHandler.TYPE, event, Response.TYPE_BROADCAST_INCLUDE_SELF);
	this.connectionHandler.sendGameBroadcast(game, response);
};

module.exports = SyncEventHandler;
