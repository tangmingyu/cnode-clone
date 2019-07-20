'use strict';

const Controller = require('egg').Controller;

class SignController extends Controller {
  // 查询登录信息
  async signInfo() {
    const { ctx, service } = this;
    const userId = ctx.user._id;
    const user = await service.user.findById(userId);

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

  // 登录
  async signIn() {
    const { ctx, service } = this;
    const { username, password } = ctx.request.body;
    if (!username || username.trim() === '') {
      ctx.body = { status: 'failed', msg: '密码/用户名不能为空' };
      return;
    }
    if (!password || password.trim() === '') {
      ctx.body = { status: 'failed', msg: '密码/用户名不能为空' };
      return;
    }

    const user = await service.user.checkIn(username, password);

    if (!user) {
      ctx.body = { status: 'failed', msg: '用户名或密码错误。' };
      return;
    }

    const user_session_id = await ctx.service.userSession.setUser(user);

    ctx.session.user_session_id = user_session_id;

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

    ctx.rotateCsrfSecret();
    ctx.body = { status: 'success', data: userinfo };
  }

  // 登出
  signOut() {
    this.ctx.session = null;
    this.ctx.body = { status: 'success' };
    // this.ctx.redirect('/');
  }

  // 注册
  async signUp() {
    const { ctx, service } = this;
    const { username, password, email } = ctx.request.body;
    if (!username || username.trim() === '') {
      ctx.body = { status: 'failed', msg: '密码/用户名/邮箱不能为空' };
      return;
    }
    if (!password || password.trim() === '') {
      ctx.body = { status: 'failed', msg: '密码/用户名/邮箱不能为空' };
      return;
    }
    if (!email || email.trim() === '') {
      ctx.body = { status: 'failed', msg: '密码/用户名/邮箱不能为空' };
      return;
    }
    // 用户存在
    const exist = await service.user.userExists(username, email);
    if (exist) {
      ctx.body = { status: 'failed', msg: '用户名或邮箱已被使用。' };
      return;
    }

    const { retrieveKey } = await service.user.internalCreate(
      username,
      password,
      email
    );

    // 发送激活邮件
    await service.mail.sendActiveMail(email, retrieveKey, username);

    ctx.body = { status: 'success' };
  }

  async active() {
    const { ctx, service } = this;
    const { name, key } = ctx.request.body;
    // 验证用户及key
    const user = await service.user.findByUsername(name);
    if (!user) {
      ctx.body = { status: 'failed', msg: '错误的激活链接!' };
      return;
    }
    if (key !== user.retrieveKey) {
      ctx.body = { status: 'failed', msg: '错误的激活链接!' };
      return;
    }
    if (Date.now() - user.retrieveTime > 24 * 60 * 60 * 1000) {
      ctx.body = { status: 'failed', msg: '验证码已过期!' };
      return;
    }

    await service.user.activeUser(user._id);

    ctx.body = { status: 'success' };
  }

  // 重置密码-step1
  async resetPassRequest() {
    const { ctx, service } = this;
    const { username, email } = ctx.request.body;

    if (!username || username.trim() === '') {
      ctx.body = { status: 'failed', msg: '用户名/邮箱不能为空' };
      return;
    }
    if (!email || email.trim() === '') {
      ctx.body = { status: 'failed', msg: '用户名/邮箱不能为空' };
      return;
    }
    // 验证邮箱
    const user = await service.user.findByEmail(email);
    if (!user) {
      ctx.body = { status: 'failed', msg: '用户名或邮箱不正确！' };
      return;
    }
    if (user.username !== username) {
      ctx.body = { status: 'failed', msg: '用户名或邮箱不正确！' };
      return;
    }

    const { retrieveKey } = await service.user.setRetrieveKey(user._id);

    // 发送邮件
    await service.mail.sendResetPassMail(email, retrieveKey, user.username);

    ctx.body = { status: 'success', msg: '邮件已经发送' };
  }

  // 重置密码-step2
  async resetPassVerify() {
    const { ctx, service } = this;
    const { username, key } = ctx.request.body;

    if (!username || username.trim() === '') {
      ctx.body = { status: 'failed', msg: '错误的重置链接!' };
      return;
    }
    if (!key || key.trim() === '') {
      ctx.body = { status: 'failed', msg: '错误的重置链接!' };
      return;
    }
    // 验证用户及key
    const user = await service.user.findByUsername(username);
    if (!user) {
      ctx.body = { status: 'failed', msg: '错误的重置链接!' };
      return;
    }
    if (key !== user.retrieveKey) {
      ctx.body = { status: 'failed', msg: '错误的重置链接!' };
      return;
    }
    if (Date.now() - user.retrieveTime > 24 * 60 * 60 * 1000) {
      ctx.body = { status: 'failed', msg: '验证码已过期!' };
      return;
    }

    ctx.body = { status: 'success', data: { verify: true } };
  }

  // 重置密码-step3
  async resetPass() {
    const { ctx, service } = this;
    const { key, username, new_password } = ctx.request.body;

    if (!username || username.trim() === '') {
      ctx.body = { status: 'failed', msg: '错误的重置链接!' };
      return;
    }
    if (!key || key.trim() === '') {
      ctx.body = { status: 'failed', msg: '错误的重置链接!' };
      return;
    }
    if (!new_password || new_password.trim() === '') {
      ctx.body = { status: 'failed', msg: '新密码不能为空' };
      return;
    }
    // 验证用户及key
    const user = await service.user.findByUsername(username);
    if (!user) {
      ctx.body = { status: 'failed', msg: '错误的重置链接!' };
      return;
    }
    if (key !== user.retrieveKey) {
      ctx.body = { status: 'failed', msg: '错误的重置链接!' };
      return;
    }
    if (Date.now() - user.retrieveTime > 24 * 60 * 60 * 1000) {
      ctx.body = { status: 'failed', msg: '验证码已过期!' };
      return;
    }

    await service.user.updatePass(user._id, new_password);

    ctx.body = { status: 'success' };
  }
}

module.exports = SignController;
