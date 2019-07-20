'use strict';

module.exports = () => {
  return async (ctx, next) => {
    const session = ctx.session;
    const user_session_id = session.user_session_id;

    if (!user_session_id) {
      await next();
      return;
    }

    const user = await ctx.service.userSession.getUser(user_session_id);
    if (user) {
      ctx.user = user;
    }

    await next();
  };
};
