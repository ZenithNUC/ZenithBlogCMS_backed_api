// 引入Sequelize模块
const Sequelize = require('sequelize');
// 引入数据库实例
const database = require('../database');
// 定义model
const Admin = database.define('Admin', {
    // 主键
    id: {type: Sequelize.INTEGER, primaryKey: true, allowNull: false, autoIncrement: true},
    // 用户名
    username: {type: Sequelize.STRING(20), allowNull: false},
    // 密码
    password: {type: Sequelize.STRING(36), allowNull: false},
    // 姓名
    name: {type: Sequelize.INTEGER, allowNull: false},
    // 角色
    role: {type: Sequelize.STRING(20), allowNull: false},
    // 上次登录时间
    lastLoginAt: {type: Sequelize.DATE}
}, {
    // 是否支持驼峰
    underscored: true,
    // MySQL数据库表名
    tableName: 'admin',
});
// 导出model
module.exports = Admin;