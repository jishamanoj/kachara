const mongoose = require('mongoose');

const bulkwastecollectionSchema = new mongoose.Schema({
  userId: {
    type: String,
  },
  ward: {
    type : Number,
  },
  latitude: {
    type: String,
    default: null
  },
  longitude: {
    type: String,
    default: null
  },
  reson: {
    type: String,
  },
});

const bulkwastecollection = mongoose.model('bulkwastecollection', bulkwastecollectionSchema);
module.exports = bulkwastecollection;
