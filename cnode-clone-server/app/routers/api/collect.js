'use strict';

module.exports = app => {
  const { router, controller, middleware } = app;
  const userRequired = middleware.userRequired();
  const collect = controller.api.collect;
  const api = router.namespace('/api');

  api.post('/collect', userRequired, collect.addCollect);

  api.delete('/collect', userRequired, collect.delCollect);
};
