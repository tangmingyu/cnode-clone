'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const { ObjectId } = Schema.Types;

  const ParticipateSchema = new Schema({
    user: { type: ObjectId, ref: 'User' }, // 用户id
    topic: { type: ObjectId, ref: 'Topic' }, // 主题id
    count: { type: Number, default: 0 },

    incrementAt: { type: Date, default: Date.now }, // count增加时间
    createAt: { type: Date, default: Date.now }, // 创建时间
  });

  ParticipateSchema.index({ user: 1, topic: 1 }, { unique: true });
  ParticipateSchema.index({ topic: 1, incrementAt: -1 });
  ParticipateSchema.index({ user: 1, incrementAt: -1 });

  return mongoose.model('Participate', ParticipateSchema);
};
