var http = require('http');
var request = require("request");

exports.boot = function(port)
{
	http.createServer(function(req, res)
	{
		req.url = req.url.replace("/?url=", "");
		req.pipe(request(req.url)).pipe(res);
	}).listen(port);
}