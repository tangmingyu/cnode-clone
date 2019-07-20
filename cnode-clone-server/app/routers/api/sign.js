'use strict';

module.exports = app => {
  const { router, controller, middleware } = app;
  const userRequired = middleware.userRequired();
  const sign = controller.api.sign;
  const api = router.namespace('/api');

  // 注册
  api.post('/signup', sign.signUp);

  // 激活
  api.put('/active', sign.active);

  // 登录
  api.post('/signin', sign.signIn);

  // 登出
  api.all('/signout', sign.signOut);

  // 查询登录信息
  api.get('/signinfo', userRequired, sign.signInfo);

  // 重置密码-step1:用户发起重置密码请求，验证邮箱，生成验证码，发送验证邮件
  api.post('/reset/request', sign.resetPassRequest);

  // 重置密码-step2:校验验证码，显示重置密码的页面
  api.put('/reset/verify', sign.resetPassVerify);

  // 重置密码-step3:校验验证码，设置新密码
  api.put('/reset', sign.resetPass);
};
