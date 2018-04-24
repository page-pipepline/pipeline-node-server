'use strict';

module.exports = () => {
  const config = exports = {};

  // 覆盖 egg-static 生产模式对静态资源的缓存, 因为模板生成的页面放在静态资源中预览, 需要实时获取最新的渲染文件
  exports.static = {
    maxAge: 0,
    buffer: false,
  };

  return config;
};
