'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('user', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userName: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [3, 50]
        }
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
          notEmpty: true
        }
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [8, 100]
        }
      },
      profilePicture: {
        type: Sequelize.STRING,
        defaultValue:
          'https://img.freepik.com/premium-vector/man-avatar-profile-picture-vector-illustration_268834-538.jpg',
        validate: {
          isUrl: true
        }
      },
      role: {
        type: Sequelize.ENUM('ADMIN', 'USER'),
        defaultValue: 'USER'
      },
      sex: {
        type: Sequelize.ENUM('MALE', 'FEMALE'),
        allowNull: true
      },
      isd_code: {
        type: Sequelize.STRING,
        allowNull: true,
        validate: {
          isNumeric: true,
          len: [1, 5]
        }
      },
      phone_number: {
        type: Sequelize.STRING,
        allowNull: true,
        validate: {
          isNumeric: true,
          len: [10, 15]
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('user');
  }
};
