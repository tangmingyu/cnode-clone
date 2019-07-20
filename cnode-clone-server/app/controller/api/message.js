'use strict';

const Controller = require('egg').Controller;

class MessageController extends Controller {
  // 消息列表
  async list() {
    const { ctx, service } = this;
    const userId = ctx.user._id;
    const type = ctx.params.type;
    const { page, limit } = ctx.query;

    if (!type || type.trim() === '') {
      ctx.body = { status: 'failed', msg: '参数不正确' };
      return;
    }

    const pagelist = await service.message.findByType(
      userId,
      type,
      page,
      limit
    );

    ctx.body = { status: 'success', data: pagelist };
  }

  // 新消息检查
  async check() {
    const { ctx, service } = this;
    const userId = ctx.user._id;

    const count = await service.message.unreadCount(userId);

    ctx.body = { status: 'success', data: { count } };
  }

  // 删除
  async delete() {
    const { ctx, service } = this;
    const userId = ctx.user._id;
    const messageId = ctx.request.body.messageId;

    if (!messageId || messageId.trim() === '') {
      ctx.body = { status: 'failed', msg: '参数不正确' };
      return;
    }

    await service.message.delete(userId, messageId);

    ctx.body = { status: 'success' };
  }

  // 标记为已读
  async markOneReaded() {
    const { ctx, service } = this;
    const userId = ctx.user._id;
    const messageId = ctx.request.body.messageId;

    if (!messageId || messageId.trim() === '') {
      ctx.body = { status: 'failed', msg: '参数不正确' };
      return;
    }

    await service.message.markOneReaded(userId, messageId);

    ctx.body = { status: 'success' };
  }

  // 标记全部已读
  async markAllReaded() {
    const { ctx, service } = this;
    const userId = ctx.user._id;

    const count = await service.message.unreadCount(userId);
    if (count === 0) {
      ctx.body = { status: 'failed', msg: '已经没有未读消息了' };
      return;
    }

    await service.message.markAllReaded(userId);

    ctx.body = { status: 'success' };
  }
}

module.exports = MessageController;
