require('dotenv').config()
const express = require('express')
const core = require('cors')
const bodyParser = require('body-parser')
const app = express();
app.use(bodyParser())
app.use(core())

app.use('/api/v1',require('./router/routing'))

module.exports = app