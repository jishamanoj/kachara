const mongoose = require('mongoose');

const wastecollectorSchema = new mongoose.Schema({
  name: {
    type: String,
 
  },
  email: {
    type: String,
 
  },
  phone: {
    type: String,
    
  },
  password: {
    type: String,
  
  },
  registerId: {
    type: String,
  },
  role: {
    type: String,
  }
});

const wastecollector = mongoose.model('wastecollector', wastecollectorSchema);
module.exports = wastecollector;
