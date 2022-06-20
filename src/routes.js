const express = require('express');

const TransactionsController = require('./controllers/TransactionsController');

const routes = express.Router();

routes.get('/transactions', TransactionsController.indexQuery);

module.exports = routes;