var app = require('express')();
var argv = require('yargs').argv;

require('./src/http/loader.js')(app, argv);
require('./src/routing/loader.js')(app);

