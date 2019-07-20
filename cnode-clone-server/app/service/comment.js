'use strict';

const Service = require('egg').Service;

class CommentService extends Service {
  // 根据Id查询
  findById(commentId) {
    const query = {
      _id: commentId,
      deleted: false,
    };
    return this.ctx.model.Comment.findOne(query).exec();
  }

  // 根据topicId查询评论
  async findCommentsByTopicId(topicId, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const query = { topic: topicId, deleted: false };

    const total = await this.ctx.model.Comment.countDocuments(query);
    if (total === 0) {
      return { total, data: [] };
    }
    const data = await this.ctx.model.Comment.find(query)
      .populate(
        'author',
        'username email avatar url location signature weibo score topicCount collectCount participateCount'
      )
      .sort('-createAt')
      .skip(skip)
      .limit(limit)
      .exec();
    return { total, data };
  }

  // 新建, 增加用户replyCount和记分, 增加主题replyCount, 设置lastReply
  async add(authorId, topicId, content) {
    const ctx = this.ctx;
    const comment = new this.ctx.model.Comment();
    comment.author = authorId;
    comment.topic = topicId;
    comment.content = content;

    // 增加参与数,积分等
    await ctx.service.participate.increment(authorId, topicId);

    return comment.save();
  }

  // 更新
  update(authorId, commentId, content) {
    return this.ctx.model.Comment.updateOne(
      { _id: commentId, author: authorId },
      { $set: { content } }
    ).exec();
  }

  // 删除, 减少用户和主题的replyCount
  async del(authorId, topicId, commentId) {
    const ctx = this.ctx;

    // 减少参与数,积分等
    await ctx.service.participate.decrement(authorId, topicId);

    // 删除回复
    await ctx.model.Comment.updateOne(
      { _id: commentId, author: authorId },
      { $set: { deleted: true } }
    ).exec();
  }

  // 点赞/取消点赞
  async thumbUp(userId, commentId) {
    const comment = await this.ctx.model.Comment.findOne({
      _id: commentId,
      deleted: false,
    }).exec();

    const index = comment.thumbUps.indexOf(userId);
    if (index < 0) {
      comment.thumbUps.push(userId);
    } else {
      comment.thumbUps.splice(index, 1);
    }

    return comment.save();
  }
}

module.exports = CommentService;
