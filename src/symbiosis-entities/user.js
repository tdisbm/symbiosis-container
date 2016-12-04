var user = function()
{
    this._sender = {};
    this._sendRate = 2000;
    this._sendEvent = 'message';
    
    this._init();
};


user.prototype =
{
    _init : function()
    {
        var $this = this;
        var email = null;
        var deviceData = null;

        this.onConnect(function(socket) {
            email = socket.handshake.query.email;

            $this._sender[email + socket.id] = setInterval(function() {
                deviceData = $this.getNode('device').getByEmail(email);
                var prepared = [];

                if (deviceData) {
                    for (var device in deviceData.items) {
                        if (!deviceData.items.hasOwnProperty(device)) {
                            continue;
                        }

                        prepared.push({
                            "name": device,
                            "data": null,
                            "devices": deviceData.items[device]
                        })
                    }

                    if (prepared.length) {
                        socket.emit($this._sendEvent, prepared);
                    }
                }
            }, $this._sendRate);
        }).onDisconnect(function(socket) {
            email = socket.handshake.query.email;
            
            clearInterval($this._sender[email + socket.id]);
            delete $this._sender[email + socket.id];
        });
    }
};


module.exports = user;