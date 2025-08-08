const {
   getAllUsers,
   registerNewUser,
} = require('../controllers/authControllers');

const handleUsersRoute = (req, res) => {
   
}

const handleGetUsersRoute = (req, res) => {
   if (req.url === '/api/users' && req.method === 'GET') {
      getAllUsers(req, res);
   } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'users not found' }));
   }
};

const handleRegisterUserRoute = (req, res) => {
   if (req.url === '/api/users' && req.method === 'POST') {
      registerNewUser(req, res);
   } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'users not found' }));
   }
};


module.exports = {
   handleGetUsersRoute,
   handleRegisterUserRoute
}