const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const dotenv = require('dotenv');

/**
 * Load environment variables
 * .env not used in production
 */
if (process.env.NODE_ENV !== 'production') {
  dotenv.load({ path: `${__dirname}/../.env` });
}

module.exports = () => {
  const dbName = process.env.DB_NAME;
  const dbUser = process.env.DB_USER;
  const dbPass = process.env.DB_PASS;

  if (!dbName || !dbUser || !dbPass) {
    throw new Error('Sequelize: Invalid DB parameters');
  }

  const db = {};
  const sequelize = new Sequelize(dbName, dbUser, dbPass, {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT,
    timezone: process.env.TZ,
    dialectOptions: {
      connectTimeout: 20000
    },
    logging: (process.env.DB_LOGGING === 'true') ? console.log : null,
    pool: {
      maxConnections: process.env.DB_POOL_SIZE,
      max: process.env.DB_POOL_SIZE,
      minConnections: 1,
      min: 1
    },
    define: {
      timestamps: false
    }
  });

  fs
    .readdirSync(__dirname)
    .filter(file => (file.indexOf('.') !== 0) && (file !== 'index.js') && (file.slice(-3) === '.js'))
    .forEach((file) => {
      const model = sequelize.import(path.join(__dirname, file));
      db[model.name] = model;
    });

  Object.keys(db).forEach((modelName) => {
    if ('associate' in db[modelName]) {
      db[modelName].associate(db);
    }
  });

  db.sequelize = sequelize;
  db.Sequelize = Sequelize;

  // Associations

  db.sequelize.sync().catch((err) => {
    throw err;
  });

  return db;
};
