'use strict';

const Service = require('egg').Service;
const utils = require('../utils/utils');

class UserService extends Service {
  // 根据accessToken查询
  findByAccessToken(accessToken) {
    return this.ctx.model.User.findOne({ accessToken, active: true }).exec();
  }

  // 根据username查询
  findByUsername(username) {
    return this.ctx.model.User.findOne({ username }).exec();
  }

  // 根据email查询
  findByEmail(email) {
    return this.ctx.model.User.findOne({ email }).exec();
  }

  // 根据查询
  findById(userId) {
    return this.ctx.model.User.findOne({ _id: userId }).exec();
  }

  // 通过用户名查询多用户
  getUsersByNames(names) {
    if (names.length === 0) {
      return [];
    }
    const select =
      'username email avatar url location signature weibo score topicCount collectCount participateCount';
    return this.ctx.model.User.find(
      { username: { $in: names } },
      select
    ).exec();
  }

  async userExists(username, email) {
    const users = await this.ctx.model.User.find({
      $or: [{ username }, { email }],
    }).exec();
    return users.length > 0;
  }

  // 设置
  updateProfile(userId, profile) {
    return this.ctx.model.User.updateOne(
      { _id: userId },
      {
        $set: {
          url: profile.url,
          location: profile.location,
          weibo: profile.weibo,
          signature: profile.signature,
        },
      }
    );
  }

  // 更新密码
  updatePass(userId, newPass) {
    const [ pass, salt ] = utils.cryptPass(newPass);
    return this.ctx.model.User.updateOne(
      { _id: userId },
      { $set: { pass, salt, retrieveKey: null, retrieveTime: null } }
    ).exec();
  }

  // 刷新accessToken
  async refreshToken(userId) {
    const accessToken = utils.accessToken();

    await this.ctx.model.User.updateOne(
      { _id: userId },
      { $set: { accessToken } }
    ).exec();

    return { accessToken };
  }

  // 设置验证码
  async setRetrieveKey(userId) {
    const retrieveKey = utils.retrieveKey();
    const retrieveTime = Date.now();

    await this.ctx.model.User.updateOne(
      { _id: userId },
      { $set: { retrieveKey, retrieveTime } }
    ).exec();

    return { retrieveKey };
  }

  // 本地注册的用户
  async internalCreate(username, pass, email, active = false) {
    const user = new this.ctx.model.User();
    user.name = username;
    user.username = username;
    user.email = email;
    user.active = active;

    const [ hashPass, salt ] = utils.cryptPass(pass);
    user.pass = hashPass;
    user.salt = salt;
    user.accessToken = utils.accessToken();

    const retrieveKey = utils.retrieveKey();
    const retrieveTime = Date.now();
    user.retrieveKey = retrieveKey;
    user.retrieveTime = retrieveTime;

    return user.save();
  }

  // 激活用户
  activeUser(userId) {
    return this.ctx.model.User.updateOne(
      { _id: userId },
      { $set: { active: true, retrieveKey: null, retrieveTime: null } }
    ).exec();
  }

  // 用户验证
  async checkIn(username, password) {
    const user = await this.ctx.model.User.findOne({
      username,
      active: true,
    }).exec();

    if (!user) {
      return;
    }
    const { pass: hashPass, salt } = user;
    if (!utils.comparePass(password, salt, hashPass)) {
      return;
    }
    return user;
  }
  // async externalCheckIn({ provider, username, email, avatar }) {
  //   const ctx = this.ctx;
  //   // 通过username查询绑定信息
  //   const userMap = await ctx.model.UserMapper.findOne({
  //     provider,
  //     username,
  //   }).exec();
  //   // 已经进行过绑定，则返回用户信息
  //   if (userMap) {
  //     return ctx.model.User.findById(userMap.user).exec();
  //   }

  //   const user = await ctx.model.findOne({ email }).exec();
  //   // email未注册，新建用户并绑定
  //   if (!user) {
  //     const newUser = new ctx.model.User();
  //     newUser.name = username;
  //     newUser.username = username;
  //     newUser.email = email;
  //     newUser.avatar = avatar;
  //     await newUser.save();

  //     const newUserMap = new ctx.model.UserMapper();
  //     newUserMap.user = newUser._id;
  //     newUserMap.provider = provider;
  //     newUserMap.username = username;
  //     await newUserMap.save();

  //     return user;
  //     // email已注册，则直接进行绑定
  //   } else if (user.active) {
  //     const newUserMap = new ctx.model.UserMapper();
  //     newUserMap.user = user._id;
  //     newUserMap.provider = provider;
  //     newUserMap.username = username;
  //     await newUserMap.save();

  //     return user;
  //   }
  // }

  // 禁言
  block(userId, isBlock) {
    return this.ctx.model.User.updateOne(
      { _id: userId },
      { $set: { isBlock } }
    ).exec();
  }

  // 达人
  star(userId, isStar) {
    return this.ctx.model.User.updateOne(
      { _id: userId },
      { $set: { isStar } }
    ).exec();
  }
}

module.exports = UserService;
