const Common = require("./common")

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

module.exports = exportObj

/**
 * 获取分类列表
 * @param req
 * @param res
 */
function list(req,res){
    const resObj = Common.clone(Constant.DEFAULT_SUCCESS)
    let tasks = {
        checkParams:(cb) => {
            if(req.query.dropList){
                cb(null);
            }else{
                Common.checkParams(req.query,['page','rows'],cb);
            }
        },
        query:['checkParams',(results,cb) => {
            let searchOption;
            if(req.query.dropList){
                searchOption = {
                    order:[['created_at','DESC']]
                }
            }else{
                let offset = req.query.rows * (req.query.page - 1) || 0;
                let limit = parseInt (req.query.rows) || 20;
                let whereCondition = {};
                if(req.query.name){
                    whereCondition.name = req.query.name;
                }
                searchOption = {
                    where: whereCondition,
                    offset: offset,
                    limit: limit,
                    order: [['created_at', 'DESC']]
                }
            }
            CateModel
                .findAndCountAll (searchOption)
                .then(function (result){
                    let list = [];
                    // 遍历SQL查询出来的结果，处理后装入list
                    result.rows.forEach ((v, i) => {
                        let obj = {
                            id: v.id,
                            name: v.name,
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
                })
        }]
    }
    Common.autoFn(tasks,res,resObj)
}

/**
 * 获取单条分类方法
 * @param req
 * @param res
 */
function info(req,res){
    const resObj = Common.clone(Constant.DEFAULT_SUCCESS)
    let tasks = {
        checkParams:(cb) => {
            if(req.query.dropList){
                cb(null)
            }else{
                Common.checkParams(req.q,['id'],cb);
            }
        },
        query:['checkParams', (results, cb) => {
            CateModel
                .findByPk(req.params.id)
                .then(function (result){
                    if(result){
                        resObj.data = {
                            id: result.id,
                            name: result.name,
                            createdAt: dateFormat (result.createdAt, 'yyyy-mm-dd HH:MM:ss')
                        }
                        cb(null);
                    }else {
                        cb (Constant.CATE_NOT_EXSIT);
                    }
                })
                .catch(function (err){
                    console.log (err);
                    // 传递错误信息到async最终方法
                    cb (Constant.DEFAULT_ERROR);
                })
        }]
    }
    Common.autoFn(tasks,res,resObj)
}

function add(req,res){
    const resObj = Common.clone(Constant.DEFAULT_SUCCESS)
    let tasks = {
        checkParams:(cb) => {
            Common.checkParams (req.body, ['name'], cb);
        },
        add: cb => {
            CateModel
                .create({
                    name:req.body.name
                })
                .then(function (result){
                    cb (null);
                })
                .catch(function (err){
                    console.log (err);
                    // 传递错误信息到async最终方法
                    cb (Constant.DEFAULT_ERROR);
                })
        }
    }
    Common.autoFn(tasks,res,resObj)
}

function update(req,res){

}

function remove(req,res){

}