const express = require('express');
const cors = require('cors');
const path = require('path');
const dataService = require('./services/dataService');

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

(async () => {
  try {
    await dataService.loadData();
    console.log('Data loaded successfully');
  } catch (err) {
    console.error('Error loading data:', err);
  }

  app.use('/api/sales', require('./routes/salesRoutes'));

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
})();
