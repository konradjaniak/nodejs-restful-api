const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Product = require('../models/product');


//====================================================================== GET ALL PRODUCTS

router.get('/', (req, res, next) => {
    Product.find()
        .select('name price _id')
        .exec()
        .then(docs => {

            const response = {
                count: docs.length,
                products: docs.map(docs => {
                    return {
                        name: docs.name,
                        price: docs.price,
                        _id: docs._id,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/products/' + docs._id
                        }
                    }
                })
            }
            if (docs.length > 0) {
                res.status(200).json(response);
            } else {
                res.status(200).json({
                    message: 'No entries found'
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

//====================================================================== ADD NEW PRODUCT

router.post('/', (req, res, next) => {
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price
    });

    product.save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: 'Created product successfully',
                createdProduct: {
                    name: result.name,
                    price: result.price,
                    _id: result._id,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/products/' + result._id
                    }
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

//====================================================================== GET SPECIFIC PRODUCT

router.get('/:productId', (req, res, next) => {

    const id = req.params.productId;

    Product.findById(id)
        .select('name price _id')
        .exec()
        .then(doc => {
            if (doc) {
                res.status(200).json({
                    product: doc,
                    request: {
                        type: 'GET',
                        description: 'Get all products',
                        url: 'http://localhost:3000/products/'
                    }
                });
            } else {
                res.status(404).json({
                    message: 'No product found with this ID'
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

//====================================================================== UPDATE PRODUCT

router.patch('/:productId', (req, res, next) => {
    const id = req.params.productId; // get product id
    const props = req.body; // get product properties that will be changed

    Product.update({ _id: id }, { $set: props })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Product updated',
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/products/' + id
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

//====================================================================== DELETE PRODUCT

router.delete('/:productId', (req, res, next) => {
    const id = req.params.productId;
    Product.remove({_id: id})
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Product deleted',
                request: {
                    type: 'POST',
                    url: 'http://localhost:3000/products/',
                    body: {
                        name: 'String',
                        price: 'Number'
                    }
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

//====================================================================== EXPORT ROUTER

module.exports = router; 