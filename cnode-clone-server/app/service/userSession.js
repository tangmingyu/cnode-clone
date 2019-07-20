'use strict';

const Service = require('egg').Service;
const utils = require('../utils/utils');

class UserSessionService extends Service {
  async setUser(user) {
    const userSessionId = utils.userSessionId();
    const usersession = new this.ctx.model.UserSession();
    usersession.userSessionId = userSessionId;
    usersession.user = user;

    await usersession.save();

    return userSessionId;
  }
  async getUser(userSessionId) {
    const usersession = await this.ctx.model.UserSession.findOne({
      userSessionId,
    }).populate('user');

    if (!usersession) {
      return;
    }

    if (Date.now() - usersession.createAt > 30 * 24 * 60 * 60 * 1000) {
      await usersession.deleteOne();
      return;
    }

    return usersession.user;
  }
}

module.exports = UserSessionService;
