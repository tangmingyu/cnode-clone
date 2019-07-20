'use strict';

const { Controller } = require('egg');

class CollectController extends Controller {
  // 动作/加入收藏
  async addCollect() {
    const { ctx, service } = this;
    const userId = ctx.user._id;
    const topicId = ctx.request.body.topicId;

    // topic是否存在
    const exist = await service.topic.findOne(topicId);
    if (!exist) {
      ctx.body = { status: 'failed', msg: '该主题不存在或者已经被删除' };
      return;
    }

    // 是否已经收藏
    const collected = await service.collect.findOne(userId, topicId);
    if (collected) {
      ctx.body = { status: 'failed', msg: '该主题已经被收藏，添加收藏失败' };
      return;
    }
    // 添加收藏
    await service.collect.add(userId, topicId);

    ctx.body = { status: 'success' };
  }

  // 动作/取消收藏
  async delCollect() {
    const { ctx, service } = this;
    const userId = ctx.user._id;
    const topicId = ctx.request.body.topicId;

    // 是否已经收藏
    const collected = await service.collect.findOne(userId, topicId);
    if (!collected) {
      ctx.body = { status: 'failed', msg: '该主题没有被收藏，取消收藏失败' };
      return;
    }

    // 取消收藏
    await service.collect.del(userId, topicId);

    ctx.body = { status: 'success' };
  }
}

module.exports = CollectController;
