var AbstractEventHandler = require('./AbstractEventHandler.js');

var LobbyEventHandler = function() {

};

LobbyEventHandler.prototype = AbstractEventHandler.prototype;
LobbyEventHandler.TYPE = 'lobby';


LobbyEventHandler.prototype.create = function(player, event) {
    console.log(event.action + " -> ");

    var responseEvent = {
        action: "created",
        gameId: 34,// TODO: get lobby data
        slotsTotal: 4,
        slotsUsed: 2
    };

    this.createDirectResponse(player, LobbyEventHandler.TYPE, responseEvent);
};

LobbyEventHandler.prototype.join = function(player, event) {
    console.log(event.action + " -> " + event.gameId);

    var responseEvent = {
        action: "join",
        gameId: 34, // TODO: get game ID
        player: {
            id: player.id,
            name: player.name
        }
    };

    // TODO: send to all players in game instance
    this.createDirectResponse(player, LobbyEventHandler.TYPE, responseEvent);
};

LobbyEventHandler.prototype.leave = function(player, event) {
    console.log(event.action + " -> " + event.playerId);

    var responseEvent = {
        action: "leave",
        playerId: player.id
    };

    // TODO: send to all players in game instance
    this.createDirectResponse(player, LobbyEventHandler.TYPE, responseEvent);
};

module.exports = LobbyEventHandler;