//导入模块
const express = require('express');
const checkLogin = require('../middlewares/check').checkLogin;
const postsModel = require('../models/posts');
const commentsModel = require('../models/comments');
//创建路由实例
const router = express.Router();

//get  /posts   主页  ||   /posts?author=xxxx  个人主页
router.get('/',(req,res,next)=>{
    let author = req.query.author;
    postsModel.getPosts(author)
        .then((result)=>{
            res.render('posts',{posts:result});
        })
        .catch(next);
});


//get   /posts/create    发表文章页
router.get('/create',checkLogin,(req,res)=>{
   res.render('create');
});

//get /posts/:postId   文章详情页
router.get('/:postId',(req,res,next)=>{
    const postId = req.params.postId;
    Promise.all([
        postsModel.findPostById(postId),
        commentsModel.getCommentsByPostId(postId),
        postsModel.incPV(postId)
    ]).then((result)=>{
        const post = result[0];
        const comments = result[1];
        if(!post){
            res.redirect('/');
        }
        res.render('post',{post:post,comments:comments});
    })
        .catch(next)
});

//post  /posts    执行发表文章页
router.post('/',checkLogin,(req,res)=>{
   //获取发表文章的内容
    const postData = {
        author:req.session.user._id,
        title:req.fields.title,
        content:req.fields.content,
        pv:0
    };
    postsModel.create(postData)
        .then((result)=>{
            let postId = req.session.user._id;
            req.flash('success','文章发表成功');
            res.redirect('/posts/'+postId)
        })
        .catch((err)=>{
            req.flash('error',err.toString().split(':').pop());
            res.redirect('back');
        })
});

//get  /posts/:postId/edit  修改文章页
router.get('/:postId/edit',checkLogin,(req,res,next)=>{
    let postId = req.params.postId;
    postsModel.getEditPostById(postId)
        .then((result)=>{
            res.render('edit',{post:result});
        })
        .catch(next)
});

//post  /posts/:postId/edit  执行修改文章页
router.post('/:postId/edit',checkLogin,(req,res)=>{
    let postId = req.params.postId;
    let postData = {
        title:req.fields.title,
        content:req.fields.content
    };
    postsModel.updatePostById(postId,postData)
        .then((result)=>{
            req.flash('success','更新成功');
            res.redirect('/posts/'+postId);
        })
        .catch((err)=>{
            req.flash('error','更新失败');
            res.redirect('back');
        })
});

//get /posts/:postId/remove   删除文章页
router.get('/:postId/remove',checkLogin,(req,res)=>{
    let postId = req.params.postId;
    Promise.all([
        postsModel.removePostById(postId),
        commentsModel.deleteCommentsById(postId)
    ])
        .then((result)=>{
            req.flash('success','文章删除成功');
            res.redirect('/posts');
        })
        .catch((err)=>{
            req.flash('error','文章删除失败');
            res.redirect('back');
        })
});

//post /posts/:postId/comment  创建留言
router.post('/:postId/comment',checkLogin,(req,res)=>{
    //获取留言内容
    let postId = req.params.postId;
    let commentData = {
        userId:req.session.user._id,
        postId:postId,
        content:req.fields.content
    };
    commentsModel.create(commentData)
            .then((result)=>{
                req.flash('success','留言创建成功');
                res.redirect('/posts/'+postId);
            })
             .catch((err)=>{
                req.flash('error',err.toString().split(':').pop());
                res.redirect('back');
             })
});

//get  /posts/:postId/comment/:commentId/remove  删除留言
router.get('/:postId/comment/:commentId/remove',checkLogin,(req,res)=>{
   let commentId = req.params.commentId;
   commentsModel.deleteCommentById(commentId)
       .then(()=>{
           req.flash('success','留言删除成功');
           res.redirect('back');
       })
       .catch(()=>{
           req.flash('error','留言删除失败');
           res.redirect('back');
       })
});

//导出模块
module.exports = router;
