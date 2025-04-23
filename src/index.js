const express = require('express');
const cors = require('cors');

// Swagger
const swaggerUi =  require('swagger-ui-express');
const swaggerSpecs = require('./config/swagger');

const productRoutes = require('./routes/productRoutes');
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

// Swagger document
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Routes
app.use('/api', productRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'API to extract product info from product URLs using OpenAI',
    environment: config.env,
    endpoints: {
      parseProduct: 'POST /api/parse-product',
      document: '/api-docs',
    },
  });
});

// Start the server
app.listen(config.port, error => {
  if (error) {
    logger.error("Server can't start", error);
  } else {
    logger.info(`Server running in ${config.env} mode on port ${config.port}`);
    logger.info(`Swagger documentation available at http://localhost:${config.port}/api-docs`);
  }
});
