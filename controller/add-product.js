// data models
const Products = require('../models/products');
const Shop = require('../models/shop');

const fs = require('fs');

const path = require('path');

// get products
const getAllProducts = async (req, res) => {
    const products = await Products.find().exec();

    res.json({
        message: 'لیست محصولات',
        products: products,
        totalCount: products.length
    });
}

const getSingleProduct = async (req, res) => {
    const id = req.params.id;
    const product = await Products.findById(id);

    product === undefined ? res.status(404).json({ message: 'Product not found' }) : res.json(product);
}


// post product
const postProducts = async (req, res, next) => {
    const { title, price , author} = req.body;

    if (title === undefined || title === '') {
        return res.status(400).json({ message: 'عنوان وارد کنید' , "endpoint":"title" });
    }
    if (price === undefined) {
        return res.status(400).json({ message: 'قیمت را وارد کنید' , "endpoint":"price" });
    }
    if (author === undefined) {
        return res.status(400).json({ message: 'نام نویسنده را وارد کنید' , "endpoint":"author" });
    }

    const newProduct = new Products({
        title: title,
        price: price,
    });

    const newProduct2 = new Shop({
        title: title,
        price: price,
        author: author
    });
    
    await newProduct.save()
    await newProduct2.save()

    res.status(201).json({ message: 'محصول شما با موفیقیت اضافه شد', product: newProduct });
}

// delete product
const deleteProduct = async (req, res) => {
    const id = req.params.id;
    const product = await Products.findByIdAndDelete(id);

    res.json({ message: `محصول ${product.title} با موفیقیت حذف شد`});
}

// update product
const updateProduct = async (req, res) => {
    const id = req.params.id;
    const { title, price } = req.body;

    
    if (title === undefined || title === '') {
        res.status(400).json({ message: 'عنوان وارد کنید' , "endpoint":"title" });
    }

    if (price === undefined) {
        res.status(400).json({ message: 'قیمت را وارد کنید' , "endpoint":"price" });
    }

    const product = await Products.findByIdAndUpdate(id, { title: title, price: price });

    if(title !== product.title){
        res.json({ message: `نام محصول [${product.title}] با موفیقیت به [${req.body.title}] بروزرسانی شد`});
    }
    if(price !== product.price){
        res.json({ message: `قیمت محصول [${product.title}] با موفیقیت به [${req.body.price}] بروزرسانی شد`});
    }
}

exports.getAllProducts = getAllProducts
exports.getSingleProduct = getSingleProduct
exports.postProducts = postProducts
exports.deleteProduct = deleteProduct
exports.updateProduct = updateProduct