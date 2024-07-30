'use strict';
const { DataTypes, Sequelize } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcrypt');
module.exports = sequelize.define('user', {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  userName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [3, 50]
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
      notEmpty: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [8, 100]
    }
  },
  profilePicture: {
    type: DataTypes.STRING,
    defaultValue:
      'https://img.freepik.com/premium-vector/man-avatar-profile-picture-vector-illustration_268834-538.jpg',
    validate: {
      isUrl: true
    }
  },
  role: {
    type: DataTypes.ENUM('ADMIN', 'USER'),
    defaultValue: 'USER'
  },
  sex: {
    type: DataTypes.ENUM('MALE', 'FEMALE'),
    allowNull: true
  },
  isd_code: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isNumeric: true,
      len: [1, 5]
    }
  },
  phone_number: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isNumeric: true,
      len: [10, 15]
    }
  },
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW
  },
  updatedAt: {
    allowNull: false,
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW
  }

}, {
  freezeTableName: true,
  tableName: 'user',
  hooks: {
    beforeCreate: async (user, options) => {
      if (user.password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    },
  }
})