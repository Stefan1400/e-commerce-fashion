const http = require('http');
const { 
   authRouter,
} = require('./routes/authRoutes');


const server = http.createServer((req, res) => {

   res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
   res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
   res.setHeader('Access-Control-Allow-Credentials', 'true');

   if (req.method === 'OPTIONS') {
      res.writeHead(204);
      res.end();
      return;
   }

   authRouter(req, res);
});

server.listen(5000, () => {
   console.log('Server running at http://localhost:5000');
})