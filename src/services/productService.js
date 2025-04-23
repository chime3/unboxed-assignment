const axios = require('axios');
const cheerio = require('cheerio');
const OpenAI = require('openai');
const logger = require('../config/logger');

/**
 * Fetches the HTML content from a given URL
 * @param url: product url
 * @returns Promise object of HTML content
 */
const fetchHtml = async url => {
  try {
    logger.debug(`Fetching HTML from: ${url}`);
    const response = await axios.get(url);

    logger.debug('HTML successfully fetched');
    return response.data;
  } catch (error) {
    logger.error('Error fetching HTML:', error);
    throw new Error(`Failed to fetch HTML from ${url}: ${error.message}`);
  }
};

/**
 * Cleans and processes the HTML to extract relevant product information as text
 * Minimize irrelevant content to reduce OpenAI token usage
 * @param html: raw HTML content
 * @returns processed text with only product relevant content
 */
const processHtml = html => {
  try {
    const $ = cheerio.load(html);

    // Remove non-product content
    $('script').remove();
    $('style').remove();
    $('nav').remove();
    $('footer').remove();
    $('header').remove();
    $('iframe').remove();
    $('svg').remove();
    $('meta').remove();
    $('link').remove();
    $('noscript').remove();

    // Remove disabled/hidden elements
    $('[disabled]').remove();
    $('[aria-disabled="true"]').remove();
    $('.disabled').remove();
    $('[class*="disabled"]').remove();
    $('[style*="display: none"]').remove();
    $('[style*="display:none"]').remove();
    $('[style*="visibility: hidden"]').remove();
    $('[style*="visibility:hidden"]').remove();
    $('[aria-hidden="true"]').remove();
    $('.hidden').remove();

    // TODO: Add here if any more
    $('.related-products').remove();
    $('.recommendations').remove();
    $('.reviews').remove();
    $('.comments').remove();

    // Extract text from main content areas
    let mainContent = $('main').text() || $('article').text() || $('body').text() || '';

    // Clean text: remove excessive whitespaces, fix spacing, etc
    let cleanedText = mainContent
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .replace(/\n+/g, '\n') // Replace multiple line breaks with single line break
      .replace(/\t+/g, ' ') // Replace tabs with spaces
      .replace(/\s*\n\s*/g, '\n') // Remove spaces around line breaks
      .replace(/\s*:\s*/g, ': ') // Standardize spacing around colons
      .trim(); // Remove leading/trailing whitespace

    // TODO: If any more solutions to clean text

    logger.debug('HTML content converted to text');
    logger.debug(cleanedText);

    return cleanedText;
  } catch (error) {
    logger.error('Error processing HTML', error);
  }
};

/**
 * Extract structured product data from the Content
 * @param url: the original product url
 * @param apiKey: the OpenAI API key
 * @returns Promise object of structured data
 */
const extractWithOpenAI = async (url, apiKey) => {
  // Limit content size to prevent token limit errors
  const MAX_CONTENT_LENGTH = 5000; // Equivalent to 2 full screens of text on a large desktop display

  // Initialize OpenAI using apiKey
  const openAi = new OpenAI({
    apiKey: apiKey,
  });

  logger.info(`Starting product data extraction for URL: ${url}`);

  // Fetch the HTML content from the URL
  const html = await fetchHtml(url);

  // Process HTML to extract text content
  logger.debug('Processing HTML to extract text content');
  const content = processHtml(html);

  logger.debug(`Processed content length: ${content.length} characters`);

  let truncatedContent = content;

  if (content.length > MAX_CONTENT_LENGTH) {
    logger.debug(
      `Content too large (${content.length} chars), truncating to ${MAX_CONTENT_LENGTH}`,
    );
    truncatedContent =
      content.substring(0, MAX_CONTENT_LENGTH) + '...[content truncated due to size]';
  }

  logger.debug('Preparing OpenAI prompt for product extraction');

  const prompt = `
You are a product data extraction specialist. 
Extract structured product data from the following product content.
Original URL: ${url}

Product Content:
${truncatedContent}

Extract the following information:
1. Product title/name
2. Category or type of product (Guess from the description if not provided in the content)
3. Brand (if available)
4. Price information (current price, original price if on sale)
5. Currency
6. All available variants/options based on the productcategory (like sizes, colors, materials, etc.)
7. Product description
8. Any specifications or technical details
9. Images URLs if present in the HTML

Format the response as a well-structured JSON object with the following schema:
{
  "url": "The original product URL",
  "title": "The product title",
  "category": "Product category/type",
  "brand": "Brand name if available",
  "pricing": {
    "current": "Current price as a number",
    "original": "Original price if on sale, as a number",
    "currency": "Currency code or symbol"
  },
  "attributes": {
    // All product variants/options as key-value pairs
    // e.g. "colors": ["Red", "Blue"], "sizes": ["S", "M", "L"]
    // Include ALL attributes found, even unexpected ones
  },
  "description": "Product description text",
  "specifications": {
    // Technical details as key-value pairs
    // e.g. "material": "Cotton", "weight": "200g"
  },
  "images": ["URL1", "URL2"]
}

For missing information, use null values. Make sure the structure is consistent even if some data isn't found.
For the 'attributes' and 'specifications' objects, create appropriate keys based on the data you find.
`;

  try {
    logger.info(`Calling OpenAI API to extract data for URL: ${url}`);
    const response = await openAi.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'You are a product data extraction specialist.' },
        { role: 'user', content: prompt },
      ],
      temperature: 0,
      max_tokens: 1500,
    });

    // Parse the response which should be JSON
    const content = response.choices[0].message.content.trim();
    logger.debug('Received response from OpenAI, parsing JSON');

    try {
      // Extract JSON from the response (in case there's additional text)
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      const jsonStr = jsonMatch ? jsonMatch[0] : content;

      logger.info('Product data extraction completed successfully');

      return JSON.parse(jsonStr);
    } catch (jsonError) {
      logger.error('Error parsing OpenAI response as JSON:', jsonError);
      throw new Error('Failed to parse structured data from the response');
    }
  } catch (error) {
    logger.error('Error calling OpenAI API:', error);
    throw new Error(`OpenAI API error: ${error.message}`);
  }
};

module.exports = {
  fetchHtml,
  processHtml,
  extractWithOpenAI,
};
