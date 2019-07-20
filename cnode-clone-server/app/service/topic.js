'use strict';

const { Service } = require('egg');

class TopicService extends Service {
  // 单条查询
  findOne(topicId) {
    const query = { _id: topicId, deleted: false };
    const select =
      'author tab title content participateCount visitCount collectCount good top lock lastParticipate';
    return this.ctx.model.Topic.findOne(query, select)
      .populate(
        'author',
        'username email avatar url location signature weibo score topicCount collectCount participateCount'
      )
      .exec();
  }

  // 根据tab查询主题
  async findTopicsByTab(tab, page = 1, limit = 30) {
    const skip = (page - 1) * limit;
    const query = { deleted: false };
    if (tab !== 'all' && tab !== 'good') query.tab = tab;
    if (tab === 'good') query.good = true;

    const total = await this.ctx.model.Topic.countDocuments(query).exec();
    if (total === 0) {
      return { total, data: [] };
    }
    const select =
      'author tab title participateCount visitCount good top lock lastParticipate';
    const data = await this.ctx.model.Topic.find(query, select)
      .sort('-createAt')
      .skip(skip)
      .limit(limit)
      .populate(
        'author',
        'username email avatar url location signature weibo score topicCount collectCount participateCount'
      )
      .exec();

    await this._populateLastParticipate(data);

    return { total, data };
  }

  // 用户创建的主题
  async findUserTopics(userId, page = 1, limit = 30) {
    const skip = (page - 1) * limit;
    const query = { author: userId, deleted: false };
    const total = await this.ctx.model.Topic.countDocuments(query).exec();
    if (total === 0) {
      return { total, data: [] };
    }
    const select =
      'author tab title participateCount visitCount good top lock lastParticipate';
    const data = await this.ctx.model.Topic.find(query, select)
      .sort('-createAt')
      .skip(skip)
      .limit(limit)
      .populate(
        'author',
        'username email avatar url location signature weibo score topicCount collectCount participateCount'
      )
      .exec();

    await this._populateLastParticipate(data);

    return { total, data };
  }

  // 用户参与的主题
  async findParticipateTopics(userId, page = 1, limit = 30) {
    const skip = (page - 1) * limit;
    const query = { user: userId };
    const total = await this.ctx.model.Participate.countDocuments(query).exec();
    if (total === 0) {
      return { total, data: [] };
    }
    const recordList = await this.ctx.model.Participate.find(query)
      .sort('-incrementAt')
      .skip(skip)
      .limit(limit)
      .exec();

    const topicIds = recordList.map(item => item.topic);
    const select =
      'author tab title participateCount visitCount good top lock lastParticipate';
    const data = await this.ctx.model.Topic.find(
      { _id: { $in: topicIds } },
      select
    )
      .sort('-createAt')
      .populate(
        'author',
        'username email avatar url location signature weibo score topicCount collectCount participateCount'
      )
      .exec();

    await this._populateLastParticipate(data);

    return { total, data };
  }

  // 用户收藏的主题
  async findCollectTopics(userId, page = 1, limit = 30) {
    const skip = (page - 1) * limit;
    const query = { user: userId };
    const total = await this.ctx.model.Collect.countDocuments(query).exec();
    if (total === 0) {
      return { total, data: [] };
    }
    const recordList = await this.ctx.model.Collect.find(query)
      .sort('-createAt')
      .skip(skip)
      .limit(limit)
      .exec();
    const topicIds = recordList.map(item => item.topic);
    const select =
      'author tab title participateCount visitCount good top lock lastParticipate';
    const data = await this.ctx.model.Topic.find(
      { _id: { $in: topicIds } },
      select
    )
      .sort('-createAt')
      .populate(
        'author',
        'username email avatar url location signature weibo score topicCount collectCount participateCount'
      )
      .exec();

    await this._populateLastParticipate(data);

    return { total, data };
  }

  // 创建 增加用户scroe topic_count
  async add(userId, tab, title, content) {
    const ctx = this.ctx;

    const topic = new ctx.model.Topic();
    topic.author = userId;
    topic.tab = tab;
    topic.title = title.trim();
    topic.content = content.trim();

    // 增加记分和topicCount
    await ctx.model.User.updateOne(
      { _id: userId },
      { $inc: { score: 5, topicCount: 1 } }
    );

    return topic.save();
  }

  // 更新
  async update(userId, topicId, tab, title, content) {
    const ctx = this.ctx;

    const update = {
      tab,
      title: title.trim(),
      content: content.trim(),
    };

    return ctx.model.Topic.updateOne(
      {
        _id: topicId,
        author: userId,
      },
      { $set: update }
    ).exec();
  }

  // 删除 减少用户记分 topic_count
  async del(userId, topicId) {
    const ctx = this.ctx;

    // 减少记分和topicCount
    await ctx.model.User.updateOne(
      { _id: userId },
      { $inc: { score: -5, topicCount: -1 } }
    ).exec();

    return ctx.model.Topic.updateOne(
      {
        _id: topicId,
        author: userId,
      },
      { $set: { deleted: true } }
    ).exec();
  }

  // 增加访问数
  async incVisitCount(topicId) {
    const ctx = this.ctx;

    return ctx.model.Topic.updateOne(
      {
        _id: topicId,
      },
      { $inc: { visitCount: 1 } }
    ).exec();
  }

  // 锁定
  lock(topicId, lock) {
    const ctx = this.ctx;

    return ctx.model.Topic.updateOne(
      {
        _id: topicId,
      },
      { $set: { lock } }
    ).exec();
  }

  // 置顶
  top(topicId, top) {
    const ctx = this.ctx;

    return ctx.model.Topic.updateOne(
      {
        _id: topicId,
      },
      { $set: { top } }
    ).exec();
  }

  // 加精
  good(topicId, good) {
    const ctx = this.ctx;

    return ctx.model.Topic.updateOne(
      {
        _id: topicId,
      },
      { $set: { good } }
    ).exec();
  }

  async _populateLastParticipate(topics) {
    const idlist = topics.map(topic => topic.lastParticipate);
    const recordList = await this.ctx.model.Participate.find(
      {
        _id: { $in: idlist },
      },
      'user incrementAt'
    )
      .populate(
        'user',
        'username email avatar url location signature weibo score topicCount collectCount participateCount'
      )
      .exec();

    recordList.forEach(p => {
      topics.forEach(topic => {
        if (p._id.equals(topic.lastParticipate)) {
          topic.lastParticipate = p;
        }
      });
    });
  }
}

module.exports = TopicService;
