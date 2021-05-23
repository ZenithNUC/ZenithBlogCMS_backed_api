var express = require('express');
var router = express.Router();

const ArticleController = require('../controllers/article')

router.get ('/', ArticleController.list);
// 定义单条文章路由，GET请求
router.get ('/:id', ArticleController.info);
// 定义添加文章路由，POST请求
router.post ('/', ArticleController.add);
// 定义修改文章路由，PUT请求
router.put ('/', ArticleController.update);
// 定义删除文章路由，DELETE请求
router.delete ('/', ArticleController.remove);

module.exports = router;