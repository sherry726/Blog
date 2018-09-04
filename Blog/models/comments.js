/*留言模型设计*/
const mongoose = require('mongoose');
const moment = require('moment');
const objectIdToTimestamp = require('objectid-to-timestamp');
//创建Schema
const CommentsSchema = new mongoose.Schema({
    userId:{type:mongoose.Schema.Types.ObjectId,ref:'users'},  //标识是谁添加的留言
    postId:{type:mongoose.Schema.Types.ObjectId},  //标识是给哪篇文章添加的留言
    content:{type:String,required:[true,'留言内容不能为空']}
},{
    collection:'comments'
});

//添加插件：显示留言时间
CommentsSchema.plugin(function (schema) {
   schema.post('find',function(result){
       result.forEach(function (item) {
           item.created_at = moment(objectIdToTimestamp(item._id)).format('YYYY-MM-DD HH:mm');
       })
   })
});


//创建Schema
const CommentsModel = mongoose.model('comments',CommentsSchema);

//导出接口
module.exports = {
    create(commentData){
        let comment = new CommentsModel(commentData);
        return comment.save();
    },

    //根据文章id，显示留言
    getCommentsByPostId(postId){
        return CommentsModel
            .find({postId:postId})
            .populate('userId')
            .sort({_id:-1})
            .exec();
    },

    //根据文章id，返回留言数量
    getCommentsCount(postId){
        return CommentsModel.count({postId:postId}).exec();
    },

    //根据留言id，删除留言
    deleteCommentById(commentId){
        return CommentsModel.deleteOne({_id:commentId}).exec();
    },

    //删除文章的同时，删除留言
    deleteCommentsById(postId){
        return CommentsModel.deleteMany({postId:postId}).exec();
    }
};

