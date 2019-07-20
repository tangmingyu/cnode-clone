'use strict';

const Service = require('egg').Service;
const utils = require('../utils/utils');

class MessageService extends Service {
  // 未读消息数量
  unreadCount(userId) {
    const query = { receiver: userId, hasRead: false };
    return this.ctx.model.Message.countDocuments(query).exec();
  }

  // 查询消息
  async findByType(userId, type = 'comment', page = 1, limit = 30) {
    const skip = (page - 1) * limit;
    const query = { receiver: userId, type };

    const total = await this.ctx.model.Message.countDocuments(query).exec();
    if (total === 0) {
      return { total, data: [] };
    }
    const data = await this.ctx.model.Message.find(query)
      .sort('-createAt')
      .skip(skip)
      .limit(limit)
      .populate(
        'sender',
        'username email avatar url location signature weibo score topicCount collectCount participateCount'
      )
      .populate('topic', '_id, title')
      .populate('reply', '_id, content')
      .exec();

    return { total, data };
  }

  // 设置已读
  markOneReaded(userId, messageId) {
    return this.ctx.model.Message.updateOne(
      {
        _id: messageId,
        receiver: userId,
      },
      { $set: { hasRead: true } }
    ).exec();
  }

  // 全部已读
  markAllReaded(userId) {
    return this.ctx.model.Message.updateMany(
      {
        receiver: userId,
        hasRead: false,
      },
      { $set: { hasRead: true } }
    ).exec();
  }

  // 删除消息
  delete(userId, messageId) {
    return this.ctx.model.Message.deleteOne({
      _id: messageId,
      receiver: userId,
    }).exec();
  }

  // 创建评论/回复/点赞消息
  sendMessage(senderId, receiverId, { type, topicId, commentId, replyId }) {
    const message = new this.ctx.model.Message();

    message.sender = senderId; // from
    message.receiver = receiverId; // to

    message.type = type; // at, comment, reply, up
    message.topic = topicId;
    message.comment = commentId;
    message.reply = replyId;
    message.hasRead = false;

    return message.save();
  }

  // 创建At消息
  async sendAtMessage(userId, content, { topicId, commentId, replyId }) {
    const type = 'at';
    const receiverNames = utils.extractAtUsers(content);
    let receivers = await this.service.user.getUsersByNames(receiverNames);

    receivers = receivers.filter(user => {
      return !user._id.equals(userId); // 排除发送者
    });

    return Promise.all(
      receivers.map(receiver => {
        return this.sendMessage(userId, receiver, {
          type,
          topicId,
          commentId,
          replyId,
        });
      })
    );
  }

  // 替换内容中的@链接
  replaceAtLinks(content) {
    const users = utils.extractAtUsers(content);
    for (let i = 0; i < users.length; i++) {
      const name = users[i];
      content = content.replace(
        new RegExp('@' + name + '\\b(?!\\])', 'g'),
        '[@' + name + '](/user/' + name + ')'
      );
    }
    return content;
  }
}

module.exports = MessageService;
