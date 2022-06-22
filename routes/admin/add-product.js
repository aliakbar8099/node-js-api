const express = require('express');
const auth = require('../../middleware/auth');

// add product
const addProduct = require('../../controller/add-product');

const router = express.Router();

const path = '/add-product';

router.get(path, auth, addProduct.getAllProducts);
router.get(`${path}/:id`, addProduct.getSingleProduct);

router.post(path, auth , addProduct.postProducts);

router.delete(`${path}/:id`, auth, addProduct.deleteProduct);

router.put(`${path}/:id`, auth, addProduct.updateProduct);

router.get("/me", auth, async (req, res) => {
    try {
        // request.user is getting fetched from Middleware after token authentication
        const user = await User.findById(req.user.id);
        res.json(user);
    } catch (e) {
        res.send({ message: "Error in Fetching user" });
    }
});


module.exports = router;