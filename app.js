const express = require('express');
const app = express();
const router = require('./routes/apiRoutes');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/users', router);

module.exports = app;