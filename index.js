const express = require('express');
const cron = require('node-cron');
const axios = require('axios');
const app = express();
const PORT = 8000;

// Import script modules
const tv2Script = require('./scripts/tv2');
const mini2Script = require('./scripts/mini2');
const mv2Script = require('./scripts/mv2');

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    status: 'running',
    message: 'Script runner service is operational',
    endpoints: {
      executeAll: '/execute-all',
      executeTv2: '/execute-tv2',
      executeMini2: '/execute-mini2',
      executeMv2: '/execute-mv2'
    }
  });
});

// Manual execution endpoints
app.get('/execute-all', async (req, res) => {
  try {
    await Promise.all([
      tv2Script.execute(),
      mini2Script.execute(),
      mv2Script.execute()
    ]);
    res.json({ status: 'success', message: 'All scripts executed successfully' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

app.get('/execute-tv2', async (req, res) => {
  try {
    await tv2Script.execute();
    res.json({ status: 'success', message: 'TV2 script executed successfully' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

app.get('/execute-mini2', async (req, res) => {
  try {
    await mini2Script.execute();
    res.json({ status: 'success', message: 'Mini2 script executed successfully' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

app.get('/execute-mv2', async (req, res) => {
  try {
    await mv2Script.execute();
    res.json({ status: 'success', message: 'MV2 script executed successfully' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Schedule daily execution at 3 AM
cron.schedule('0 3 * * *', async () => {
  console.log('Running scheduled daily scripts...');
  try {
    await Promise.all([
      tv2Script.execute(),
      mini2Script.execute(),
      mv2Script.execute()
    ]);
    console.log('All scripts executed successfully');
  } catch (error) {
    console.error('Error executing scripts:', error);
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
