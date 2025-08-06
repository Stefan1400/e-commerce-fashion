const db = require('../db.js');

console.log('in model');

const fetchAllUsers = async () => {
   console.log('in model');
   const result = await db.query('SELECT * FROM users');
   return result.rows;
}


module.exports = {
   fetchAllUsers
};
