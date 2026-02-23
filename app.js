const express = require('express');
const app = express();

/**
 * logger
 */
const morgan = require('morgan');

/** 
 *  - extract bodies for requests, make them easily readable
 *  - seems to work with "req" in callback functions below
*/
const bodyParser = require('body-parser');

const productsRoutes = require('./api/routes/products');
const ordersRoutes = require('./api/routes/orders');
const usersRoutes = require('./api/routes/users');
const mongoose = require('mongoose');


// "mongodb+srv://admin:" +
// process.env.MONGO_ATLAS_PW +
// "@node-rest-shop.mpqhktv.mongodb.net/?appName=node-rest-shop",
mongoose.connect(
    "mongodb+srv://admin:admin@node-rest-shop.mpqhktv.mongodb.net/?appName=node-rest-shop"
)
mongoose.Promie = global.Promise;

app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

/** 
 * NB!!!
 * set up headers (including access) for API 
 * app.use((req, res, next) => {
 *     res.header('Access-Control-Allow-Origin', 'https://nathan-d-george/github.io/simple-site');
 * })
*/ 
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );

    // options header is always sent to API before other requests, handle that here
    if (req.method === "OPTIONS") {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }

    // go to other routes
    next();
});

// routes handlers
app.use('/products', productsRoutes);
app.use('/orders', ordersRoutes);
app.use('/users', usersRoutes);

// handle all unfound routes requested
app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

// handle non-404 errors
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;
