'use strict';

const Controller = require('egg').Controller;

class TopicController extends Controller {
  // 动作/主题锁定
  async lock() {
    const { ctx, service } = this;
    const { topicId, lock } = ctx.request.body;

    const topic = await service.topic.findOne(topicId);
    if (!topic) {
      ctx.body = { status: 'failed', msg: '该主题不存在或者已经删除' };
      return;
    }

    await service.topic.lock(topicId, lock);

    ctx.body = { status: 'success' };
  }

  // 动作/主题置顶
  async top() {
    const { ctx, service } = this;
    const { topicId, top } = ctx.request.body;

    const topic = await service.topic.findOne(topicId);
    if (!topic) {
      ctx.body = { status: 'failed', msg: '该主题不存在或者已经删除' };
      return;
    }

    await service.topic.top(topicId, top);

    ctx.body = { status: 'success' };
  }

  // 动作/主题加精
  async good() {
    const { ctx, service } = this;
    const { topicId, good } = ctx.request.body;

    const topic = await service.topic.findOne(topicId);
    if (!topic) {
      ctx.body = { status: 'failed', msg: '该主题不存在或者已经删除' };
      return;
    }

    await service.topic.good(topicId, good);

    ctx.body = { status: 'success' };
  }
}

module.exports = TopicController;
