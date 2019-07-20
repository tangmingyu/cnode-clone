/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = (exports = {});

  config.debug = true;

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1556680890207_6134';

  // session cookie name
  config.auth_cookie_name = 'cnode-clone';

  // add your middleware config here
  config.middleware = [ 'auth', 'page' ];

  config.view = {
    defaultViewEngine: 'handlebars',
    defaultExtension: '.hbs',
    mapping: {
      '.hbs': 'handlebars',
    },
  };

  config.handlebars = {};

  // mongodb
  config.mongoose = {
    url: process.env.EGG_MONGODB_URL || 'mongodb://127.0.0.1:27017/cnode_clone',
    options: {
      poolSize: 20,
      reconnectTries: 10,
      reconnectInterval: 500,
    },
  };

  config.security = {
    csrf: {
      cookieName: 'csrfToken',
      headerName: 'x-csrf-token',
    },
    // domainWhiteList: [ 'http://localhost:8080' ],
  };

  // config.cors = {
  //   origin: 'http://localhost:8080',
  //   credentials: true,
  //   allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
  // };

  // add your user config here
  const userConfig = {
    name: 'CNode Clone',
    description: 'CNode Clone',
    site_logo: '',
    site_icon: '',
    host: 'http://localhost:7001',
    default_limit: 30,
    default_page: 1,
    tabs: [
      [ 'share', '分享' ],
      [ 'ask', '问答' ],
      [ 'job', '招聘' ],
      [ 'dev', '客户端测试' ],
    ],
    mail_opts: {
      host: 'smtp.aliyun.com',
      port: 25,
      auth: {
        user: 'xxx@aliyun.com',
        pass: 'xxx',
      },
      ignoreTLS: true,
    },
  };

  return {
    ...config,
    ...userConfig,
  };
};
