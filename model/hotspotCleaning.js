const mongoose = require('mongoose');

const hotspotCleaningSchema = new mongoose.Schema({
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
  image: {
    type: String,
    default: null
  }

});

const otspotCleaning = mongoose.model('otspotCleaning', hotspotCleaningSchema);
module.exports = otspotCleaning;
