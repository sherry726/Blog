module.exports = function(app){
    //首页
    app.get('/',(req,res)=>{
        res.redirect('/posts');
    });
    app.use('/register',require('./register'));
    app.use('/login',require('./login'));
    app.use('/logout',require('./logout'));
    app.use('/posts',require('./posts'));

    app.use((req,res)=>{
        if(!res.headersSent){
            res.render('404');
        }
    });
};