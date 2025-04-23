const productService = require('../services/productService');
const logger = require('../config/logger');

exports.parseProduct = async (req, res) => {
  try {
    const { url, openaiApiKey } = req.body;
    logger.info(`Received request to parse product from URL: ${url}`);

    // TODO: Validate input (URL and OpenAI API key format etc)

    if (!url) {
      logger.error('Request missing URL parameter');
      return res.status(400).json({ error: 'URL is required' });
    }

    if (!openaiApiKey) {
      logger.error('Request missing OpenAI API key parameter');
      return res.status(400).json({ error: 'OpenAI API key is required' });
    }

    // Process the URL and extract product data
    const productData = await productService.extractWithOpenAI(url, openaiApiKey);
    logger.info('Successfully parsed product data');

    return res.status(200).json(productData);
  } catch (error) {
    logger.error('Error parsing product:', error);
    return res.status(500).json({
      error: 'Failed to parse product',
      message: error.message,
    });
  }
};
