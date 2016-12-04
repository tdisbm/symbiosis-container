var ObjectCollection = require('../../node_modules/symbiosis/lib/Kernel/Util/ObjectCollection');

var device = function()
{
    this._data = new ObjectCollection();
    this._receiveEvent = 'message';
    this._init();
};


device.prototype = 
{
    _init : function()
    {
        var collection = null;
        var device = null;
        var query = null;
        var email = null;
        var $this = this;
        
        this.on($this._receiveEvent, function (socket, data) {
            query = socket.handshake.query;
            
            email = query.email;
            device = query.name;

            if (null === (collection = $this._data.getItem(email))) {
                collection = new ObjectCollection();
            }
            
            collection.addItem(device, data);
            $this._data.addItem(email, collection);
        });
        
        this.onDisconnect(function(socket){
            email = socket.handshake.query.email;
            device = socket.handshake.query.name;

            try {
                $this._data.getItem(email).removeItem(device);
            } catch(e) {}
        })
    },
    
    getByEmail : function(email) 
    {
        return this._data.getItem(email);
    }
};


module.exports = device;