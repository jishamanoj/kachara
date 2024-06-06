const mongoose = require('mongoose');

const inorganicSchema = new mongoose.Schema({
  userId: {
    type: String,
  },
  quality: {
    type: String,
    
  },
  quantity: {
    type: String,
  
  },
  user_fee: {
    type: String,
  
  },
  report: {
    type: String,
   
  },
  waste_type: {
    type: String,
  },
  Collection_date:{
    type: String,
  }
});

const Inorganic = mongoose.model('Inorganic', inorganicSchema);
module.exports = Inorganic;
