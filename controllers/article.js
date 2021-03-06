const Common = require("./common")

const ArticleModel = require("../models/article")

const CateModel = require("../models/category")

const Constant = require('../constant/constant')

const dateFormat = require('dateformat')

let exportObj = {
    list,
    info,
    add,
    update,
    remove
}

module.exports = exportObj;

/**
 * 获取文章列表方法
 * @param req
 * @param res
 */
function list (req, res) {
    const resObj = Common.clone (Constant.DEFAULT_SUCCESS);
    let tasks = {
        checkParams: (cb) => {
            // 调用公共方法中的校验参数方法，成功继续后面操作，失败则传递错误信息到async最终方法
            Common.checkParams (req.query, ['page', 'rows'], cb);
        },
        query: ['checkParams', (results, cb) => {
            // 根据前端提交参数计算SQL语句中需要的offset，即从多少条开始查询
            let offset = req.query.rows * (req.query.page - 1) || 0;
            // 根据前端提交参数计算SQL语句中需要的limit，即查询多少条
            let limit = parseInt (req.query.rows) || 20;
            // 设定一个查询条件对象
            let whereCondition = {};
            // 如果查询标题存在，查询对象增加标题
            if(req.query.title){
                whereCondition.title = req.query.title;
            }
            // 通过offset和limit使用article的model去数据库中查询，并按照创建时间排序
            ArticleModel
                .findAndCountAll ({
                    where: whereCondition,
                    offset: offset,
                    limit: limit,
                    order: [['created_at', 'DESC']],
                    // 关联cate表进行联表查询
                    include: [{
                        model: CateModel
                    }]
                })
                .then (function (result) {
                    // 查询结果处理
                    // 定义一个空数组list，用来存放最终结果
                    let list = [];
                    // 遍历SQL查询出来的结果，处理后装入list
                    result.rows.forEach ((v, i) => {
                        console.log(v)
                        let obj = {
                            id: v.id,
                            title: v.title,
                            description: v.description.substr(0, 20) + '...',
                            category: v.category,
                            // 获取联表查询中的cate表中的name
                            cateName: v.Category.name,
                            content: v.content,
                            createdAt: dateFormat (v.createdAt, 'yyyy-mm-dd HH:MM:ss')
                        };
                        list.push (obj);
                    });
                    // 给返回结果赋值，包括列表和总条数
                    resObj.data = {
                        list,
                        count: result.count
                    };
                    // 继续后续操作
                    cb (null);
                })
                .catch (function (err) {
                    // 错误处理
                    // 打印错误日志
                    console.log (err);
                    // 传递错误信息到async最终方法
                    cb (Constant.DEFAULT_ERROR);
                });

        }]
    }
    Common.autoFn (tasks, res, resObj)
}

/**
 * 获取文章详情方法
 * @param req
 * @param res
 */
function info (req, res) {
    const resObj = Common.clone (Constant.DEFAULT_SUCCESS);
    let tasks = {
        checkParams: (cb) => {
            // 调用公共方法中的校验参数方法，成功继续后面操作，失败则传递错误信息到async最终方法
            Common.checkParams (req.params, ['id'], cb);
        },
        // 查询方法，依赖校验参数方法
        query: ['checkParams', (results, cb) => {
            // 使用article的model中的方法查询
            ArticleModel
                .findByPk (req.params.id, {
                    include: [{
                        model: CateModel
                    }]
                })
                .then (function (result) {
                    // 查询结果处理
                    // 如果查询到结果
                    if(result){
                        // 将查询到的结果给返回对象赋值
                        resObj.data = {
                            id: result.id,
                            name: result.name,
                            description: result.description,
                            content: result.content,
                            category: result.category,
                            // 获取联表查询中的cate表中的name
                            cateName: result.Category.name,
                            createdAt: dateFormat (result.createdAt, 'yyyy-mm-dd HH:MM:ss')
                        };
                        // 继续后续操作
                        cb(null);
                    }else{
                        // 查询失败，传递错误信息到async最终方法
                        cb (Constant.ARTICLE_NOT_EXSIT);
                    }
                })
                .catch (function (err) {
                    // 错误处理
                    // 打印错误日志
                    console.log (err);
                    // 传递错误信息到async最终方法
                    cb (Constant.DEFAULT_ERROR);
                });

        }]
    }
    Common.autoFn (tasks, res, resObj)
}

