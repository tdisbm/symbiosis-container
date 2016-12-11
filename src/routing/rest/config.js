module.exports = (app) => {
  app.get('/config', (req, res) => {
    res.send(require('../../../config/parameters.json').connection);
  })
};