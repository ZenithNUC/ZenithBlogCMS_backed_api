// 引入公共方法
const Common = require ('./common');
// 引入info表的model
const InfoModel = require ('../models/info');
// 引入常量
const Constant = require ('../constant/constant');

const dateFormat = require ('dateformat');

let exportObj = {
    info,
    update,
};

module.exports = exportObj;

function info (req, res) {
    const resObj = Common.clone (Constant.DEFAULT_SUCCESS);
    let tasks = {
        query: cb => {
            // 使用info的model中的方法查询
            InfoModel
                // 查询指定id为1的数据
                .findByPk (1)
                .then (function (result) {
                    // 查询结果处理
                    // 如果查询到结果
                    if(result){
                        // 将查询到的结果给返回对象赋值
                        resObj.data = {
                            id: result.id,
                            title: result.title,
                            subtitle: result.subtitle,
                            about: result.about,
                            createdAt: dateFormat (result.createdAt, 'yyyy-mm-dd HH:MM:ss')
                        };
                        // 继续后续操作
                        cb(null);
                    }else{
                        // 查询失败，传递错误信息到async最终方法
                        cb (Constant.BLOG_INFO_NOT_EXSIT);
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
    }
    Common.autoFn(tasks,res,resObj)
}

function update (req, res) {
    
}