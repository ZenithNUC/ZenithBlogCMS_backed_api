var express = require('express');
var router = express.Router();

const IndexController = require('../controllers/info')

router.get ('/', InfoController.info);
// 定义修改博客信息路由，PUT请求
router.put ('/', InfoController.update);

module.exports = router;