'use strict';

const { Controller } = require('egg');

class TopicController extends Controller {
  // 根据tab查询主题
  async list() {
    const { ctx, service } = this;
    const { tab, page, limit } = ctx.query;

    const pagelist = await service.topic.findTopicsByTab(tab, page, limit);

    ctx.body = { status: 'success', data: pagelist };
  }

  // 查询主题信息
  async info() {
    const { ctx, service } = this;
    const topicId = ctx.params.topicId;

    const topic = await service.topic.findOne(topicId);
    if (!topic) {
      ctx.body = { status: 'failed', msg: '该主题不存在或者已经删除' };
      return;
    }
    // 增加访问数
    await service.topic.incVisitCount(topicId);

    ctx.body = { status: 'success', data: topic };
  }

  // 动作/主题发布
  async create() {
    const { ctx, service } = this;
    const userId = ctx.user._id;
    const { tab, title, content } = ctx.request.body;
    const allTab = this.config.tabs.map(tab => tab[0]);

    // 信息校验
    if (!title || title.trim() === '') {
      ctx.body = { status: 'failed', msg: '标题不能为空' };
      return;
    }
    if (title.length < 5 || title.length > 85) {
      ctx.body = { status: 'failed', msg: '标题不能太长或太短' };
      return;
    }
    if (!tab || allTab.indexOf(tab) < 0) {
      ctx.body = { status: 'failed', msg: '必须选择一个板块' };
      return;
    }
    if (!content || content.trim() === '') {
      ctx.body = { status: 'failed', msg: '内容不能为空' };
      return;
    }

    const topic = await service.topic.add(userId, tab, title, content);

    // 发送信息
    await service.message.sendAtMessage(userId, content, {
      topicId: topic._id,
    });

    ctx.body = { status: 'success', data: { topicId: topic._id } };
  }

  // 动作/主题编辑
  async update() {
    const { ctx, service } = this;
    const userId = ctx.user._id;
    const { topicId, tab, title, content } = ctx.request.body;
    const allTab = this.config.tabs.map(tab => tab[0]);

    // 信息校验
    if (!title || title.trim() === '') {
      ctx.body = { status: 'failed', msg: '标题不能为空' };
      return;
    }
    if (title.length < 5 || title.length > 85) {
      ctx.body = { status: 'failed', msg: '标题不能太长或太短' };
      return;
    }
    if (!tab || allTab.indexOf(tab) < 0) {
      ctx.body = { status: 'failed', msg: '必须选择一个板块' };
      return;
    }
    if (!content || content.trim() === '') {
      ctx.body = { status: 'failed', msg: '内容不能为空' };
      return;
    }

    const topic = await service.topic.findOne(topicId);
    if (!topic) {
      ctx.body = { status: 'failed', msg: '该主题不存在或者已经删除' };
      return;
    }
    if (topic.lock) {
      ctx.body = { status: 'failed', msg: '该主题已经被锁定，无法编辑' };
      return;
    }

    await service.topic.update(userId, topicId, tab, title, content);

    ctx.body = { status: 'success' };
  }

  // 动作/主题删除
  async delete() {
    const { ctx, service } = this;
    const userId = ctx.user._id;
    const topicId = ctx.request.body.topicId;

    const topic = await service.topic.findOne(topicId);
    if (!topic) {
      ctx.body = { status: 'failed', msg: '该主题不存在或者已经删除' };
      return;
    }

    await service.topic.del(userId, topicId);

    ctx.body = { status: 'success' };
  }
}

module.exports = TopicController;
