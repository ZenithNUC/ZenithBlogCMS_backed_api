var express = require('express');
var router = express.Router();

const CategoryController = require('../controllers/category');

// 分类目录路由 get
router.get('/',CategoryController.list);
// 单条分类路由 get
router.get('/:id',CategoryController.info);
// 定义添加分类路由，POST请求
router.post ('/', CategoryController.add);
// 定义修改分类路由，PUT请求
router.put ('/', CategoryController.update);
// 定义删除分类路由，DELETE请求
router.delete ('/', CategoryController.remove);

module.exports = router;