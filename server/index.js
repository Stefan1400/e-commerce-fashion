const http = require('http');
const { handleGetUsersRoute } = require('./routes/authRoutes');

const server = http.createServer((req, res) => {
   if (req.url === '/' && req.method === 'GET') {
      res.writeHead(200, {'content-type': 'text/plain'});
      res.end('Hello World');
   } else if (req.url === '/api/users' && req.method === 'GET') {
      console.log('index.js: before route call');
      handleGetUsersRoute(req, res);
      console.log('index.js: after route call');
   }
})

server.listen(5000, () => {
   console.log('Server running at http://localhost:5000');
})