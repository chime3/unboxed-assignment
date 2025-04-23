const express = require('express');
const cors = require('cors');
const config = require('./config/config');
const logger = require('./config/logger');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Log requests in development
if (!config.isProduction) {
  app.use((req, res, next) => {
    logger.info(`${req.method} ${req.url}`);
    next();
  });
}

// Root route
app.get('/', (req, res) => {
  res.status(200);
  res.send('Welcome!');
});

// Start the server
app.listen(config.port, error => {
  if (error) {
    logger.error("Server can't start", error);
  } else {
    logger.info(`Server running in ${config.env} mode on port ${config.port}`);
  }
});
