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

const validChecker = (email, password) => {
   if (!email || !password) return 'email or password invalid';
   if (!checkEmailValid(email)) return 'invalid email format';
   if (email.length < 6 || email.length > 64) return 'email length invalid';
   if (password.length < 8 || password.length > 64) return 'password length invalid';
   return null;
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

         //valid checker:
         const error = validChecker(email, password);
         if (error) {
            console.log(error);
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error }));
            return;
         };

         //checking if email already exists:
         const userAlreadyExists = await authModel.checkUserExists(email);

         //email already exists:
         if (userAlreadyExists) {
            res.writeHead(409, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'user already exists' }));
            return;
         };

         //hashing password:
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

         //signing token:
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

const loginUser = async (req, res) => {
   let body = '';
   req.on('data', chunk => {
      body += chunk;
   })
   req.on('end', async () => {
      try {
         const parsedBody = JSON.parse(body);
         const { email, password } = parsedBody;

         //valid checker:
         const error = validChecker(email, password);
         if (error) {
            console.log(error);
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error }));
            return;
         };

         const fetchedUser = await authModel.checkUserExists(email);

         //user doesnt exist:
         if (!fetchedUser) {
            res.writeHead(401, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'user not found' }));
            return;
         };

         const passwordMatches = await bcrypt.compare(password, fetchedUser.password);

         if (!passwordMatches) {
            console.log('password doesnt match');
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'password incorrect' }));
            return;
         }

         //signing token:
         const token = JWT.sign(
            { userId: fetchedUser.id },
            JWT_SECRET_KEY,
            { expiresIn: '1d' }
         );

         //telling user account was logged in:
         res.writeHead(200, { 'Content-Type': 'application/json' });
         res.end(JSON.stringify({ message: 'successfully logged in', token }));

         //internal server error:
      } catch (err) {
         res.writeHead(500, {'Content-Type': 'application/json'});
         res.end(JSON.stringify({ error: '500 error in loginUser controller' }));
      }
   })

   //request error inside stream:
   req.on('error', (err) => {
      console.log(err);
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'invalid request' }));
   })
}



module.exports = {
   getAllUsers,
   registerNewUser,
   loginUser,
}