'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;

  // 模板相关接口
  app.resources('/templates', controller.templates);
  router.get('/templateid', controller.templates.getTemplateId);

  // 模板生成页面相关接口
  router.post('/pipeline/prepareFromTemplate', controller.pipeline.prepareFromTemplate);
  router.post('/pipeline/prepareFromPage', controller.pipeline.prepareFromPage);
  router.post('/pipeline/prepareForRelease', controller.pipeline.prepareForRelease);
  router.get('/pipeline/baseConfig', controller.pipeline.getBaseConfig);
  router.put('/pipeline/baseConfig', controller.pipeline.putBaseConfig);
  router.get('/pipeline/baseConfigSchema', controller.pipeline.getBaseConfigSchema);
  router.get('/pipeline/templateComponents', controller.pipeline.getTemplateComponents);
  router.put('/pipeline/templateComponents', controller.pipeline.putTemplateComponents);
  router.get('/pipeline/libraryComponentsInfo', controller.pipeline.getLibraryComponentsInfo);
  router.get('/pipeline/componentsSchema', controller.pipeline.getComponentsSchema);
  router.get('/pipeline/componentsDefaultData', controller.pipeline.getComponentsDefaultData);

  // 文件上传
  router.post('/file/upload', controller.file.upload);


  router.get('/', controller.home.index);
};
