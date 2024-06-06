const mongoose = require('mongoose');

const incidentSchema = new mongoose.Schema({
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
  },
  serviceComplaints:{
    type: String,
  }

});

const incidents = mongoose.model('incidents', incidentSchema);
module.exports = incidents;
