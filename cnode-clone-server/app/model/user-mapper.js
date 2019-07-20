'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const ObjectId = mongoose.Types.ObjectId;

  const UserMapper = new Schema({
    user: { type: ObjectId, ref: 'User' },
    provider: { type: String },
    username: { type: String },
  });

  UserMapper.index({ provider: 1, username: 1 }, { unique: true });

  return mongoose.model('UserMapper', UserMapper);
};
