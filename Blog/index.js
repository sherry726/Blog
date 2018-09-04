//导入模块
const express = require('express');
const path = require('path');
const pkg = require('./package.json');
const config = require('config-lite')(__dirname);
const router = require('./routes/index');
//导入专用于处理日志的模块
const winston = require('winston');
const expressWinston = require('express-winston');
//接收表单数据及文件上传的模块
const formidable = require('express-formidable');
//session模块
const session = require('express-session');
const MongoStore = require('connect-mongo')(session); //专用于把session存放到mongodb中的模块
//消息通知
const flash = require('connect-flash');

//创建express实例
const app = express();

//模板引擎的使用
app.set('views',path.join(__dirname,'views'));  //设置模板所在的目录
app.set('view engine','ejs');  //设置所使用的引擎


//静态资源托管
app.use(express.static(path.join(__dirname,'public')));

//定义session中间件
app.use(session({
    name:config.session.key,
    secret:config.session.secret,
    cookie:{
        maxAge:config.session.maxAge
    },
    store:new MongoStore({
        url:config.mongodb
    }),
    resave:false,
    saveUninitialized:true
}));
//flash中间件，显示通知，是基于session的，必须写到session中间件中之后
app.use(flash());


//设置模板全局变量
app.locals.blog = {
    title:pkg.name,
    description:pkg.description
};
//中间件 ---- 向模板中添加全局变量
app.use((req,res,next)=>{
    res.locals.user =  req.session.user;
    res.locals.success = req.flash('success').toString();
    res.locals.error = req.flash('error').toString();
    next()
});

//设置“处理post请求和文件上传”的中间件
app.use(formidable({
    uploadDir: path.join(__dirname,'public/img'),
    keepExtensions:true
}));

//记录用户正常请求的日志消息
/*app.use(expressWinston.logger({
    transports:[
        new (winston.transports.Console)({
            json:true,
            colorize:true
        }),
        new (winston.transports.File)({
            filename:'logs/success.log'
        })
    ]
}));*/

//路由
router(app);

//记录用户请求错误的日志消息
app.use(expressWinston.logger({
    transports:[
        new (winston.transports.Console)({
            json:true,
            colorize:true
        }),
        new (winston.transports.File)({
            filename:'logs/error.log'
        })
    ]
}));

//错误处理中间件，定制错误页面
app.use((err,req,res,next)=>{
    res.status(500).render('error',{error:err});
});

//监听
app.listen(config.port,()=>{
    console.log(`${pkg.name} is running on port ${config.port}`);
});