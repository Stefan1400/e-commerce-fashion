const authModel = require('../models/authModels');
const bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken');
const JWT_SECRET_KEY = 'super_secret_key';


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

const checkEmailValid = (email) => {
   const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
   return regex.test(email);
}

const registerNewUser = async (req, res) => {
   let body = '';

   req.on('data', chunk => {
      body += chunk;
   });
   req.on('end', async () => {
      try {
         //parsing body:
         const parsedBody = JSON.parse(body);
         const { email, password } = parsedBody;

         //body or password doesnt exist:
         if (!email || !password) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'email or password invalid' }));
            return;
         };

         //email doesnt fit correct format:
         if (!checkEmailValid(email)) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'invalid email' }));
            return;
         };

         //email length invalid:
         if (email.length < 6 || email.length > 64) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'email invalid' }));
            return;
         };

         //password length invalid:
         if (password.length < 8 || password.length > 64) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'password invalid' }));
            return;
         };

         //checking if email already exists:
         const userAlreadyExists = await authModel.getUserById(email);

         //email already exists:
         if (userAlreadyExists) {
            res.writeHead(409, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'user already exists' }));
            return;
         };

         //hashing password
         const saltRounds = 10;
         const hashedPassword = await bcrypt.hash(password, saltRounds);

         //adding user to database:
         const addedUser = await authModel.registerUser(email, hashedPassword);

         //user wasnt added correctly:
         if (!addedUser) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'register unsuccessful' }));
            return;
         };

         //signing token if user correctly added:
         const token = JWT.sign(
            { userId: addedUser.id },
            JWT_SECRET_KEY,
            { expiresIn: '1d' }
         );

         //telling user account was added:
         res.writeHead(201, { 'Content-Type': 'application/json' });
         res.end(JSON.stringify({ message: 'account created', token }));

         //internal server error:
      } catch (err) {
         res.writeHead(500, {'Content-Type': 'application/json'});
         res.end(JSON.stringify({ error: '500 error in registerNewUser controller' }));
      }
   });

   //request error inside stream:
   req.on('error', (err) => {
      console.error(err);
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'invalid request' }));
   });
}


module.exports = {
   getAllUsers,
   registerNewUser,
}