'use strict';

const Service = require('egg').Service;

class ParticipateService extends Service {
  // 创建参与记录/增加参与数量，同时增加用户和主题的ParticipateCount
  async increment(userId, topicId) {
    const ctx = this.ctx;
    let part = await ctx.model.Participate.findOne({
      user: userId,
      topic: topicId,
    }).exec();

    if (!part) {
      part = new ctx.model.Participate();
      part.count = 0;
    }
    part.user = userId;
    part.topic = topicId;
    part.incrementAt = Date.now();
    part.count = part.count + 1;

    await part.save();

    await Promise.all([
      // 增加主题participateCount
      ctx.model.Topic.updateOne(
        { _id: topicId },
        { $inc: { participateCount: 1 }, $set: { lastParticipate: part._id } }
      ).exec(),
      // 增加用户participateCount/score
      ctx.model.User.updateOne(
        { _id: userId },
        { $inc: { participateCount: 1, score: 5 } }
      ).exec(),
    ]);
  }

  // 删除参与记录/减少参与数量，同时减少用户和主题的ParticipateCount
  async decrement(userId, topicId) {
    const ctx = this.ctx;
    const part = await ctx.model.Participate.findOne({
      user: userId,
      topic: topicId,
    }).exec();
    if (!part) {
      return;
    }
    part.count = part.count - 1;

    // count为0删除记录
    if (part.count === 0) {
      await ctx.model.Participate.deleteOne({
        user: userId,
        topic: topicId,
      }).exec();
    }
    if (part.count > 0) {
      await part.save();
    }

    // 查询lastParticipate
    const lastParticipate = await ctx.model.Participate.findOne({
      topic: topicId,
    })
      .sort('-incrementAt')
      .exec();

    await Promise.all([
      // 减少主题participateCount
      ctx.model.Topic.updateOne(
        {
          _id: topicId,
        },
        {
          $inc: { participateCount: -1 },
          $set: { lastParticipate },
        }
      ).exec(),
      // 减少用户participateCount/score
      ctx.model.User.updateOne(
        { _id: userId },
        { $inc: { participateCount: -1, score: -5 } }
      ).exec(),
    ]);
  }
}

module.exports = ParticipateService;
