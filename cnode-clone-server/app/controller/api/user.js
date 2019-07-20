'use strict';

const Controller = require('egg').Controller;
const utils = require('../../utils/utils');

class UserController extends Controller {
  // 查询用户信息
  async profile() {
    const { ctx, service } = this;
    const username = ctx.params.username;

    if (!username || username.trim() === '') {
      ctx.body = { status: 'failed', msg: '用户名不能为空' };
      return;
    }
    const user = await service.user.findByUsername(username);
    if (!user) {
      ctx.body = { status: 'failed', msg: '该用户不存在' };
      return;
    }

    const userinfo = {
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      url: user.url,
      location: user.location,
      signature: user.signature,
      weibo: user.weibo,
      score: user.score,
      topicCount: user.topicCount,
      collectCount: user.collectCount,
      participateCount: user.participateCount,
      accessToken: user.accessToken,
    };

    ctx.body = { status: 'success', data: userinfo };
  }

  // 用户发布的贴子
  async topics() {
    const { ctx, service } = this;
    const username = ctx.params.username;
    const { page, limit } = ctx.query;

    if (!username || username.trim() === '') {
      ctx.body = { status: 'failed', msg: '用户名不能为空' };
      return;
    }
    const user = await service.user.findByUsername(username);
    if (!user) {
      ctx.body = { status: 'failed', msg: '该用户不存在' };
      return;
    }

    const pagelist = await service.topic.findUserTopics(user._id, page, limit);
    ctx.body = { status: 'success', data: pagelist };
  }

  // 用户参与的贴子
  async participates() {
    const { ctx, service } = this;
    const username = ctx.params.username;
    const { page, limit } = ctx.query;

    if (!username || username.trim() === '') {
      ctx.body = { status: 'failed', msg: '用户名不能为空' };
      return;
    }
    const user = await service.user.findByUsername(username);
    if (!user) {
      ctx.body = { status: 'failed', msg: '该用户不存在' };
      return;
    }

    const pagelist = await service.topic.findParticipateTopics(
      user._id,
      page,
      limit
    );
    ctx.body = { status: 'success', data: pagelist };
  }

  // 用户收藏的贴子
  async collects() {
    const { ctx, service } = this;
    const username = ctx.params.username;
    const { page, limit } = ctx.query;

    if (!username || username.trim() === '') {
      ctx.body = { status: 'failed', msg: '用户名不能为空' };
      return;
    }
    const user = await service.user.findByUsername(username);
    if (!user) {
      ctx.body = { status: 'failed', msg: '该用户不存在' };
      return;
    }

    const pagelist = await service.topic.findCollectTopics(
      user._id,
      page,
      limit
    );
    ctx.body = { status: 'success', data: pagelist };
  }

  // 更新用户信息
  async updateProfile() {
    const { ctx, service } = this;
    const userId = ctx.user._id;
    const { url, location, weibo, signature } = ctx.request.body;

    await service.user.updateProfile(userId, {
      url,
      location,
      weibo,
      signature,
    });

    ctx.body = { status: 'success' };
  }

  // 更新密码
  async changePass() {
    const { ctx, service } = this;
    const userId = ctx.user._id;
    const { old_password, new_password } = ctx.request.body;

    if (!old_password || old_password.trim() === '') {
      ctx.body = { status: 'failed', msg: '密码不能为空' };
      return;
    }
    if (!new_password || new_password.trim() === '') {
      ctx.body = { status: 'failed', msg: '密码不能为空' };
      return;
    }
    // 验证就密码
    const user = await service.user.findById(userId);
    const { pass, salt } = user;
    if (!utils.comparePass(old_password, salt, pass)) {
      ctx.body = { status: 'failed', msg: '当前密码不正确。' };
      return;
    }

    await service.user.updatePass(userId, new_password);

    ctx.body = { status: 'success' };
  }

  // 刷新token
  async refreshToken() {
    const { ctx, service } = this;
    const userId = ctx.user._id;

    const tokenInfo = await service.user.refreshToken(userId);

    ctx.body = { status: 'success', data: tokenInfo };
  }
}

module.exports = UserController;
