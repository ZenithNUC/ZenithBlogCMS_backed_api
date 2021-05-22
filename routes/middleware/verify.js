const Token = require('../../controllers/token')

const Constant = require('../../constant/constant')

const exportObj = {
    verifyToken
};

module.exports = exportObj

function verifyToken(req,res,next){
    if(req.path === '/login'){
        return next()
    }
    let token = req.headers.token
    let tokenVerifyObj = Token.decrypt(token);
    if(tokenVerifyObj.token){
        next();                                 // 验证通过，进行下一步
    }else{
        res.json(Constant.TOKEN_ERROR)      // 验证不通过，返回错误代码
    }
}