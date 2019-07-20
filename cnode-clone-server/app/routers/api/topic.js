'use strict';

module.exports = app => {
  const { router, controller, middleware } = app;
  const userRequired = middleware.userRequired();
  const topic = controller.api.topic;
  const api = router.namespace('/api');

  api.get('/topics', topic.list);

  api.get('/topic/:topicId', topic.info);

  api.post('/topic', userRequired, topic.create);

  api.put('/topic', userRequired, topic.update);

  api.delete('/topic', userRequired, topic.delete);
};
