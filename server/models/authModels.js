const db = require('../db.js');

const fetchAllUsers = async () => {
   const result = await db.query('SELECT * FROM users');
   return result.rows;
}

const checkUserExists = async (email) => {
   const result = await db.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
   );

   return result.rows[0];
}

const registerUser = async (email, password) => {
   const result = await db.query(
      'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *',
      [email, password]
   );

   return result.rows[0];
}




module.exports = {
   fetchAllUsers,
   registerUser,
   checkUserExists
};
