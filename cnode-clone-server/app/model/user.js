'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const UserSchema = new Schema({
    name: { type: String },
    username: { type: String },
    email: { type: String },
    avatar: { type: String },
    url: { type: String },
    location: { type: String },
    signature: { type: String },
    weibo: { type: String },

    pass: { type: String },
    salt: { type: String }, // 用于给pass和githubAccessToken加盐

    score: { type: Number, default: 0 },
    topicCount: { type: Number, default: 0 }, // 发表的主题数
    collectCount: { type: Number, default: 0 }, // 添加的收藏数
    participateCount: { type: Number, default: 0 }, // participateCount 参与数量

    isBlock: { type: Boolean, default: false },
    isStar: { type: Boolean, default: false },
    active: { type: Boolean, default: false },

    retrieveTime: { type: Number }, // 验证码生成时间
    retrieveKey: { type: String }, // 验证码

    accessToken: { type: String }, // 访问码

    createAt: { type: Date, default: Date.now },
    updateAt: { type: Date, default: Date.now },
  });

  UserSchema.index({ username: 1 }, { unique: true });
  UserSchema.index({ email: 1 }, { unique: true });
  UserSchema.index({ accessToken: 1 });
  UserSchema.index({ score: -1 });

  return mongoose.model('User', UserSchema);
};
