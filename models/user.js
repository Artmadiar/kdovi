const bcrypt = require('bcrypt');

function verifyPassword(password) {
  return Promise.resolve()
  .then(() => bcrypt.compare(password, this.password))
  .then((isCorrect) => {
    if (isCorrect) return this;
    return false;
  });
}

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('user', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    fb: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    tableName: 'user',
    timestamps: true,
    paranoid: true,
    instanceMethods: {
      verifyPassword
    }
  });
};
