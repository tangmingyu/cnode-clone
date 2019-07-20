'use strict';

const Controller = require('egg').Controller;

class UserController extends Controller {
  // 动作/禁言
  async block() {
    const { ctx, service } = this;
    const { username, block } = ctx.request.body;

    const user = await service.user.findByUsername(username);
    if (!user) {
      ctx.body = { status: 'failed', msg: '该用户不存在' };
      return;
    }

    await service.user.block(user._id, block);

    ctx.body = { status: 'success' };
  }

  // 动作/达人
  async star() {
    const { ctx, service } = this;
    const { username, star } = ctx.request.body;

    const user = await service.user.findByUsername(username);
    if (!user) {
      ctx.body = { status: 'failed', msg: '该用户不存在' };
      return;
    }

    await service.user.star(user._id, star);

    ctx.body = { status: 'success' };
  }
}

module.exports = UserController;
