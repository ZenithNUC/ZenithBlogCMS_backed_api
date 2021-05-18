const jwt = require('jsonwebtoken')

const config = require('../config')

tokenKey = config.TokenKey;

const Token = {
    /**
     * Token加密过程
     * @param data 需要加密的数据
     * @param time 当前时间戳
     */
    encrypt : function (data,time){
        return jwt.sign(data,tokenKey,{expiresIn: time})
    },
    /**
     * token解密方法
     * @param token 需要解密的token
     */
    decrypt : function (token){
        try {
            let data = jwt.verify(token,tokenKey);
            return {
                token:true,
                data:data
            };
        }catch (e){
            return {
                token: false,
                data: e
            }
        }
    }
}

module.exports = Token