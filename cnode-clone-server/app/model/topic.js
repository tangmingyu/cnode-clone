'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const { ObjectId } = Schema.Types;

  const TopicSchema = new Schema({
    author: { type: ObjectId, ref: 'User' },
    tab: { type: String },
    title: { type: String },
    content: { type: String },

    visitCount: { type: Number, default: 0 },
    collectCount: { type: Number, default: 0 },
    participateCount: { type: Number, default: 0 }, // participateCount 参与数量
    lastParticipate: { type: ObjectId, ref: 'Participate' }, // 最后参与讨论的人及时间

    good: { type: Boolean, default: false },
    top: { type: Boolean, default: false },
    lock: { type: Boolean, default: false },

    createAt: { type: Date, default: Date.now },
    updateAt: { type: Date, default: Date.now },
    deleted: { type: Boolean, default: false },
  });

  TopicSchema.index({ createAt: -1 });
  TopicSchema.index({ tab: 1, createAt: -1 });
  TopicSchema.index({ author: 1, createAt: -1 });
  TopicSchema.index({ top: -1, updateAt: -1 });

  return mongoose.model('Topic', TopicSchema);
};
