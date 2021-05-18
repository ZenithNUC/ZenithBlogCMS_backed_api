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

}