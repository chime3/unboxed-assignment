const express = require('express');
const productController = require('../controllers/productController');

const router = express.Router();

router.post('/parse-product', productController.parseProduct);

module.exports = router;
