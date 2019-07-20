'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const { ObjectId } = Schema.Types;

  const CollectSchema = new Schema({
    user: { type: ObjectId, ref: 'User' }, // 用户id
    topic: { type: ObjectId, ref: 'Topic' }, // 主题id
    createAt: { type: Date, default: Date.now }, // 创建时间
  });

  CollectSchema.index({ user: 1, topic: 1 }, { unique: true });
  CollectSchema.index({ user: 1, createAt: -1 });

  return mongoose.model('Collect', CollectSchema);
};
