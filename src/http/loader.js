module.exports = function(argv) {
    var symbiosis = require('./symbiosis.js')(argv);
    
    return {
        "symbiosis" : symbiosis
    }
};
    