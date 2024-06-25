require('dotenv').config()
const express = require('express')
const core = require('cors')
const app = express();

app.use(express.json());
app.use(core())

app.use('/api/v1',require('./router/routing'))

module.exports = app