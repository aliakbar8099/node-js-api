// data models
const Shop = require('../models/shop');

// get products
const getAllProducts = async (req, res) => {
    const products = await Shop.find().exec();

    res.json({
        message: 'لیست محصولات',
        products: products,
        totalCount: products.length
    });
}

const getSingleProduct = async (req, res) => {
    const id = req.params.id;

    const product = await Shop.findById(id);

    product === undefined ? res.status(404).json({ message: 'Product not found' }) : res.json(product);
}

exports.getAllProducts = getAllProducts
exports.getSingleProduct = getSingleProduct