module.exports = function(app, argv) {
    var http = require('./http.js')(app, argv);
    var symbiosis = require('./symbiosis.js')(http);
    
    return {
        "http" : http,
        "symbiosis" : symbiosis
    }
};
    