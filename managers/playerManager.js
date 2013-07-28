var util = require("util");

exports.PlayerManager = function()
{
	var players = [];

	var addPlayer = function(player)
	{
		util.log("Adding player " + player.id);
	    players.push(player);
	};

	var removePlayer = function(player)
	{
		util.log("Removing player " + player.id);
		players.splice(players.indexOf(player), 1);
	};

	var getPlayerById = function(id)
	{
		for (var i = 0; i < players.length; i++) 
	    {
	        if (players[i].id == id)
	            return players[i];
	    };
	    return false;
	};

	return {
		getPlayerById: getPlayerById,
		removePlayer: removePlayer,
		addPlayer: addPlayer,
		players: players
	}
}