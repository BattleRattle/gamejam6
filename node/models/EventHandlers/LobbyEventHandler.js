var AbstractEventHandler = require('./AbstractEventHandler.js');
var Response = require('./../Communication/Response');

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
};

LobbyEventHandler.prototype.enter = function(player, event) {
	console.log(event.action + " -> ");

	player.monsterId = event.monsterId;
	var responseEvent = {
		action: 'entered',
		playerId: player.id,
		games: player.lobby.games.map(function(game) {
			return {
				id: game.id,
				slotsTotal: game.slotsTotal,
				slotsUsed: game.players.length
			}
		})
	};

	this.createDirectResponse(player, LobbyEventHandler.TYPE, responseEvent);
};

LobbyEventHandler.prototype.join = function(player, event) {
    console.log(event.action + " -> " + event.gameId);

	for (var i in player.lobby.games) {
		if (player.lobby.games[i].id === event.gameId) {
			player.lobby.games[i].addPlayer(player);
		}
	}

    var responseEvent = {
        action: 'joined',
        gameId: player.getGame().id,
        player: {
            id: player.id,
            name: player.name
        }
    };

	this.connectionHandler.sendGameBroadcast(player.game, new Response(LobbyEventHandler.TYPE, responseEvent, Response.TYPE_BROADCAST_INCLUDE_SELF));
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