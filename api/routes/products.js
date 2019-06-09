const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Product = require('../models/product');


//====================================================================== GET ALL PRODUCTS

router.get('/', (req, res, next) => {
    Product.find()
        .exec()
        .then(docs => {
            console.log(docs);
            console.log(docs.length);
            if (docs.length > 0) {
                res.status(200).json(docs);
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
                message: 'Handling POST requests to /products',
                createdProduct: product
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
        .exec()
        .then(doc => {
            console.log('From database:', doc);
            if (doc) {
                res.status(200).json(doc);
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
            console.log(result);
            res.status(200).json({result});
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
            res.status(200).json(result);
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