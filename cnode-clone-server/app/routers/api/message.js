'use strict';

module.exports = app => {
  const { router, controller, middleware } = app;
  const userRequired = middleware.userRequired();
  const message = controller.api.message;
  const api = router.namespace('/api');

  api.get('/messages/:type', userRequired, message.list);

  api.get('/message/check', userRequired, message.check);

  api.put('/message/mark', userRequired, message.markOneReaded);

  api.put('/message/markall', userRequired, message.markAllReaded);

  api.delete('/message', userRequired, message.delete);
};
