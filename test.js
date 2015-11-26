var http = require('http');

var server = http.createServer(function(req, res) {
    console.info(req);
    res.end();
});
server.listen(3000);


