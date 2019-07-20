'use strict';

const Controller = require('egg').Controller;

class ReplyController extends Controller {
  // 查询回复列表
  async list() {
    const { ctx, service } = this;
    const { topicId, commentId } = ctx.params;
    const { page, limit } = ctx.query;

    const topic = await service.topic.findOne(topicId);
    if (!topic) {
      ctx.body = { status: 'failed', msg: '该主题不存在或者已经删除' };
      return;
    }

    const comment = await service.comment.findById(commentId);
    if (!comment) {
      ctx.body = { status: 'failed', msg: '该楼层不存在或者已经删除' };
      return;
    }

    const pagelist = await service.reply.findReplysByCommentId(
      commentId,
      page,
      limit
    );

    ctx.body = { status: 'success', data: pagelist };
  }

  // 动作/发布回复
  async create() {
    const { ctx, service } = this;
    const userId = ctx.user._id;
    const { topicId, commentId, content, replyId } = ctx.request.body;
    let receiverId = null;

    // 内容不能为空，字数不满足要求
    if (!content || content.trim() === '') {
      ctx.body = { status: 'failed', msg: '回复内容不能为空' };
      return;
    }
    const topic = await service.topic.findOne(topicId);
    // 主题不存在或者已被删除
    if (!topic) {
      ctx.body = { status: 'failed', msg: '该主题不存在或者已被删除' };
      return;
    }
    // 主题已经被锁定
    if (topic.lock) {
      ctx.body = { status: 'failed', msg: '该主题已经被锁定' };
      return;
    }
    // 评论不存在或者已被删除
    const comment = await service.comment.findById(commentId);
    if (!comment) {
      ctx.body = { status: 'failed', msg: '该评论不存在或者已被删除' };
      return;
    }
    // 评论不存在或者已被删除
    if (!replyId) {
      receiverId = comment.author;
    } else if (replyId) {
      const reply = await service.reply.findById(replyId);
      if (!reply) {
        ctx.body = { status: 'failed', msg: '该评论不存在或者已被删除' };
        return;
      }
      receiverId = reply.author;
    }

    const my_reply = await service.reply.add(
      userId,
      topicId,
      commentId,
      content,
      replyId
    );

    // 发送消息
    await Promise.all([
      service.message.sendMessage(userId, receiverId, {
        type: 'reply',
        topicId,
        commentId,
        replyId: my_reply._id,
      }),
      service.message.sendAtMessage(userId, content, {
        topicId: topic._id,
        commentId,
        replyId: my_reply._id,
      }),
    ]);

    ctx.body = { status: 'success', data: { replyId: my_reply._id } };
  }

  // 动作/更新回复
  async update() {
    const { ctx, service } = this;
    const userId = ctx.user._id;
    const { topicId, commentId, replyId, content } = ctx.request.body;

    // 内容不能为空，字数不满足要求
    if (!content || content.trim() === '') {
      ctx.body = { status: 'failed', msg: '回复内容不能为空' };
      return;
    }
    const topic = await service.topic.findOne(topicId);
    // 主题不存在不能更新
    if (!topic) {
      ctx.body = { status: 'failed', msg: '该主题不存在或者已被删除' };
      return;
    }
    // 主题已锁定不能更新
    if (topic.lock) {
      ctx.body = { status: 'failed', msg: '该主题已经被锁定' };
      return;
    }
    // 评论不存在或者已被删除
    const comment = await service.comment.findById(commentId);
    if (!comment) {
      ctx.body = { status: 'failed', msg: '该评论不存在或者已被删除' };
      return;
    }

    await service.reply.update(userId, replyId, content);

    ctx.body = { status: 'success' };
  }

  // 动作/删除回复
  async delete() {
    const { ctx, service } = this;
    const userId = ctx.user._id;
    const { topicId, replyId } = ctx.request.body;

    const reply = await service.reply.findById(replyId);
    // 回复不存在不能删除
    if (!reply) {
      ctx.body = { status: 'failed', msg: '该回复不存在或者已经被删除' };
      return;
    }

    await service.reply.del(userId, topicId, replyId);

    ctx.body = { status: 'success' };
  }

  // 动作/点赞
  async thumbUp() {
    const { ctx, service } = this;
    const userId = ctx.user._id;
    const { topicId, replyId } = ctx.request.body;

    const topic = await service.topic.findOne(topicId);
    // 主题不存在或者已被删除
    if (!topic) {
      ctx.body = { status: 'failed', msg: '该主题不存在或者已被删除' };
      return;
    }
    // 主题已经被锁定
    if (topic.lock) {
      ctx.body = { status: 'failed', msg: '该主题已经被锁定' };
      return;
    }

    const reply = await service.reply.findById(replyId);
    // 回复不存在或者已经被删除
    if (!reply) {
      ctx.body = { status: 'failed', msg: '该回复不存在或者已经被删除' };
      return;
    }
    // 不能给自己点赞
    if (reply.author.equals(userId)) {
      ctx.body = { status: 'failed', msg: '不能给自己点赞' };
      return;
    }

    await service.reply.thumbUp(userId, replyId);

    // 发送消息
    await service.message.sendMessage(userId, reply.author, {
      type: 'up',
      topicId,
      replyId,
    });

    ctx.body = { status: 'success' };
  }
}

module.exports = ReplyController;
