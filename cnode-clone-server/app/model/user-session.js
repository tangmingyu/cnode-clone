'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const ObjectId = mongoose.Types.ObjectId;

  const UserSessionSchema = new Schema({
    userSessionId: { type: String },
    user: { type: ObjectId, ref: 'User' },
    createAt: { type: Date, default: Date.now },
  });

  UserSessionSchema.index({ userSessionId: 1 });

  return mongoose.model('UserSession', UserSessionSchema);
};
