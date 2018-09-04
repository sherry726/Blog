module.exports = {
    //只有登录了，才能进行的操作
    checkLogin:function (req,res,next) {
        if(!req.session.user){
            req.flash('error','请登录');
            return res.redirect('/login');
        }
        next();
    },
    checkNotLogin:function(req,res,next){
        //未登录才能进行的操作
        if(req.session.user){
            req.flash('error','您已经登录，请先退出登录');
            return res.redirect('back');
        }
        next();
    }
};



