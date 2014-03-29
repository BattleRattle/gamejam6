var AbstractEventHandler = require('./AbstractEventHandler.js');

var LobbyEventHandler = function() {};

LobbyEventHandler.prototype = AbstractEventHandler.prototype;
LobbyEventHandler.TYPE = 'lobby';

LobbyEventHandler.prototype.create = function(player, event) {
    console.log(event.action + " -> create");

	var game = player.lobby.createGame(event.slots);
	game.addPlayer(player);

    var responseEvent = {
        action: 'created',
        gameId: game.id,
        slotsTotal: game.slotsTotal,
        slotsUsed: game.getPlayers().length
    };

    this.createDirectResponse(player, LobbyEventHandler.TYPE, responseEvent);

	game.start();
};

LobbyEventHandler.prototype.enter = function(player, event) {
	console.log(event.action + " -> ");

	player.monsterId = event.monsterId;
	var responseEvent = {
		action: 'entered',
		playerId: player.id,
		games: [

		]
	};

	this.createDirectResponse(player, LobbyEventHandler.TYPE, responseEvent);
};

LobbyEventHandler.prototype.join = function(player, event) {
    console.log(event.action + " -> " + event.gameId);

    var responseEvent = {
        action: 'joined',
        gameId: player.getGame().id,
        player: {
            id: player.id,
            name: player.name
        }
    };

	this.createBroadcastResponse(null, GameEventHandler.TYPE, {
		action: 'end'
	});

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