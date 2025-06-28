const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
const MONGODB_URI = 'mongodb://localhost:27017/HealthTracker';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Define schemas
const waterSchema = new mongoose.Schema({
  waterAmount: {
    type: Number,
    required: true
  },
  date: {
    type: String, // YYYY-MM-DD format
    required: true,
    unique: true // Ensures one entry per date
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

const sleepSchema = new mongoose.Schema({
  sleepAmount: {
    type: Number,
    required: true
  },
  date: {
    type: String, // YYYY-MM-DD format
    required: true,
    unique: true // Ensures one entry per date
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

// Create models
const Water = mongoose.model('Water', waterSchema);
const Sleep = mongoose.model('Sleep', sleepSchema);

// Generic function to handle water/sleep updates
const updateHealthData = async (Model, amount, dateString, type) => {
  try {
    // Try to find existing entry for this date
    const existingEntry = await Model.findOne({ date: dateString });
    
    if (existingEntry) {
      // Update existing entry
      existingEntry[`${type}Amount`] = amount;
      existingEntry.lastUpdated = new Date();
      const updatedEntry = await existingEntry.save();
      
      console.log(`Updated existing ${type} entry for ${dateString}:`, updatedEntry);
      
      return {
        success: true,
        data: updatedEntry,
        message: `${type} amount updated for existing day`,
        action: 'updated'
      };
    } else {
      // Create new entry
      const newEntry = new Model({
        [`${type}Amount`]: amount,
        date: dateString
      });
      
      const savedEntry = await newEntry.save();
      
      console.log(`Created new ${type} entry for ${dateString}:`, savedEntry);
      
      return {
        success: true,
        data: savedEntry,
        message: `New ${type} entry created for new day`,
        action: 'created'
      };
    }
  } catch (error) {
    throw error;
  }
};

// Water endpoints
app.post('/api/water', async (req, res) => {
  try {
    const { waterAmount, date } = req.body;
    
    // Validate the data
    if (typeof waterAmount !== 'number' || !date) {
      return res.status(400).json({ 
        error: 'Invalid data. waterAmount must be a number and date is required.' 
      });
    }

    const result = await updateHealthData(Water, waterAmount, date, 'water');
    res.status(result.action === 'created' ? 201 : 200).json(result);
    
  } catch (error) {
    console.error('Error updating water amount:', error);
    if (error.code === 11000) {
      res.status(409).json({ error: 'Duplicate entry for this date' });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

app.get('/api/water', async (req, res) => {
  try {
    // Sort by date (newest first) and return just the amounts
    const waterEntries = await Water.find()
      .sort({ date: -1 })
      .select('waterAmount -_id');
    
    const amounts = waterEntries.map(entry => entry.waterAmount);
    res.json(amounts);
  } catch (error) {
    console.error('Error fetching water data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/water/full', async (req, res) => {
  try {
    // Return full data with metadata
    const waterEntries = await Water.find().sort({ date: -1 });
    
    res.json({
      success: true,
      data: waterEntries,
      totalDays: waterEntries.length
    });
  } catch (error) {
    console.error('Error fetching full water data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Sleep endpoints
app.post('/api/sleep', async (req, res) => {
  try {
    const { sleepAmount, date } = req.body;
    
    // Validate the data
    if (typeof sleepAmount !== 'number' || !date) {
      return res.status(400).json({ 
        error: 'Invalid data. sleepAmount must be a number and date is required.' 
      });
    }

    const result = await updateHealthData(Sleep, sleepAmount, date, 'sleep');
    res.status(result.action === 'created' ? 201 : 200).json(result);
    
  } catch (error) {
    console.error('Error updating sleep amount:', error);
    if (error.code === 11000) {
      res.status(409).json({ error: 'Duplicate entry for this date' });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

app.get('/api/sleep', async (req, res) => {
  try {
    // Sort by date (newest first) and return just the amounts
    const sleepEntries = await Sleep.find()
      .sort({ date: -1 })
      .select('sleepAmount -_id');
    
    const amounts = sleepEntries.map(entry => entry.sleepAmount);
    res.json(amounts);
  } catch (error) {
    console.error('Error fetching sleep data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/sleep/full', async (req, res) => {
  try {
    // Return full data with metadata
    const sleepEntries = await Sleep.find().sort({ date: -1 });
    
    res.json({
      success: true,
      data: sleepEntries,
      totalDays: sleepEntries.length
    });
  } catch (error) {
    console.error('Error fetching full sleep data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get today's data for both water and sleep
app.get('/api/today', async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    const todayWater = await Water.findOne({ date: today });
    const todaySleep = await Sleep.findOne({ date: today });
    
    res.json({
      success: true,
      date: today,
      water: todayWater ? todayWater.waterAmount : null,
      sleep: todaySleep ? todaySleep.sleepAmount : null
    });
  } catch (error) {
    console.error('Error fetching today\'s data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get specific date data
app.get('/api/date/:date', async (req, res) => {
  try {
    const requestedDate = req.params.date;
    
    const waterEntry = await Water.findOne({ date: requestedDate });
    const sleepEntry = await Sleep.findOne({ date: requestedDate });
    
    res.json({
      success: true,
      date: requestedDate,
      water: waterEntry ? waterEntry.waterAmount : null,
      sleep: sleepEntry ? sleepEntry.sleepAmount : null
    });
  } catch (error) {
    console.error('Error fetching date data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down gracefully...');
  await mongoose.connection.close();
  process.exit(0);
});

app.listen(PORT, () => {
  console.log(`Health Tracker Server running on http://localhost:${PORT}`);
});