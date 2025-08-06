const {
   getUsers
} = require('../controllers/authControllers');

const handleGetUsersRoute = (req, res) => {
   if (req.url === '/api/users' && req.method === 'GET') {
      getUsers(req, res);
   } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'users not found' }));
   }
}

module.exports = {
   handleGetUsersRoute
}