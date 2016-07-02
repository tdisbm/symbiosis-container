var io = require("socket.io-client");
var argv = require('yargs').argv;
var Map = require('../node_modules/symbiosis/lib/Kernel/Map/Map.js');

var map = new Map('../config/maps/symbiosis_entities.json');
var nodes = map.getElements().nodes;
var node = null;

for (var i = 0, n = nodes.length; i < n; i++) {
    if (nodes[i].name == argv.node) {
        node = nodes[i];
        break;
    }
}

if (null === node) {
    console.info('Node "%s" is not defined on map');
    process.exit(1);
}

var port = process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || argv.port;
var host = process.env.OPENSHIFT_NODEJS_IP || argv.host || "127.0.0.1";
var query = [];


for (i = 0, n = node.handshake.parameters.length; i < n; i ++) {
    if (typeof argv[node.handshake.parameters[i].name] !== 'undefined') {
        query.push(node.handshake.parameters[i].name + "=" + argv[node.handshake.parameters[i].name]);
    }

    if (!node.handshake.parameters[i].hasOwnProperty('options')) {
        continue;
    }

    if (node.handshake.parameters[i].options.indexOf('identifier') !== -1) {
        query.push(node.handshake.parameters[i].name + "=" + argv.node)
    }
}

console.info("[+] Connect to: \n - Host: http://%s:%s \n - Query: %s", host, port, query.join('&'));

var socket = io.connect("http://" + host + ":" + port, {
    query : query.join('&')
});

socket.emit("hello");

socket.on("message", function(data){
    console.log(data);
});


