'use strict';

const Feedback = require('../../node_modules/symbiosis/lib/middleware/elements/Feedback');
const Device = require('../entity/Device');
const util = require('util');
const _ = require('lodash');

const SYMBIOSIS_USER_ROOM_NAME = 'symbiosis_user';
const DEVICE_LIST_UPDATE_EVENT = 'device_name_list:update';

let devices = {};
let devices_names = {};
let last_id = 1;

const sources = {
  device_data : (socket, data) => {
    const devices_data = _.get(devices, _.get(socket, 'handshake.query.email'), []);
    const device_id = _.get(data, 'device_id', null);

    let response = new Feedback();

    if (0 == devices_data.length) {
      return response
        .setStatus(Feedback.FEEDBACK_STATUS_FAILURE)
        .setData({
          "message" : "No devices"
        });
    }

    if (device_id) {
      for (let i = 0; i < devices_data.length; i++) {
        if (device_id == devices_data[i].getId()) {
          response.setData(devices_data[i].getDevices());
        }
      }
    } else {
      response.setData(devices_data);
    }

    return response;
  },
  device_name_list : (socket) => {
    const names = _.get(devices_names, _.get(socket, 'handshake.query.email', null), []);
    let response = new Feedback();

    if (!names) {
      response.setStatus(Feedback.FEEDBACK_STATUS_FAILURE);
    }

    return response.setData(names);
  }
};

const events = {
  device_data_push : (socket, data) => {
    const device_name = _.get(socket, 'handshake.query.name', null);
    const email = _.get(socket, 'handshake.query.email', null);
    let device_data = _.get(devices, email, []);
    let new_devices_list = [];

    for (let i = 0; i < device_data.length; i++) {
      if (device_data[i].getName() == device_name) {
        for (let j = 0, m = data.length; j < m; j++) {
          if (data[j].hasOwnProperty('name') && data[j].hasOwnProperty('data'))
          new_devices_list.push(new Device(
            device_data[i].getId(),
            data[j].name,
            null,
            data[j].data
          ));
        }
        device_data[i].setDevices(new_devices_list);
        break;
      }
    }
  }
};

const lifecycles = {
  connect: (socket, io) => {
    const email = _.get(socket, 'handshake.query.email');
    const name = _.get(socket, 'handshake.query.name');

    let d = devices[email];
    let dn = devices_names[email];

    if (typeof d === 'undefined') {
      d = devices[email] = [];
    }

    if (typeof dn === 'undefined') {
      dn = devices_names[email] = [];
    }

    if (dn.indexOf(name) !== -1) {
      socket.disconnect();
      return;
    }

    d.push(new Device(++last_id, name, null, []));
    dn.push({name: name, id: last_id});

    io.to(SYMBIOSIS_USER_ROOM_NAME + email).emit(
      DEVICE_LIST_UPDATE_EVENT,
      sources.device_name_list(socket)
    )
  },
  disconnect: (socket, io) => {
    const email = _.get(socket, 'handshake.query.email');
    const name = _.get(socket, 'handshake.query.name');

    _.pull(_.get(devices_names, email, []), name);
    _.remove(_.get(devices, email, []), {
      name: name
    });

    io.to(SYMBIOSIS_USER_ROOM_NAME + email).emit(
      DEVICE_LIST_UPDATE_EVENT,
      sources.device_name_list(socket)
    )
  }
};

module.exports = {
  lifecycles: lifecycles,
  sources: sources,
  events: events
};