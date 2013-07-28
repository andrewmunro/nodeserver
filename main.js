var util = require("util");
var io = require("socket.io");

var ProxyHandler = require("./handlers/proxyHandler")
var PlayerHandler = require("./handlers/playerHandler");
var Player = require("./components/player").Player;

function boot()
{
	socket = io.listen(8001);

	socket.configure(function() 
	{
    	socket.set("transports", ["websocket"]);
    	socket.set("log level", 2);

	});

	setHandlers();
}

function setHandlers() 
{
	ProxyHandler.boot(8002);
    socket.sockets.on("connection", onSocketConnection);
}

onSocketConnection = function(client) 
{
    util.log("New player has connected: "+client.id);
    client.on("disconnect", PlayerHandler.onClientDisconnect);
    client.on("playerNew", PlayerHandler.onPlayerNew);
    client.on("playerMove", PlayerHandler.onPlayerMove);
}

boot();