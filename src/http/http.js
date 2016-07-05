var http = require('http');

module.exports = function(app, argv) {
    var port = process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || argv.port;
    var host = process.env.OPENSHIFT_NODEJS_IP || argv.host || "127.0.0.1";
    
    return http.createServer(app).listen(port, host, function () {
        console.log("✔ Express server listening at %s:%d ", host, port);
    });
};
