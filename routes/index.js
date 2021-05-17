var express = require('express');
var router = express.Router();

const IndexController = require('../controllers/index')

/* GET home page. */
router.post('/login',IndexController.login)

module.exports = router;
