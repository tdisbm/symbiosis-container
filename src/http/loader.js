module.exports = function(app, argv) {
    var http = require('./http.js')(app, argv);
    var symbiosis = require('./symbiosis.js')(argv);
    
    return {
        "http" : http,
        "symbiosis" : symbiosis
    }
};
    