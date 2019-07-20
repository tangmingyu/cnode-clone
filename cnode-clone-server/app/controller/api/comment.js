'use strict';

const Controller = require('egg').Controller;

class CommentController extends Controller {
  // 查询评论列表
  async list() {
    const { ctx, service } = this;
    const topicId = ctx.params.topicId;
    const { page, limit } = ctx.query;

    const topic = await service.topic.findOne(topicId);
    if (!topic) {
      ctx.body = { status: 'failed', msg: '该主题不存在或者已经删除' };
      return;
    }

    const pagelist = await service.comment.findCommentsByTopicId(
      topicId,
      page,
      limit
    );

    ctx.body = { status: 'success', data: pagelist };
  }

  // 动作/发布回复
  async create() {
    const { ctx, service } = this;
    const userId = ctx.user._id;
    const { topicId, content, replyId } = ctx.request.body;

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

    const comment = await service.comment.add(
      userId,
      topicId,
      content,
      replyId
    );

    // 发送消息
    const commentId = comment._id;
    await Promise.all([
      service.message.sendMessage(userId, topic.author, {
        type: 'comment',
        topicId,
        commentId,
      }),
      service.message.sendAtMessage(userId, content, {
        topicId: topic._id,
        commentId,
      }),
    ]);

    ctx.body = { status: 'success', data: { commentId: comment._id } };
  }

  // 动作/更新回复
  async update() {
    const { ctx, service } = this;
    const userId = ctx.user._id;
    const { topicId, commentId, content } = ctx.request.body;

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

    await service.comment.update(userId, commentId, content);

    ctx.body = { status: 'success' };
  }

  // 动作/删除回复
  async delete() {
    const { ctx, service } = this;
    const userId = ctx.user._id;
    const { topicId, commentId } = ctx.request.body;

    const comment = await service.comment.findById(commentId);
    // 评论不存在或者已经被删除
    if (!comment) {
      ctx.body = { status: 'failed', msg: '评论不存在或者已经被删除' };
      return;
    }

    await service.comment.del(userId, topicId, commentId);

    ctx.body = { status: 'success' };
  }

  // 动作/点赞
  async thumbUp() {
    const { ctx, service } = this;
    const userId = ctx.user._id;
    const { topicId, commentId } = ctx.request.body;

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

    const comment = await service.comment.findById(commentId);
    // 评论不存在或者已经被删除
    if (!comment) {
      ctx.body = { status: 'failed', msg: '评论不存在或者已经被删除' };
      return;
    }
    // 不能给自己点赞
    if (comment.author.equals(userId)) {
      ctx.body = { status: 'failed', msg: '不能给自己点赞' };
      return;
    }

    await service.comment.thumbUp(userId, commentId);

    // 发送消息
    await service.message.sendMessage(userId, comment.author, {
      type: 'up',
      topicId,
      commentId,
    });

    ctx.body = { status: 'success' };
  }
}

module.exports = CommentController;
