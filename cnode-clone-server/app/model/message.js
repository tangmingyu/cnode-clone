'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const { ObjectId } = Schema.Types;

  const MessageSchema = new Schema({
    type: { type: String }, // 类型comment,reply,at,up
    sender: { type: ObjectId, ref: 'User' }, // 发送人id
    receiver: { type: ObjectId, ref: 'User' }, // 接收人id
    topic: { type: ObjectId, ref: 'Topic' }, // 主题id
    comment: { type: ObjectId, ref: 'Comment' }, // 评论id，可能为null
    reply: { type: ObjectId, ref: 'Reply' }, // 回复id，可能为null
    hasRead: { type: Boolean, default: false },
    createAt: { type: Date, default: Date.now },
  });

  MessageSchema.index({ receiver: 1, hasRead: -1, createAt: -1 });

  return mongoose.model('Message', MessageSchema);
};
