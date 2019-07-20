'use strict';

module.exports = app => {
  const { router, controller, middleware } = app;
  const userRequired = middleware.userRequired();
  const reply = controller.api.reply;
  const api = router.namespace('/api');

  api.get('/topic/:topicId/comment/:commentId/replys', reply.list);

  api.post('/reply', userRequired, reply.create);

  api.put('/reply', userRequired, reply.update);

  api.delete('/reply', userRequired, reply.delete);

  api.put('/reply/up', userRequired, reply.thumbUp);
};
