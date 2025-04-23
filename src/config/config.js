const dotenv = require('dotenv');
const path = require('path');

// Load env vars based on NODE_ENV
const NODE_ENV = process.env.NODE_ENV || 'development';
dotenv.config({
  path: path.resolve(process.cwd(), `.env.${NODE_ENV}`),
});

const config = {
  env: NODE_ENV,
  port: process.env.PORT || 3000,
  logLevel: process.env.LOG_LEVEL || 'debug',
  isProduction: NODE_ENV === 'production',
  isDevelopment: NODE_ENV === 'development',
  isTest: NODE_ENV === 'test',
};

// Test specific env vars
if (config.isTest) {
  config.openaiApiKey = process.env.OPENAI_API_KEY;
  config.apiEndpoint = process.env.API_ENDPOINT;
  config.productUrl = process.env.PRODUCT_URL;
}

module.exports = config;
