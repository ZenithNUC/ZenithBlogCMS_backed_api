var express = require('express');
var router = express.Router();

const AdminController = require('../controllers/admin')

// 定义管理员列表路由，GET请求
router.get ('/', AdminController.list);
// 定义单条管理员路由，GET请求
router.get ('/:id', AdminController.info);
// 定义添加管理员路由，POST请求
router.post ('/', AdminController.add);
// 定义修改管理员路由，PUT请求
router.put ('/', AdminController.update);
// 定义删除管理员路由，DELETE请求
router.delete ('/', AdminController.remove);

module.exports = router;