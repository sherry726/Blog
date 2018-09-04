//导入模块
const express = require('express');
const path = require('path');
const UsersModel = require('../models/users.js');
const checkNotLogin = require('../middlewares/check').checkNotLogin;
//创建路由实例
const router = express.Router();

//get  /register  注册页
router.get('/',checkNotLogin,(req,res)=>{
    //渲染注册页面
    res.render('register');
});

//post  /register  执行注册
router.post('/',checkNotLogin,(req,res)=>{
    //获取表单数据
    let user = {
        username:req.fields.username,
        password:req.fields.password,
        repassword:req.fields.repassword,
        sex:req.fields.sex,
        avatar:req.files.avatar.path.split(path.sep).pop(),
        bio:req.fields.bio
    };
    //将得到的表单数据，也就是文档写入到集合中
    UsersModel.create(user)
        .then((result)=>{
            //添加通知信息
            req.flash('success','注册成功');
            //注册成功后，跳转到登录页
            res.redirect('/login');
        })
        .catch((err)=>{
            let errMessage = err.toString().split(':').pop();
            //添加通知信息
            req.flash('error',errMessage);
            //注册失败，仍然回到注册页
            res.redirect('/register');
        })
});

//导出模块
module.exports = router;