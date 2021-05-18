const Common = require('./common')

const AdminModel = require('../models/admin')

const Constant = require('../constant/constant')

const dateFormat = require('dateformat')

const Token = require('./token')

const TOKEN_EXPIRE_SECOND = 3600;

let exportObj = {
    login
}

module.exports = exportObj

function login(req,res){
    const resObj = Common.clone(Constant.DEFAULT_SUCCESS)
    let tasks = {
        checkParams : (cb) => {
            Common.checkParams(req.body,['username','password'],cb);
        },
        query : ['checkParams',(results , cb) => {
            AdminModel
                .findOne({
                    where:{
                        username: req.body.username,
                        password: req.body.password
                    }
                })
                .then(function (result){
                    if(result){
                        resObj.data = {
                            id: result.id,
                            username:result.username,
                            name: result.name,
                            role: result.role,
                            lastLoginAt: dateFormat (result.lastLoginAt, 'yyyy-mm-dd HH:MM:ss'),
                            createdAt: dateFormat (result.createdAt, 'yyyy-mm-dd HH:MM:ss')
                        }
                        const adminInfo = {
                            id : result.id
                        }
                        let token = Token.encrypt(adminInfo,TOKEN_EXPIRE_SECOND)        // 生成token，包含用户id和有效时间
                        resObj.data.token = token;
                        cb (null, result.id);
                    }else{
                        cb(Constant.LOGIN_ERROR)
                    }
                })
                .catch(function (err){
                    console.log(err)
                    cb(Constant.DEFAULT_ERROR)
                })
        }],
        writeLastLoginAt: ['query', (results, cb) => {
            // 获取前面传递过来的参数admin的id
            let adminId = results['query'];
            // 通过id查询，将当前时间更新到数据库中的上次登录时间
            AdminModel
                .update ({
                    lastLoginAt: new Date()
                }, {
                    where: {
                        id: adminId
                    }
                })
                .then (function (result) {
                    // 更新结果处理
                    if(result){
                        // 更新成功，则继续后续操作
                        cb (null);
                    }else{
                        // 更新失败，传递错误信息到async最终方法
                        cb (Constant.DEFAULT_ERROR);
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
    Common.autoFn(tasks,res,resObj)
}