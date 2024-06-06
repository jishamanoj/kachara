const mongoose = require('mongoose');

const dueamountSchema = new mongoose.Schema({
  userId: {
    type: String,
  },
  dueamount: {
    type : Number,
  }
});

const dueamount = mongoose.model('dueamount', dueamountSchema);
module.exports = dueamount;
