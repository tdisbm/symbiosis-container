"use strict";

const _ = require('lodash');

class Device {
  constructor(id, name, devices, data) {
    this.id = null;
    this.name = null;
    this.data = null;
    this.devices = [];

    this.setId(id);
    this.setDevices(devices);
    this.setName(name);
    this.setData(data);
  }

  setId(id) {
    if (_.isInteger(id)) {
      this.id = id;
    }

    return this;
  }

  getId() {
    return this.id;
  }

  setData(data) {
    if (typeof data !== 'undefined') {
      this.data = data;
    }

    return this;
  }

  getData() {
    return this.data;
  }

  addDevice(d) {
    if (d instanceof Device) {
      this.devices.push(Device);
    }

    return this;
  }

  removeDevice(i) {
    if (index > -1) {
      this.devices.splice(i, 1);
    }

    return this;
  }

  setDevices(devices) {
    this.devices = [];

    if (_.isArray(devices)) {
      for (let i = 0, n = devices.length; i < n; i++) {
        if (devices[i] instanceof Device) {
          this.devices.push(devices[i]);
        }
      }
    }

    return this;
  }

  getDevices() {
    return this.devices;
  }

  getDevice(i) {
    if (_.isInteger(i) && i <= this.devices.length && i > -1) {
      return this.devices[i];
    }

    return null;
  }

  setName(name) {
    this.name = _.isString(name) ? name : ''

    return this;
  }

  getName () {
    return this.name;
  }
}

module.exports = Device;
