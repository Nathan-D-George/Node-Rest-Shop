const express = require('express');
const router = express.Router();

const checkAuth = require('../middleware/check-auth');
const ProductsController = require("../controllers/products");

// for file upload
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, './uploads/');
    },
    filename: function(req, file, callback) {
        callback(null, file.originalname);
    }
});

const fileFilter = (req, file, callback) => {
    if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/png') {
        callback(null, true);
    } else {
        callback(null, false);
    }
}
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 1024*1024*5 },
    fileFilter: fileFilter
});

router.get('/', checkAuth, ProductsController.get_products);

router.get('/:id', checkAuth, ProductsController.get_one_product);

router.post('/', checkAuth, upload.single('productImage'), ProductsController.create_product);

router.patch('/:id', checkAuth, ProductsController.update_product);

router.delete('/:id', checkAuth, ProductsController.delete_product);

module.exports = router;
