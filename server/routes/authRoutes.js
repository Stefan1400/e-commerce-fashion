const {
   getAllUsers
} = require('../controllers/authControllers');

const handleGetUsersRoute = (req, res) => {
   if (req.url === '/api/users' && req.method === 'GET') {
      console.log('route.js: before route call');
      getAllUsers(req, res);
      console.log('route.js: after route call');
   } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'users not found' }));
   }
}

module.exports = {
   handleGetUsersRoute
}