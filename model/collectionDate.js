const mongoose = require('mongoose');

const collectionSchema = new mongoose.Schema({
  userId: {
    type: String,
  },
  report: {
    type: String,
  
  },
  report:{
    type: String,
   
  },
  collection_date: {
    type: String,
  },
  iscollect: {
    type: Boolean,
  },
  due_amount:{
    type: String,
  }
});

const Collection = mongoose.model('Collection', collectionSchema);
module.exports = Collection;
