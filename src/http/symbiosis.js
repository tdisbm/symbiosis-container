var symbiosis = require("symbiosis")("config/maps/symbiosis_entities.json");

module.exports = function(http) {
    var io = symbiosis.getIo().listen(http);
    
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