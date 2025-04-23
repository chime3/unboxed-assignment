const axios = require('axios');
const config = require('../src/config/config');
const logger = require('../src/config/logger');

// Product URL from environment variables with fallback
const PRODUCT_URL =
  config.productUrl || 'https://now-time.biz/products/issue-1-whirlpool?variant=42480670539836';

// API endpoint from environment variables
const API_ENDPOINT = config.apiEndpoint || `http://localhost:${config.port}/api/parse-product`;

async function testProductParser() {
  try {
    logger.info(`Testing product parser with URL: ${PRODUCT_URL}`);
    logger.info(`Using API endpoint: ${API_ENDPOINT}`);
    logger.info(`Environment: ${config.env}`);

    const response = await axios.post(API_ENDPOINT, {
      url: PRODUCT_URL,
      openaiApiKey: config.openaiApiKey || process.env.OPENAI_API_KEY,
    });

    logger.info('API Response:');
    console.log(JSON.stringify(response.data, null, 2));

    return response.data;
  } catch (error) {
    logger.error('Error testing product parser:');
    if (error.response) {
      logger.error(`Status: ${error.response.status}`);
      logger.error('Response data:', error.response.data);
    } else {
      logger.error(error.message);
    }
  }
}

testProductParser();
