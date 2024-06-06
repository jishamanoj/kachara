const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  phone: {
    type: String,
    
  },
  password: {
    type: String,
    
  },
  latitude: {
    type: String,
    default: null
  },
  longitude: {
    type: String,
    default: null
  },
  address: {
    type: String,
    default: null
  }
});

const User = mongoose.model('User', userSchema);
module.exports = User;
