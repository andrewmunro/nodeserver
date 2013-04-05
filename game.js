var util = require("util");
var io = require("socket.io");
var Player = require("./player").Player;
var http = require('http');
var request = require("request");
var url = require("url");

function boot()
{
	players = [];
	socket = io.listen(8000);

	http.createServer(function(req, res)
	{
		req.url = req.url.replace("/?url=", "");
		req.pipe(request(req.url)).pipe(res);
	}).listen(8001);

	socket.configure(function() 
	{
    	socket.set("transports", ["flashsocket"]);
    	socket.set("log level", 2);

	});

	setEventHandlers();
}

var setEventHandlers = function() 
{
    socket.sockets.on("connection", onSocketConnection);
};

function onSocketConnection(client) 
{
    util.log("New player has connected: "+client.id);
    client.on("disconnect", onClientDisconnect);
    client.on("playerNew", onPlayerNew);
    client.on("playerMove", onPlayerMove);
};

function onClientDisconnect() 
{
	var player = getPlayerById(this.id);
	util.log("Player has disconnected: "+player.id);

	// Player not found
	if (!player) {
		util.log("Player not found: "+this.id);
		return;
	};

    players.splice(players.indexOf(player), 1);
    this.broadcast.emit("playerDisconnect",
    {
    	id: player.id
    })
};

function onPlayerNew(data)
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
	for (var i = 0; i < players.length; i++) 
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

	players.push(player);
};

function onPlayerMove(data) 
{
	var player = getPlayerById(this.id);
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
	//util.log("R: " + player.getR());

};

function getPlayerById(id) 
{
    for (var i = 0; i < players.length; i++) 
    {
        if (players[i].id == id)
            return players[i];
    };
    return false;
};

boot();