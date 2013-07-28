var util = require("util");
var playerManager = require("../managers/playerManager").PlayerManager;
var Player = require("../components/player").Player;
var playerManagerInstance = new playerManager();

exports.onClientDisconnect = function(data)
{
	var player = playerManagerInstance.getPlayerById(this.id);
	util.log("Player has disconnected: "+player.id);
	util.log(playerManagerInstance.players);

	// Player not found
	if (!player) {
		util.error("Player not found: "+this.id);
		return;
	};

	playerManagerInstance.removePlayer(player)
    this.broadcast.emit("playerDisconnect",
    {
    	id: player.id
    })
};

exports.onPlayerNew = function(data)
{
	var player = new Player(data.x, data.y, data.z, data.r);
	player.id = this.id;
	util.log("NewPlayer X:" + player.getX() + " Y:" + player.getY() + " Z: "+player.getZ() + " R: " + player.getR());

	//Send this player to existing clients (this.broadcast.emit = all clients except this)
	this.broadcast.emit("playerNew", 
	{
		id: player.id, 
		x: player.getX(), 
		y: player.getY(), 
		z: player.getZ(),
		r: player.getR()
	});

	//Send existing clients to this player (this.emit = only this client)
	for (var i = 0; i < playerManagerInstance.players.length; i++) 
	{
	    this.emit("playerNew", 
	    	{
	    		id: players[i].id, 
	    		x: players[i].getX(), 
	    		y: players[i].getY(), 
	    		z: player.getZ(),
	    		r: player.getR()
	    	});
	};

	playerManagerInstance.addPlayer(player);
};

exports.onPlayerMove = function(data)
{
	var player = playerManagerInstance.getPlayerById(this.id);
	if (!player) 
	{
		util.log("Player not found: "+this.id);
		return;
	};

	player.setX(data.x);
	player.setY(data.y);
	player.setZ(data.z);
	player.setR(data.r);

	this.broadcast.emit("playerMove", 
		{
			id: player.id, 
			x: player.getX(), 
			y: player.getY(),
			z: player.getZ(),
			r: player.getR()
		});
};