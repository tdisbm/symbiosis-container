'use strict';

const symbiosis = require("symbiosis")("config/maps/symbiosis_entities.json");
const _ = require('lodash');

module.exports = (config) => {
  const port = _.get(config, 'connection.container_port', null);
  const console_connection_monitor = _.get(config, 'console_connection_monitor', false);
  const io = symbiosis.io.listen(port);

  const update_console = (io) => {
    process.stdout.write('\x1Bc');
    _.each(io.sockets.sockets, (socket) => {
      const headers = socket.handshake.headers;

      console.info('[+] CONNECTION: \n - Host: %s \n - User Agent: %s \n - Email: %s',
        headers['host'],
        headers['user-agent'],
        _.get(socket, 'handshake.query.email', null)
      );
    });
  };

  io.on('connect', (socket) => {
    if (console_connection_monitor) {
      update_console(io);

      socket.on("disconnect", () => {
        update_console(io);
      })
    }
  });

  return symbiosis;
};