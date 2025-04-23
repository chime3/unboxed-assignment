# Product Info API

An API service that extracts detailed product information from e-commerce product URLs using OpenAI.

## Deployed API

**Live API URL:** [https://unboxed-assignment.onrender.com](https://unboxed-assignment.onrender.com)

API Documentation: [https://unboxed-assignment.onrender.com/api-docs](https://unboxed-assignment.onrender.com/api-docs)

## Features

- Extract product details from e-commerce URLs
- Consistent structured data format for all products
- Swagger API documentation
- Error handling and validation

## Sample Usage

### Request

```bash
curl -X POST https://unboxed-assignment.onrender.com/api/parse-product \
  -H "Content-Type: application/json" \
  -d '{"url": "https://now-time.biz/products/issue-1-whirlpool?variant=42480670539836", "openaiApiKey": "sk-xxx"}'
```

### Response

```json
{
  "url": "https://now-time.biz/products/issue-1-whirlpool?variant=42480670539836",
  "title": "Issue 1 Whirlpool",
  "category": "Garment",
  "brand": "Now-Time",
  "pricing": {
    "current": 40,
    "original": null,
    "currency": "USD"
  },
  "attributes": {
    "sizes": ["S"]
  },
  "description": "Now-Time is a research and publishing project coordinating a multiplicity of historical lines oriented towards present activity. We aim to relink design,¹ critical consciousness, and social-historical perspective. With collaborators we create new works that move through the maze of what has been,² and transform those old works that speak indirectly but lucidly to the present situation.³ ¹ Design defined as courses of action aimed at changing existing situations into preferred ones. ² Truth, questions and ideas in art / stories / evidence passed from the past, pleasant and unpleasant. ³ The necessity of overcoming the icy waters of egotistical calculation. T̶h̶e̶ ̶f̶l̶o̶w̶i̶n̶g̶ ̶o̶f̶ ̶t̶i̶m̶e̶ The swirling of time What is...is dependent on wh                  hat's in circulation. What stands, what is about to disappear, what should be no longer. Renewing whats been dragged to the bottom of the vortex. The what = useful ideas, questions, and truths in art / stories / evidence passed from the past. Poe, A Descent into the Maelström Walter Benjamin, Diary from August 7, 1931 McLuhan, Medium is the maessage Walter Benjamin, Arcades Alain Resnais, Je t'aime, je t'aime, 1968",
  "specifications": {
    "material": "100% Ring Spun Cotton",
    "weight": "6.1oz"
  },
  "images": null
}
```

## Running Locally

### Prerequisites

- Node.js (v14 or higher)
- npm
- OpenAI API key

### Installation

1. Clone the repository

   ```bash
   git clone <repository-url>
   cd unboxed-assignment
   ```

2. Install dependencies

   ```bash
   npm install
   ```

3. Create a `.env` file from the provided example:

   **For Unix/Mac:**

   ```bash
   cp .env.example .env
   ```

   **For Windows:**

   ```bash
   copy .env.example .env.development
   ```

4. Start the development server

   ```bash
   npm run dev
   ```

5. The API will be available at `http://localhost:3000`
   - API endpoint: `http://localhost:3000/api/parse-product`
   - Documentation: `http://localhost:3000/api-docs`

### Testing

Run the test suite to ensure everything is working correctly:

You should add `OPENAI_API_KEY`, `API_ENDPOINT`, and `PRODUCT_URL` in `.env.test` file

```bash
npm test
```

`PRODUCT_URL` can be any product (Amazon, Ebay etc)

## Implementation Details

### Prompt Design

The prompt is designed to instruct the OpenAI model to:

1. Extract product information from the provided URL
2. Structure the data according to a specific schema
3. Handle missing information gracefully
4. Infer reasonable values when information is ambiguous

The prompt emphasizes extracting only factual information present on the product page, avoiding hallucinations or assumptions where data is not available.

### Parsing Strategy

1. The API receives a URL in the request body
2. Makes a request to fetch the HTML content from the URL
3. Extracts relevant content (removing noise like navigation, footers, etc.)
4. Sends the cleaned content to OpenAI with the structured prompt
5. Processes and validates the response
6. Returns the structured product data

### Schema Design

The product schema is designed to be flexible enough to accommodate a wide range of e-commerce products while providing a consistent structure:

```
{
  url: string,          // Original product URL
  title: string,        // Product title
  category: string,     // Product category
  brand: string,        // Brand name
  pricing: {
    current: number,    // Current price
    original: number,   // Original price (if on sale)
    currency: string    // Currency code (USD, EUR, etc.)
  },
  attributes: {         // Flexible object for product-specific attributes
    sizes: string[],    // Available sizes
    colors: string[],   // Available colors
    // Other product-specific attributes
  },
  description: string,  // Product description
  specifications: {     // Technical specifications
    // Product-specific specifications (material, weight, dimensions, etc.)
  },
  images: string[]      // URLs of product images
}
```

## Limitations and Future Improvements

I added some **TODO** notes in the codebase.
With more time, I would address the following:

1. **Caching**: Implement Redis caching to store previously processed URLs and reduce OpenAI API usage.

2. **Rate Limiting**: Add rate limiting to protect the API from abuse.

3. **Image Processing**: Enhance image extraction and processing to better handle various e-commerce platforms.

4. **Domain-Specific Models**: Train specialized models for different e-commerce categories (fashion, electronics, etc.).

5. **Performance Optimization**: Optimize HTML parsing and content extraction for faster processing.

6. **Analytics**: Implement analytics to extract all available products in a HTML page.
