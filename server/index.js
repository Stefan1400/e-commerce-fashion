const http = require('http');
const { 
   authRouter,
} = require('./routes/authRoutes');


const server = http.createServer((req, res) => {
   authRouter(req, res);
});

server.listen(5000, () => {
   console.log('Server running at http://localhost:5000');
})