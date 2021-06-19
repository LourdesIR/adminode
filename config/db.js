const Sequelize = require('sequelize');

const db = new Sequelize('freedbtech_nodeadminlourir', 'freedbtech_lourir', '12345', {
  host: 'freedb.tech',
  dialect: 'mysql',
  port: '3306',
  operatorsAliases: false,
  define: {
      timestamps: false
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

module.exports = db;