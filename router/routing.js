const express = require("express");
const router = express.Router();
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
app.use(bodyParser())
app.use(cors())
app.use('/user',require('../controller/userController'));
app.use('/collectors',require('../controller/wastecollectorController'));

module.exports = app;