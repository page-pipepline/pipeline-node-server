'use strict';

module.exports = () => {
  const config = exports = {};

  /**
   * 通过 static 中间件的 ignore 和自定义不缓存文件的中间件 static-cache-ignore, 实现 index.html 文件的不缓存
   * 以下代码不需要, 使用会降低前端页面性能: 页面刷新都重新请求资源
   */
  // 覆盖 egg-static 生产模式对静态资源的缓存, 因为模板生成的页面放在静态资源中预览, 需要实时获取最新的渲染文件
  // exports.static = {
  //   maxAge: 0,
  //   buffer: false,
  // };

  return config;
};
