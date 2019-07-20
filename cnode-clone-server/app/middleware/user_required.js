'use strict';

module.exports = () => {
  return async (ctx, next) => {
    if (!ctx.user || !ctx.user._id) {
      ctx.status = 401;
      ctx.body = { status: 'failed', msg: '请先登录！' };
      return;
    }
    await next();
  };
};
