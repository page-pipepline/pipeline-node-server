'use strict';

module.exports = () => {
  return async (ctx, next) => {
    try {
      await next();

      if (ctx.status === 404 && !ctx.body) {
        throw new Error('404: 请求的接口不存在');
      }

      const body = ctx.body || {};
      ctx.body = {
        data: body,
        ret: '0',
        errMsg: '',
      };

      // 记录接口调用日志
      ctx.logger.info(`${ctx.session.user}: ${JSON.stringify(body)}`);
    } catch (err) {
      ctx.body = {
        data: {},
        ret: '1',
        errMsg: err.message,
      };

      // 记录报错日志
      ctx.logger.error(err);
    }
  };
};