/**
 * 添加文章方法
 * @param req
 * @param res
 */
function add (req, res) {
    // 定义一个返回对象
    const resObj = Common.clone (Constant.DEFAULT_SUCCESS);
    // 定义一个async任务
    let tasks = {
        // 校验参数方法
        checkParams: (cb) => {
            // 调用公共方法中的校验参数方法，成功继续后面操作，失败则传递错误信息到async最终方法
            Common.checkParams (req.body, ['title', 'category', 'description', 'content'], cb);
        },
        // 添加方法，依赖校验参数方法
        add: cb => {
            // 使用article的model中的方法插入到数据库
            ArticleModel
                .create ({
                    title: req.body.title,
                    description: req.body.description,
                    content: req.body.content,
                    category: req.body.category
                })
                .then (function (result) {
                    // 插入结果处理
                    // 继续后续操作
                    cb (null);
                })
                .catch (function (err) {
                    // 错误处理
                    // 打印错误日志
                    console.log (err);
                    // 传递错误信息到async最终方法
                    cb (Constant.DEFAULT_ERROR);
                });
        }
    };
    // 执行公共方法中的autoFn方法，返回数据
    Common.autoFn (tasks, res, resObj)
}

/**
 * 修改文章方法
 * @param req
 * @param res
 */
function update (req, res) {
    const resObj = Common.clone (Constant.DEFAULT_SUCCESS);
    // 定义一个async任务
    let tasks = {
        checkParams: (cb) => {
            // 调用公共方法中的校验参数方法，成功继续后面操作，失败则传递错误信息到async最终方法
            Common.checkParams (req.body, ['id', 'title', 'category', 'description', 'content'], cb);
        },
        // 更新方法，依赖校验参数方法
        update: cb => {
            // 使用article的model中的方法更新
            ArticleModel
                .update ({
                    title: req.body.title,
                    description: req.body.description,
                    content: req.body.content,
                    category: req.body.category
                }, {
                    where: {
                        id: req.body.id
                    }
                })
                .then (function (result) {
                    // 更新结果处理
                    if(result[0]){
                        // 如果更新成功
                        // 继续后续操作
                        cb (null);
                    }else{
                        // 更新失败，传递错误信息到async最终方法
                        cb (Constant.ARTICLE_NOT_EXSIT);
                    }
                })
                .catch (function (err) {
                    // 错误处理
                    // 打印错误日志
                    console.log (err);
                    // 传递错误信息到async最终方法
                    cb (Constant.DEFAULT_ERROR);
                });
        }
    };
    // 执行公共方法中的autoFn方法，返回数据
    Common.autoFn (tasks, res, resObj)
}

/**
 * 删除文章方法
 * @param req
 * @param res
 */
function remove (req, res) {
// 定义一个返回对象
    const resObj = Common.clone (Constant.DEFAULT_SUCCESS);
    // 定义一个async任务
    let tasks = {
        // 校验参数方法
        checkParams: (cb) => {
            // 调用公共方法中的校验参数方法，成功继续后面操作，失败则传递错误信息到async最终方法
            Common.checkParams (req.body, ['id'], cb);
        },
        // 删除方法，依赖校验参数方法
        remove: cb => {
            // 使用article的model中的方法更新
            ArticleModel
                .destroy ({
                    where: {
                        id: req.body.id
                    }
                })
                .then (function (result) {
                    // 删除结果处理
                    if(result){
                        // 如果删除成功
                        // 继续后续操作
                        cb (null);
                    }else{
                        // 删除失败，传递错误信息到async最终方法
                        cb (Constant.ARTICLE_NOT_EXSIT);
                    }
                })
                .catch (function (err) {
                    // 错误处理
                    // 打印错误日志
                    console.log (err);
                    // 传递错误信息到async最终方法
                    cb (Constant.DEFAULT_ERROR);
                });
        }
    };
    // 执行公共方法中的autoFn方法，返回数据
    Common.autoFn (tasks, res, resObj)
}