const path = require('path');
const dotenv = require('dotenv');

/**
 * Load environment variables
 * .env not used in production
 */
if (process.env.NODE_ENV !== 'production') {
  dotenv.load({ path: path.join(__dirname, '/../.env') });
}

module.exports = {
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: process.env.DB_DIALECT,
  dialectOptions: {
    multipleStatements: true
  }
};
