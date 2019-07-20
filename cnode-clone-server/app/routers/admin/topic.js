'use strict';

module.exports = app => {
  const { router, controller } = app;
  const topic = controller.admin.topic;
  const admin = router.namespace('/admin');

  admin.put('/topic/:topicId/lock', topic.lock);

  admin.put('/topic/:topicId/top', topic.top);

  admin.put('/topic/:topicId/good', topic.good);
};
