'use strict';

module.exports = () => {
  return async (ctx, next) => {
    const query = ctx.query;
    const config = ctx.app.config;

    const page = Math.max(1, parseInt(query.page || config.default_page, 10));
    const limit = Math.min(
      100,
      parseInt(query.limit || config.default_limit, 10)
    );

    ctx.query.page = page;
    ctx.query.limit = limit;

    await next();
  };
};
