/*用户集合模型*/
const mongoose = require('mongoose');
const sha1 = require('sha1');
require('../lib/mongo');
//定义Schema
const UsersSchema = new mongoose.Schema({
    username:{
        type:String,
        unique:[true,'用户名已经被占用'],
        index:true,
        required:[true,'用户名不能为空'],
        minlength:[2,'用户名至少2个字符'],
        maxlength:[12,'用户名不能超过10个字符']
    },
    password:{
        type:String,
        required:[true,'密码不能为空'],
        minlength:[6,'密码不能少于6位字符']
    },
    avatar:{
      type:String
    },
    sex:{
        type:String,
        enum:{
                values:['m','w','e'],
                message:'性别不能乱写'
        }
    },
    bio:{
        type:String
    }
},{autoIndex:true,collection:'users'});
//创建模型
const UsersModel = mongoose.model('users',UsersSchema);
//导出
module.exports = {
    create(user){
        //验证密码长度
        if(user.password.length < 6){
            return new Promise((resolve,reject)=>{
                reject('自定义错误:password:密码长度至少为6位');
            })
        }
        //验证两次密码的一致性
        if(user.password != user.repassword){
            return new Promise((resolve,reject)=>{
                reject('自定义错误:password:两次密码不一致');
            })
        }
        user.password = sha1(user.password);
        delete user.repassword;
        let userInstance = new UsersModel(user);
        return userInstance.save();
    },
    findOneByName(username){
        return UsersModel.findOne({username:username}).exec();
    }
};