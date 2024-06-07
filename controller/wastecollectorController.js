const express = require('express');
const User = require('../model/singup');
const router = express.Router();
const bcrypt = require('bcrypt');
const organic = require('../model/organic');
const collector = require('../model/wastecollectorLogin')

router.post('/register', async (req, res) => {
  try {
    const { name, email, phone, password, registerId, role, key } = req.body;

    // Check if the key is incorrect
    if (key !== 42586417) {
      return res.status(401).send({ message: 'Incorrect key' });
    }

    // Validate required fields
    if (!name || !email || !phone || !password || !registerId || !role) {
      return res.status(400).send({ message: 'All fields are required' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new waste collector instance
    const wasteCollector = new collector({
      name,
      email,
      phone,
      password: hashedPassword,
      registerId,
      role
    });

    // Save the waste collector to the database
    await wasteCollector.save();

    // Send a success response
    res.status(201).send(wasteCollector);  // Use status 201 for resource creation

  } catch (error) {
    // Handle errors, such as duplicate email
    if (error.code === 11000) {
      res.status(400).send({ message: 'Email already exists' });
    } else {
      res.status(500).send({ message: 'Internal Server Error', error });
    }
  }
});

  router.post('/login', async (req, res) => {
    const { email, password, role } = req.body;
  
    try {
        const user = await collector.findOne({ email });
  
        if (!user) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }
  
        const isMatch = await bcrypt.compare(password, user.password);
  
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        // Removed the declaration of role variable here

        // Send response with role, userId, and token
        res.status(200).json({ message: 'Login successful', role, userId: user._id });

    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});






  module.exports = router;