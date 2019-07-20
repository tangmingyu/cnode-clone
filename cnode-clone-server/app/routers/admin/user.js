'use strict';

module.exports = app => {
  const { router, controller } = app;
  const user = controller.admin.user;
  const admin = router.namespace('/admin');

  admin.put('/user/:username/block', user.block);

  admin.put('/user/:username/star', user.star);
};
