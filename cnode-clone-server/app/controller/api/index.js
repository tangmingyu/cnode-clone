'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  // 主页
  async entry() {
    // 根据tab查询主题列表
    // 查询积分榜用户列表
    // 查询无回复主题列表
    // await this.ctx.render('index.hbs');
  }

  // 主题页
  async topic() {
    // await this.ctx.render('topic.hbs');
  }
}

module.exports = HomeController;
