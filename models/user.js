const bcrypt = require('bcrypt');

// hooks

function beforeCreate(user) {
  return Promise.resolve()
    .then(() => bcrypt.genSalt(12))
    .then(salt => bcrypt.hash(user.password, salt))
    .then((encrypted) => {
      user.password = encrypted;
    });
}

module.exports = function (sequelize, DataTypes) {
  const User = sequelize.define('user', {
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
      allowNull: true
    }
  }, {
    tableName: 'user',
    timestamps: true,
    paranoid: true,

    hooks: {
      beforeCreate
    }
  });

  // instanceMethods

  User.prototype.verifyPassword = function (password) {
    return Promise.resolve()
    .then(() => bcrypt.compare(password, this.password))
    .then((isCorrect) => {
      if (isCorrect) return this;
      return false;
    });
  };

  // /////////
  return User;
};
