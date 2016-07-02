module.exports = function(app)
{
    app.get('/config', function(req, res){
        res.send(require('../../../config/parameters.json').connection) ; 
    })
};