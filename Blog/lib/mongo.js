//导入模块
const mongoose = require('mongoose');
const config = require('config-lite')(__dirname);
//数据库连接
mongoose.connect(config.mongodb,{ useNewUrlParser: true });
const conn = mongoose.connection;
conn.on('open',()=>{
    console.log('数据库连接成功');
});
conn.on('error',(err)=>{
    throw err;
});