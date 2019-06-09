const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');


// IMPORT ROUTES
const productRoutes = require('./api/routes/products');
const ordersRoutes = require('./api/routes/orders');


// spróbować usunąć drugi argument (ponoć teraz działa bez niego)
mongoose.connect('mongodb+srv://test-user:' + process.env.MONGO_ATLAS_PASSWORD + '@restapitutorial-we4ni.mongodb.net/test?retryWrites=true&w=majority',
    {
        useNewUrlParser: true
    });


app.use(morgan('dev'));
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());


app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, PATCH, DELETE');
        return res.status(200).json({});
    }
    next();
});


// MIDDLEWARE
app.use('/products', productRoutes);
app.use('/orders', ordersRoutes);


// ERROR HANDLING
app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});


app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});


module.exports = app;