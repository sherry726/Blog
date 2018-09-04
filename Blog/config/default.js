module.exports = {
    port:3000,   //项目运行的端口号，并非mongoose的端口号
    mongodb:'mongodb://localhost:27017/myblog',
    session:{
        secret:'wqblog',
        key:'wqblog',
        maxAge:2592000000
    }
};