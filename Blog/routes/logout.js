//导入模块
const express = require('express');
//创建路由实例
const router = express.Router();

//get  /logout   退出登录
router.get('/',(req,res)=>{
    //退出登录即删除session中的user信息即可
    req.session.user = null;
    //跳转到首页
    res.redirect('/');
});

//导出模块
module.exports = router;