const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Product Link Parser API',
      version: '1.0.0',
      description: 'API that extracts structured product data from product URLs using OpenAI',
    },
    servers: [
      {
        url: '/',
        description: 'Current server',
      },
    ],
    components: {
      schemas: {
        ProductParseRequest: {
          type: 'object',
          required: ['url', 'openaiApiKey'],
          properties: {
            url: {
              type: 'string',
              description: 'URL of the product page to parse',
              example: 'https://now-time.biz/products/issue-1-whirlpool?variant=42480670539836',
            },
            openaiApiKey: {
              type: 'string',
              description: 'Your OpenAI API key',
              example: 'sk-...',
            },
          },
        },
        ProductResponse: {
          type: 'object',
          properties: {
            url: {
              type: 'string',
              description: 'The original product URL',
            },
            title: {
              type: 'string',
              description: 'The product title',
            },
            category: {
              type: 'string',
              description: 'Product category/type',
            },
            brand: {
              type: 'string',
              description: 'Brand name if available',
            },
            pricing: {
              type: 'object',
              properties: {
                current: {
                  type: 'number',
                  description: 'Current price as a number',
                },
                original: {
                  type: 'number',
                  description: 'Original price if on sale, as a number',
                  nullable: true,
                },
                currency: {
                  type: 'string',
                  description: 'Currency code or symbol',
                },
              },
            },
            attributes: {
              type: 'object',
              description: 'All product variants/options as key-value pairs',
              additionalProperties: true,
            },
            description: {
              type: 'string',
              description: 'Product description text',
            },
            specifications: {
              type: 'object',
              description: 'Technical details as key-value pairs',
              additionalProperties: true,
            },
            images: {
              type: 'array',
              items: {
                type: 'string',
              },
              description: 'URLs of product images',
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
            },
            message: {
              type: 'string',
            },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.js'],
};

const specs = swaggerJsdoc(options);

module.exports = specs;
