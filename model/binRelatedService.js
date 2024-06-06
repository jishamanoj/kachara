const mongoose = require('mongoose');

const binRelatedServiceSchema = new mongoose.Schema({
  userId: {
    type: String,
  },
  service: {
    type : [],
  }
});

const binRelatedService = mongoose.model('binRelatedService', binRelatedServiceSchema);
module.exports = binRelatedService;
