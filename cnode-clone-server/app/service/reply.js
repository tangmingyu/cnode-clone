'use strict';

const Service = require('egg').Service;

class ReplyService extends Service {
  // 根据Id查询
  findById(replyId) {
    return this.ctx.model.Reply.findOne({
      _id: replyId,
      deleted: false,
    }).exec();
  }

  // 根据commentId查询回复
  async findReplysByCommentId(commentId, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const query = { comment: commentId, deleted: false };

    const total = await this.ctx.model.Reply.countDocuments(query);
    if (total === 0) {
      return { total, data: [] };
    }
    const data = await this.ctx.model.Reply.find(query)
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
  async add(authorId, topicId, commentId, content, replyId) {
    const ctx = this.ctx;
    const reply = new this.ctx.model.Reply();
    reply.author = authorId;
    reply.topic = topicId;
    reply.comment = commentId;
    reply.content = content;
    reply.reply = replyId;

    // 增加参与数,积分等
    await ctx.service.participate.increment(authorId, topicId);

    return reply.save();
  }

  // 更新
  update(authorId, replyId, content) {
    return this.ctx.model.Reply.updateOne(
      { _id: replyId, author: authorId },
      { $set: { content } }
    ).exec();
  }

  // 删除, 减少用户和主题的replyCount
  async del(authorId, topicId, replyId) {
    const ctx = this.ctx;

    // 减少参与数,积分等
    await ctx.service.participate.decrement(authorId, topicId);

    // 删除回复
    return ctx.model.Reply.updateOne(
      { _id: replyId, author: authorId },
      { $set: { deleted: true } }
    ).exec();
  }

  // 点赞/取消点赞
  async thumbUp(userId, replyId) {
    const reply = await this.ctx.model.Reply.findOne({
      _id: replyId,
      deleted: false,
    }).exec();

    const index = reply.thumbUps.indexOf(userId);
    if (index < 0) {
      reply.thumbUps.push(userId);
    } else {
      reply.thumbUps.splice(index, 1);
    }

    return reply.save();
  }
}

module.exports = ReplyService;
