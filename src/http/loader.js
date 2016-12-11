'use strict';

module.exports = (config) => {
  return {
    "symbiosis" : require('./symbiosis.js')(config)
  }
};
    