'use strict';

const Feedback = require('../../node_modules/symbiosis/lib/middleware/elements/Feedback');
const util = require('util');
const _ = require('lodash');

const SYMBIOSIS_USER_ROOM_NAME = 'symbiosis_user';
const DEVICE_LIST_UPDATE_EVENT = 'device_name_list:update';
const STREAM_FEEDBACK_EVENT = 'stream_feedback:';

let streams = {};

const events = {
  stream_start: (socket, data, io) => {
    const interval = _.get(data, 'interval', null);
    const device_id = _.get(data, 'device_id', null);
    const key = _.get(data, 'key', null);

    if (interval && key) {
      const device_data_source = _.get(io, 'symbiosis_device.sources.device_data');
      let parameters = {};

      if (device_id) {
        parameters.device_id = device_id;
      }

      socket.emit(STREAM_FEEDBACK_EVENT + key, device_data_source(socket, parameters));

      streams[socket.id][key] = setInterval(() => {
        socket.emit(STREAM_FEEDBACK_EVENT + key, device_data_source(socket, parameters));
      }, interval);
    }
  },
  stream_stop: (socket, data) => {
    const key = _.get(data, 'key', null);
    if (key) {
      clearInterval(streams[socket.id][key]);
    }
  }
};

const lifecycles = {
  connect: (socket, io) => {
    const device_name_list = _.get(io, 'symbiosis_device.sources.device_name_list', null);

    streams[socket.id] = {};
    socket.join(SYMBIOSIS_USER_ROOM_NAME + _.get(socket, 'handshake.query.email'));

    if (device_name_list) {
      socket.emit(DEVICE_LIST_UPDATE_EVENT, device_name_list(socket));
    }
  },
  disconnect: (socket) => {
    _.each(streams[socket.id], (stream) => {
      clearInterval(stream);
    });
    delete streams[socket.id];
  }
};

module.exports = {
  lifecycles: lifecycles,
  events: events
};
