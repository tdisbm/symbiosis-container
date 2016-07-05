var symbiosis = require("symbiosis")("config/maps/symbiosis_entities.json");

module.exports = function(argv) {
    var port = process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || argv.port;
    var io = symbiosis.getIo().listen(port);
    
    io.on('connect', function(socket) {
        var headers = socket.handshake.headers;
        
        console.info('[+] NEW CONNECTION: \n - Host: %s \n - User Agent: %s \n - Email: %s',
            headers['host'],
            headers['user-agent'],
            socket.handshake.query.email
        );
    });
    
    return io;
};