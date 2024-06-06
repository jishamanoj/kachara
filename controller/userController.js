
const express = require('express');
const User = require('../model/singup');
const router = express.Router();
const bcrypt = require('bcrypt');
const organic = require('../model/organic');
const inorganic = require('../model/inorganic');
const collection = require('../model/collectionDate');
const mongoose = require('mongoose');
const dueamount = require('../model/dueamount');
const BulkWasteCollection =require('../model/bulkWasteCollection');
const Incident = require('../model/incidents');
const HotspotCleaning = require('../model/hotspotCleaning');
const BinRelatedService =require('../model/binRelatedService');


router.post('/users', async (req, res) => {
    const { name, phone, password,latitude,longitude,address,role} = req.body;
  
    try {
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create a new user with the hashed password
      const user = new User({ name,phone, password: hashedPassword,latitude,longitude,address,role });
      await user.save();
  
      res.status(200).json({ message: 'User created successfully', user });
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(400).json({ error: 'Error creating user', details: error.message });
    }
  });

  router.post('/user-login', async (req, res) => {
    const {phone, password,role } = req.body;
  
    try {
      const user = await User.findOne({ phone });
  
      if (!user) {
        return res.status(400).json({ error: 'Invalid phone or password' });
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
  
      if (!isMatch) {
        return res.status(400).json({ error: 'Invalid phone or password' });
      }
  
  
      res.status(200).json({ message: 'Login successful', role, userId: user._id });

    } catch (error) {
      console.error('Error logging in user:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  router.put('/update-Users/:id', async (req, res) => {
    const { id } = req.params;
    const { name,phone, password, latitude, longitude, address } = req.body;
  
    try {
      // Find the user by ID
      const user = await User.findById(id);
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Update fields
      const updateData = { name, phone, latitude, longitude, address };
  
      // If the password is being updated, hash the new password
      if (password) {
        updateData.password = await bcrypt.hash(password, 10);
      }
  
      // Update the user document
      Object.assign(user, updateData);
      await user.save();
  
      res.status(200).json({ message: 'User updated successfully', user });
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(400).json({ error: 'Error updating user', details: error.message });
    }
  });
  
  router.get('/get-users/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      const user = await User.findById(id);
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      res.status(200).json(user);
    } catch (error) {
      console.error('Error fetching user:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  router.get('/get-all-users', async (req, res) => {
    try {
      const users = await User.find();
      res.status(200).json(users);
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  router.post('/collect-waste', async (req, res) => {
    const { type, userId, quality, quantity, user_fee, report, waste_type,Collection_date } = req.body;
  
    try {
      if (type === 'organic') {
        const newOrganic = new organic({
          userId,
          quality,
          quantity,
          user_fee,
          report,
          Collection_date ,
          waste_type : type
        });
        await newOrganic.save();
      
        res.status(201).json({ message: 'Organic waste data inserted successfully', data: newOrganic });
      } else if (type === 'inorganic') {
        const newInorganic = new inorganic({
          userId,
          quality,
          quantity,
          user_fee,
          report,
          Collection_date,
          waste_type : type
        });
        await newInorganic.save();
        res.status(201).json({ message: 'Inorganic waste data inserted successfully', data: newInorganic });
      } else {
        res.status(400).json({ error: 'Invalid type specified' });
      }
    } catch (error) {
      console.error('Error inserting waste data:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  router.post('/zero-collection', async (req, res) => {
    const { userId, reson, report, collection_date, iscollect, due_amount } = req.body;
  
    try {
      const session = await mongoose.startSession();
      session.startTransaction();
  
      const newCollection = new collection({
        userId,
        reson,
        report,
        collection_date,
        iscollect,
        due_amount
      });
  
      await newCollection.save({ session });
  
      const existingDueAmount = await dueamount.findOne({ userId }).session(session);
  
      if (existingDueAmount) {
        existingDueAmount.dueamount += parseFloat(due_amount);
        await existingDueAmount.save({ session });
      } else {
        const newDueAmount = new dueamount({
          userId,
          dueamount: parseFloat(due_amount),
        });
        await newDueAmount.save({ session });
      }
  
      await session.commitTransaction();
      session.endSession();
  
      res.status(201).json({ message: 'Collection data inserted successfully', data: newCollection });
    } catch (error) {
      console.error('Error inserting collection data:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  router.put('/collect-pendingFee', async (req, res) => {
    const { userId, pending_amount } = req.body;
  
    if (!userId || !pending_amount) {
      return res.status(400).json({ error: 'userId and pending_amount are required' });
    }
  
    try {
      const session = await mongoose.startSession();
      session.startTransaction();
  
      const dueAmountEntry = await dueamount.findOne({ userId }).session(session);
  
      if (!dueAmountEntry) {
        await session.abortTransaction();
        session.endSession();
        return res.status(404).json({ error: 'User not found' });
      }
  
      if (dueAmountEntry.dueamount < pending_amount) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({ error: 'Pending amount exceeds due amount' });
      }
  
      dueAmountEntry.dueamount -= parseFloat(pending_amount);
      await dueAmountEntry.save({ session });
  
      await session.commitTransaction();
      session.endSession();
  
      res.status(200).json({ message: 'Pending fee collected successfully', data: dueAmountEntry });
    } catch (error) {
      console.error('Error collecting pending fee:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  router.get('/dueamount/:userId', async (req, res) => {
    try {
      const dueamountDetails = await dueamount.findOne({ userId: req.params.userId });
  
      if (!dueamountDetails) {
        return res.status(404).json({ error: 'Dueamount not found for the given user ID.' });
      }
  
      res.json(dueamountDetails);
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while fetching dueamount details.' });
    }
  });


  ///////////////////////////////////////////user/////////////////////////////////////////////////


  router.get('/my-status/:userid', async (req, res) => {
    const { userid } = req.params;
  
    try {
      const collectionData = await collection.find({ userId: userid }, 'collection_date iscollect').exec();
      const organicDates = await organic.find({ userId: userid }, 'collection_date').exec();
      const inorganicDates = await inorganic.find({ userId: userid }, 'collection_date').exec();
  
      res.status(200).json({
        collectionData,
        organicDates,
        inorganicDates
      });
    } catch (error) {
      console.error('Error fetching collection dates:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  

  router.post('/bulk-waste-collection', async (req, res) => {
    const { userId, ward, latitude, longitude, reson } = req.body;
  
    if (!userId || !ward || !reson) {
      return res.status(400).json({ error: 'userId, ward, and reson are required' });
    }
  
    try {
      const newBulkWasteCollection = new BulkWasteCollection({
        userId,
        ward,
        latitude,
        longitude,
        reson
      });
  
      await newBulkWasteCollection.save();
  
      res.status(201).json({ message: 'Bulk waste collection data inserted successfully', data: newBulkWasteCollection });
    } catch (error) {
      console.error('Error inserting bulk waste collection data:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  const multer = require('multer')
  const path = require('path');
  const fs = require('fs');
const { error } = require('console');
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
  });
  
  const upload = multer({ storage: storage });
  
  router.post('/incidents', upload.single('image'), async (req, res) => {
    const { userId, ward,serviceComplaints } = req.body;
    const image = req.file ? req.file.path : null;
  
    if (!userId || !ward) {
      return res.status(400).json({ error: 'userId and ward are required' });
    }
  
    try {
      const newIncident = new Incident({
        userId,
        ward,
        serviceComplaints,
        image
      });
  
      await newIncident.save();
  
      res.status(201).json({ message: 'Incident data inserted successfully', data: newIncident });
    } catch (error) {
      console.error('Error inserting incident data:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
 
  router.post('/hotspot-cleaning', upload.single('image'), async (req, res) => {
    const { userId, ward, latitude, longitude } = req.body;
    const image = req.file ? req.file.path : null;
  
    if (!userId || !ward) {
      return res.status(400).json({ error: 'userId, ward, and serviceComplaints are required' });
    }
  
    try {
      const newHotspotCleaning = new HotspotCleaning({
        userId,
        ward,
        latitude,
        longitude,
        image
      });
  
      await newHotspotCleaning.save();
  
      res.status(201).json({ message: 'Hotspot cleaning data inserted successfully', data: newHotspotCleaning });
    } catch (error) {
      console.error('Error inserting hotspot cleaning data:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  router.post('/bin-related-service', async (req, res) => {
    const { userId, service } = req.body;
  
    if (!userId || !service) {
      return res.status(400).json({ error: 'userId and service are required' });
    }
  
    if (!Array.isArray(service)) {
      return res.status(400).json({ error: 'service must be an array' });
    }
  
    try {
      const newBinRelatedService = new BinRelatedService({
        userId,
        service
      });
  
      await newBinRelatedService.save();
  
      res.status(201).json({ message: 'Bin related service data inserted successfully', data: newBinRelatedService });
    } catch (error) {
      console.error('Error inserting bin related service data:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  

module.exports = router;
