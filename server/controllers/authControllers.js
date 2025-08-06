const authModel = require('../models/authModels');

const getAllUsers = async (req, res) => {
   try {
      const users = await authModel.fetchAllUsers();

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(users));
   } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: '500 error getting users' }));
   }
}

module.exports = {
   getAllUsers
}