const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const UsersController = require("../controllers/users");

router.post('/signup', UsersController.sign_up);

router.post('/login', UsersController.login);

router.delete('/:userId', checkAuth, UsersController.delete_user);

module.exports = router;
