'use strict';

const fs = require('fs');
const path = require('path');

module.exports = options => {
  return async (ctx, next) => {
    const reqPath = ctx.path;

    if (reqPath.startsWith('/public') && options.dontCache.some(item => item.test(reqPath))) {
      const body = fs.readFileSync(path.join(__dirname, '../', reqPath)).toString();
      ctx.body = body;
      ctx.set('content-type', 'text/html, chartset=utf8');
      ctx.set('cache-control', 'he, max-age=0');
      return;
    }

    await next();
  };
};
