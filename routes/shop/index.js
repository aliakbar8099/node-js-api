const express = require('express');

// add product
const shop = require('../../controller/shop-page');

const router = express.Router();

const path = '/products';

router.get(path, shop.getAllProducts);
router.get(`${path}/:id`, shop.getSingleProduct);


module.exports = router;