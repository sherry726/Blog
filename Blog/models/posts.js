const mongoose = require('mongoose');
const moment = require('moment');
const marked = require('marked');
const objectIdToTimestamp = require('objectid-to-timestamp');
const commentsModel = require('./comments');
//创建Schema
const postsSchema = new mongoose.Schema({
   author:{type:mongoose.Schema.Types.ObjectId,ref:'users'},
   title:{type:String,required:[true,'文章标题不能为空']},
   content:{type:String,required:[true,'文章内容不能为空']},
   pv:{type:Number}
},{
    collection:'posts'
});

//添加插件：处理时间格式、markdown解析
postsSchema.plugin(function(schema){

    schema.post('find', function(result){
        return Promise.all(result.map(function(item){
                item.created_at = moment(objectIdToTimestamp(item._id)).format('YYYY-MM-DD HH:mm');
                item.contentHtml = marked(item.content);
                return commentsModel.getCommentsCount(item._id)
                    .then((result)=>{
                        item.commentsCount = result;
                    })
            })
        )
    });

    schema.post('findOne', function(item){
        if (item) {
            item.created_at = moment(objectIdToTimestamp(item._id)).format('YYYY-MM-DD HH:mm');
            item.contentHtml = marked(item.content);
            return commentsModel.getCommentsCount(item._id)
                .then((result)=>{
                    item.commentsCount = result;
                })
        }
        return item;
    })

});


//创建模型
const postsModel = mongoose.model('posts',postsSchema);
//导出
module.exports = {
    //发表文章
    create(data){
        let post = new postsModel(data);
        return post.save();   // 返回Promise对象
    },
    //查询所有文章
    getPosts(author){
        let query = {};
        if(author){
            query.author = author;
        }
        return postsModel.find(query).populate('author').sort({_id:-1}).exec();
    },
    //查询具体的文章
    findPostById(postId){
        return postsModel.findOne({_id:postId}).populate('author').exec();
    },

    //文章浏览次数的增加
    incPV(postId){
        return postsModel.update({_id:postId},{$inc:{pv:1}}).exec();
    },

    //修改文章
    getEditPostById(postId){
        return postsModel.findById(postId).exec();
    },
    //根据文章id，更新文章
    updatePostById(postId,data){
        return postsModel.update({_id:postId},{$set:data}).exec();
    },
    //根据文章id，删除文章
    removePostById(postId){
        return postsModel.deleteOne({_id:postId}).exec();
    }
};


