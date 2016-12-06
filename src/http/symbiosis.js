var symbiosis = require("symbiosis")("config/maps/symbiosis_entities.json");

module.exports = function(argv) {
    const port = 9000/*process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || argv.port*/;
    const io = symbiosis.io.listen(port);
    
    io.on('connect', function(socket) {
        var headers = socket.handshake.headers;
        
        console.info('[+] NEW CONNECTION: \n - Host: %s \n - User Agent: %s \n - Email: %s',
            headers['host'],
            headers['user-agent'],
            socket.handshake.query.email
        );

        socket.on("disconnect", function() {
            console.info('[-] DISCONNECTED: \n - Host: %s \n - User Agent: %s \n - Email: %s',
                headers['host'],
                headers['user-agent'],
                socket.handshake.query.email
            );
        })
    });
    
    return io;
};