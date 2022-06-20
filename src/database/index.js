const Sequelize = require('sequelize');
const dbConfig = require('../config/database');

const Transactions = require('../models/Transactions');

const sequelize = new Sequelize(dbConfig);

Transactions.init(sequelize);

Transactions.associate(sequelize.models);

module.exports = sequelize;