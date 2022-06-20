const express = require('express');
const routes = require('./routes');

require('dotenv').config()

const sequelize = require('./database');


sequelize.sync();

const app = express();

app.use(express.json());
app.use(routes);

app.listen(8080);