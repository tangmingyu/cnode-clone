'use strict';

const { Service } = require('egg');

class CollectService extends Service {
  // 根据user_id和topic_id查询
  findOne(userId, topicId) {
    return this.ctx.model.Collect.findOne({
      user: userId,
      topic: topicId,
    }).exec();
  }

  // 创建，并增加用户和主题的collectCount
  async add(userId, topicId) {
    const ctx = this.ctx;
    const collect = new ctx.model.Collect();

    collect.user = userId;
    collect.topic = topicId;
    await Promise.all([
      // 增加用户收藏数
      ctx.model.User.updateOne(
        { _id: userId },
        { $inc: { collectCount: 1 } }
      ).exec(),
      // 增加主题收藏数
      ctx.model.Topic.updateOne(
        { _id: topicId },
        { $inc: { collectCount: 1 } }
      ).exec(),
    ]);

    return collect.save();
  }

  // 删除，并减少用户和主题的collectCount
  async del(userId, topicId) {
    const ctx = this.ctx;

    await Promise.all([
      // 减少用户收藏数
      ctx.model.User.updateOne(
        { _id: userId },
        { $inc: { collectCount: -1 } }
      ).exec(),
      // 减少主题收藏数
      ctx.model.Topic.updateOne(
        { _id: topicId },
        { $inc: { collectCount: -1 } }
      ).exec(),
    ]);

    // 删除收藏记录
    return this.ctx.model.Collect.deleteOne({
      user: userId,
      topic: topicId,
    }).exec();
  }
}

module.exports = CollectService;
