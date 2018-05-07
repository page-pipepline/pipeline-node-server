'use strict';

const path = require('path');

module.exports = appInfo => {
  const config = exports = {};

  // 服务采用 7011 端口
  config.cluster = {
    listen: {
      port: 7011,
    },
  };

  config.middleware = [ 'staticCacheIgnore', 'bodyclothes' ];
  config.keys = appInfo.name + '_pipeline';

  config.static = {
    enable: true,
    ignore: ctx => [ /public\/pipelines\/\d+\/server\/dist\/index\.html/ ].some(item => item.test(ctx.path)),
  };

  config.staticCacheIgnore = {
    dontCache: [ /public\/pipelines\/\d+\/server\/dist\/index\.html/ ],
  };

  config.security = {
    csrf: {
      enable: false,
    },
    // 编辑中的的页面在 iframe 中浏览, 所以需要允许
    xframe: {
      enable: false,
    },
  };

  exports.logger = {
    dir: path.join(__dirname, '..', 'logs'),
  };

  config.cors = {
    origin: ctx => ctx.get('origin'),
    credentials: true,
  };

  // 与 node 源码同一级
  const resourceBaseDir = path.join(__dirname, '..', '..', 'pipeline-resources');
  config.resourcesPath = {
    componentLibraryDir: path.join(resourceBaseDir, 'component-library'),
    templateDir: path.join(resourceBaseDir, 'template'),
    pageDir: path.join(resourceBaseDir, 'page'),
  };

  config.publicDir = path.join(__dirname, '..', 'app', 'public');

  return config;
};
