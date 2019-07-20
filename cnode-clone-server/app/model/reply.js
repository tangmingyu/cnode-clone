'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const { ObjectId } = Schema.Types;

  const ReplySchema = new Schema({
    topic: { type: ObjectId, ref: 'Topic' }, // 所在topic
    comment: { type: ObjectId, ref: 'Comment' }, // 所在comment
    reply: { type: ObjectId, ref: 'Reply' }, // 二级回复对应的reply
    author: { type: ObjectId, ref: 'User' }, // 回复人
    content: { type: String }, // 回复的内容
    thumbUps: [ ObjectId ], // 点赞人userId
    createAt: { type: Date, default: Date.now },
    updateAt: { type: Date, default: Date.now },
    deleted: { type: Boolean, default: false },
  });

  ReplySchema.index({ author: 1, createAt: -1 });
  ReplySchema.index({ comment: 1, createAt: -1 });

  return mongoose.model('Reply', ReplySchema);
};
