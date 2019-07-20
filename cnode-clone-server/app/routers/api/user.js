'use strict';

module.exports = app => {
  const { router, controller, middleware } = app;
  const userRequired = middleware.userRequired();
  const user = controller.api.user;
  const api = router.namespace('/api');

  api.get('/user/:username', user.profile);

  api.get('/user/:username/topics', user.topics);

  api.get('/user/:username/participates', user.participates);

  api.get('/user/:username/collects', user.collects);

  api.put('/user', userRequired, user.updateProfile);

  api.put('/user/pass', userRequired, user.changePass);

  api.put('/user/token/refresh', userRequired, user.refreshToken);
};
