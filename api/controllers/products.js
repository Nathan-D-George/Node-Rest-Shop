const mongoose = require('mongoose');
const Product = require('../models/product');

exports.get_products = (req, res, next) => {
    Product.find()
        .select("name price _id productImage")
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                products: docs.map(doc => {
                    return {
                        name: doc.name,
                        price: doc.price,
                        productImage: doc.productImage,
                        _id: doc._id,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/products/'+ doc._id,
                            imageUrl: "http://localhost:3000/uploads/"+ doc.productImage
                        }
                    }
                })
            };
            res.status(200).json(response);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}

exports.get_one_product = (req, res, next) => {
    const id = req.params.id;

    Product.findById(id)
        .select("name price _id productImage")
        .exec()
        .then(doc => {
            if (doc) {
                console.log(doc);
                res.status(200).json({
                    product: doc,
                    productImage: doc.productImage,
                    request: {
                        type: "GET",
                        description: "Get all products",
                        url: "http://localhost:3000/products",
                        imageUrl: "http://localhost:3000/uploads/"+ doc.productImage
                    }
                });
            } else {
                res.status(404).json({
                    message: `No product found with id: ${id}`
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}

exports.create_product = (req, res, next) => {
    console.log("🔥🔥", req.file);
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
    });
    // store this in database
    product
        .save()
        .then((result) => {
            res.status(201).json({
                message: "Product created",
                createdProduct: {
                    name: result.name,
                    price: result.price,
                    _id: result._id,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/products/'+ result._id
                    }
                }
            });
        })
        .catch((error) => {
            console.log(error);
            res.status(500).json({
                error: error
            });
        });

}

exports.update_product = (req, res, next) => {
    const id = req.params.id
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.key] = ops.value;
    }

    Product.findByIdAndUpdate(id,{ $set: updateOps })
        .exec()
        .then(result => {
            res.status(200).json({
                message: "Updated product",
                request: {
                    type: "GET",
                    url: "http://localhost:3000/products/" + result._id
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}

exports.delete_product = (req, res, next) => {
    const id = req.params.id;

    Product.findByIdAndDelete(id)
        .exec()
        .then(result => {
            res.status(200).json({
                message: "Product deleted",
                request: {
                    type: "POST",
                    url: "http://localhost:3000/products",
                    body: { name: "String" ,  price: "Number" }
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}
