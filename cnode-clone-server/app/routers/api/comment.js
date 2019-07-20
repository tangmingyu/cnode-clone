'use strict';

module.exports = app => {
  const { router, controller, middleware } = app;
  const userRequired = middleware.userRequired();
  const comment = controller.api.comment;
  const api = router.namespace('/api');

  api.get('/topic/:topicId/comments', comment.list);

  api.post('/comment', userRequired, comment.create);

  api.put('/comment', userRequired, comment.update);

  api.delete('/comment', userRequired, comment.delete);

  api.put('/comment/up', userRequired, comment.thumbUp);
};
