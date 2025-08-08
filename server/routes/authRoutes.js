const {
   getAllUsers,
   registerNewUser,
   loginUser,
   
} = require('../controllers/authControllers');
const url = require('url');

const authRouter = (req, res) => {
   const parsedUrl = url.parse(req.url, true);
   const { pathname } = parsedUrl;

   if (pathname === '/') {
      if (req.method === 'GET') {
         res.writeHead(200, {'content-type': 'text/plain'});
         res.end('Hello World');
         return;
      }
   }

   if (pathname === '/api/users') {
      if (req.method === 'GET') return getAllUsers(req, res);
   }

   if (pathname === '/api/register') {
      if (req.method === 'POST') return registerNewUser(req, res);
   }

   if (pathname === '/api/login') {
      if (req.method === 'POST') return loginUser(req, res);
   }

   res.writeHead(404, { 'Content-Type': 'application/json' });
   res.end(JSON.stringify({ error: 'route not found' }));
}


module.exports = {
   authRouter
}