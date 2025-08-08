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
      'INSERT INTO users (email, password, created_at, updated_at) VALUES ($1, $2, NOW(), NOW()) RETURNING *',
      [email, password]
   );

   return result.rows[0];
}


module.exports = {
   fetchAllUsers,
   registerUser,
   checkUserExists
};
