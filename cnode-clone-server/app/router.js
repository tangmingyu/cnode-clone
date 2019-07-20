'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  // const { router, controller } = app;
  // const { index } = controller.api;

  // router.get('/', index.entry);
  // router.get('/topic/:topicId', index.topic);

  // 加载web端api
  require('./routers/api/collect')(app);
  require('./routers/api/comment')(app);
  require('./routers/api/message')(app);
  require('./routers/api/reply')(app);
  require('./routers/api/topic')(app);
  require('./routers/api/user')(app);
  require('./routers/api/sign')(app);

  // // 加载admin端api
  require('./routers/admin/user')(app);
  require('./routers/admin/topic')(app);
};
