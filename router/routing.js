const express = require("express");
const router = express.Router();
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(cors())
app.use('/user',require('../controller/userController'));
app.use('/collectors',require('../controller/wastecollectorController'));

module.exports = app;