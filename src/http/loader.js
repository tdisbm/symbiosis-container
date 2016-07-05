module.exports = function(app, argv) {
    var symbiosis = require('./symbiosis.js')(argv);
    
    return {
        "symbiosis" : symbiosis
    }
};
    