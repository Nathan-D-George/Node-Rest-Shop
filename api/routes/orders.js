const express = require('express');
const router = express.Router();

const checkAuth = require('../middleware/check-auth');
const OrdersController = require("../controllers/orders");

// GET all
router.get('/', checkAuth, OrdersController.orders_get_all);

// GET one
router.get('/:orderId', checkAuth, OrdersController.order_get_one);

// CREATE one
router.post('/', checkAuth, OrdersController.order_create);

// DELETE one
router.delete('/:orderId', checkAuth, OrdersController.order_delete);

module.exports = router;
