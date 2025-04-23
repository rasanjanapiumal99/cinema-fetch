const express = require('express');
const cron = require('node-cron');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 8000; // Use Koyeb's PORT or fallback to 8000

// Import script modules
const tv2Script = require('./scripts/tv2');
const mini2Script = require('./scripts/mini2');
const mv2Script = require('./scripts/mv2');

// Health check endpoint
app.get('/', (req, res) => {
  res.status(200).json({ status: 'healthy' });
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

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
});

// Add before app.listen()
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
