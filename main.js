var util = require("util");
var io = require("socket.io");

var ProxyHandler = require("./handlers/proxyHandler")
var PlayerHandler = require("./handlers/playerHandler");
var Player = require("./components/player");

function boot()
{

	socket = io.listen(8000);

	socket.configure(function() 
	{
    	socket.set("transports", ["websocket"]);
    	socket.set("log level", 2);

	});

	setHandlers();
}

function setHandlers() 
{
	ProxyHandler.boot();
    socket.sockets.on("connection", PlayerHandler.onSocketConnection);
}

boot();