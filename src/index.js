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
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Product Info API</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
          }
          h1 {
            color: #333;
          }
          .container {
            border: 1px solid #ddd;
            padding: 20px;
            border-radius: 5px;
          }
          a {
            display: inline-block;
            background: #4CAF50;
            color: white;
            padding: 10px 15px;
            text-decoration: none;
            border-radius: 4px;
            margin-top: 20px;
          }
          a:hover {
            background: #45a049;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Product Info API</h1>
          <p>API to extract product info from product URLs using OpenAI</p>
          <p>Environment: ${config.env}</p>
          <h2>Endpoints:</h2>
          <ul>
            <li>POST /api/parse-product</li>
          </ul>
          <a href="/api-docs">View API Documentation</a>
        </div>
      </body>
    </html>
  `);
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
