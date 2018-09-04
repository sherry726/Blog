//导入模块
const express = require('express');
const  sha1 = require('sha1');
const checkNotLogin = require('../middlewares/check').checkNotLogin;
//创建路由实例
const router = express.Router();
const UsersModel = require('../models/users');
//get  /login     登录页
router.get('/',checkNotLogin,(req,res)=>{
    //渲染登录页
    res.render('login');
});
//post /login   执行登录页
router.post('/',checkNotLogin,(req,res,next)=>{
    //获取用户输入的登录数据
    let username = req.fields.username;
    let password = req.fields.password;
    //得到session信息的方法，返回一个session对象
    console.log(req.session);
    //从集合中查询文档
    UsersModel.findOneByName(username)
        .then((result)=>{
            //判断用户名是否存在
            if(!result){
                //用户名不存在
                req.flash('error','用户名不存在');
                return res.redirect('back');   //返回
            }
            if(sha1(password) != result.password){
                //密码错误
                req.flash('error','密码错误');
                return res.redirect('back');
            }
            //在把用户信息写入到session之前，先删除密码，保证密码安全性
            delete result.password;
            //登录成功后，将用户信息写入到session中
            req.session.user = result;
            //消息通知
            req.flash('success','登录成功');
            //登录成功后，跳转到首页
            res.redirect('/');
        })
        .catch((err)=>{
            next(err);
        })
});
//导出模块
module.exports = router;