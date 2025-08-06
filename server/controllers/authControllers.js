const authModel = require('../models/authModels');

const getUsers = (req, res) => {
   res.writeHead(200, { 'Content-Type': 'application/json' });
   res.end(JSON.stringify(authModel));
}

module.exports = {
   getUsers
}