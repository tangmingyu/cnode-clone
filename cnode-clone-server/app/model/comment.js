'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const { ObjectId } = Schema.Types;

  const CommentSchema = new Schema({
    topic: { type: ObjectId, ref: 'Topic' }, // 所在的主题
    author: { type: ObjectId, ref: 'User' }, // 回复人
    content: { type: String }, // 回复的内容
    thumbUps: [ ObjectId ], // 点赞人userId
    createAt: { type: Date, default: Date.now },
    updateAt: { type: Date, default: Date.now },
    deleted: { type: Boolean, default: false },
  });

  CommentSchema.index({ author: 1, createAt: -1 });
  CommentSchema.index({ topic: 1, createAt: -1 });

  return mongoose.model('Comment', CommentSchema);
};
