/*
 * 模板生成页面操作接口
 * @Author: CntChen
 * @Date: 2018-03-29
 */

'use strict';

const fs = require('fs');
const path = require('path');

const Controller = require('egg').Controller;

// 将组件库源码放入页面工作管道
const makePagepipelineComponentLibrary = async (context, templateId, pageId) => {
  const { ctx, config } = context;

  // const template = await service.template.getTemplateById(templateId);
  // TODO get componentLibrary by componentLibraryId
  const componentLibrary = {
    files: '/pipeline-resource/component-library/1/pipeline-library.zip',
  };

  const pagepipelineDir = path.join(config.baseDir, 'app/public/pipelines', pageId);
  const componentLibrarypipelineDir = pagepipelineDir;

  const componentLibraryZipFilePath = path.join(config.resourcesPath.componentLibraryDir,
    componentLibrary.files.replace('/pipeline-resource/component-library', ''));

  await ctx.helper.execShell([
    `mkdir -p ${componentLibrarypipelineDir}`,
    `unzip -o ${componentLibraryZipFilePath} -d ${componentLibrarypipelineDir}` ]);
};

// 在页面工作管道备份模板(页面)配置数据
const copyTemplateConfig = async (context, pageId) => {
  const { ctx, config } = context;

  const pagepipelineDir = path.join(config.baseDir, 'app/public/pipelines', pageId);
  const templatepipelineDir = path.join(pagepipelineDir, 'server/config');
  const baseConfigpipelinePath = path.join(templatepipelineDir, 'base-config.json');
  const originBaseConfigpipelinePath = path.join(templatepipelineDir, 'base-config-origin.json');
  const templatepipelinePath = path.join(templatepipelineDir, 'components.json');
  const originTemplatepipelinePath = path.join(templatepipelineDir, 'components-origin.json');

  // 复制模板配置文件, 做为页面重置的数据来源
  await ctx.helper.execShell([
    `cp -rf ${baseConfigpipelinePath} ${originBaseConfigpipelinePath}`,
    `cp -rf ${templatepipelinePath} ${originTemplatepipelinePath}` ]);
};

// 基于模板构建页面工作管道
const makePagepipelineFromTemplate = async (context, templateId, pageId) => {
  const { ctx, config } = context;

  const template = {
    files: '/pipeline-resource/template/1/pipeline-template.zip',
  };

  const templateZipFilePath = path.join(config.resourcesPath.templateDir,
    template.files.replace('/pipeline-resource/template', ''));
  const pagepipelineDir = path.join(config.baseDir, 'app/public/pipelines', pageId);
  const templatepipelineDir = path.join(pagepipelineDir, 'server/config');

  await makePagepipelineComponentLibrary(context, templateId, pageId);
  await ctx.helper.execShell([ `unzip -o ${templateZipFilePath} -d ${templatepipelineDir}` ]);
  await copyTemplateConfig(context, pageId);
  await ctx.helper.execShell([
    `cd ./app/public/pipelines/${pageId}/server`,
    'node node.js preview' ]);
};

// 基于页面构建页面工作管道
const makePagepipelineFromPage = async (context, templateId, pageId) => {
  const { ctx, config, service } = context;

  const page = await service.page.getPageById(pageId);

  const pageZipFilePath = path.join(config.resourcesPath.pageDir,
    page.files.replace('/pipeline-resource/page', ''));
  const pagepipelineDir = path.join(config.baseDir, 'app/public/pipelines', pageId);
  const templatepipelineDir = path.join(pagepipelineDir, 'server/config');

  await makePagepipelineComponentLibrary(context, templateId, pageId);
  await ctx.helper.execShell([ `unzip -o ${pageZipFilePath} -d ${templatepipelineDir}` ]);
  await copyTemplateConfig(context, pageId);
  await ctx.helper.execShell([
    `cd ./app/public/pipelines/${pageId}/server`,
    'node node.js preview' ]);
};

// 构建用于发布页面源码
const makePageActivity = async (context, pageId) => {
  const { ctx, config } = context;
  const pagepipelineServerDir = path.join(config.baseDir, 'app/public/pipelines', pageId, 'server');
  const pageActivityDir = path.join(config.baseDir, 'app/public/activities', pageId);

  // 复制 pipelines 到 activities, 并执行页面发布的构建
  await ctx.helper.execShell([
    `mkdir -p ${pageActivityDir}`,
    `cp -rf ${pagepipelineServerDir} ${pageActivityDir}`,
    `cd ./app/public/activities/${pageId}/server`,
    'node node.js release' ]);

  // 基于 dist 创建纯净的发布目录
  await ctx.helper.execShell([
    `mkdir -p ./app/public/activities/${pageId}/${pageId}`,
    `cp -rf ./app/public/activities/${pageId}/server/dist/* ./app/public/activities/${pageId}/${pageId}`,
    `cd ./app/public/activities/${pageId}/${pageId}`,
    'rm -f index-origin.html',
    'rm -f vue-ssr-server-bundle.json',
    'rm -f vue-ssr-client-manifest.json' ]);
};

class EditController extends Controller {
  async prepareFromTemplate() {
    const { ctx } = this;
    const templateId = ctx.request.body.templateId;

    // 生成页面ID: timeStamp + 00 + 2位随机数
    const timeStranpStr = new Date().getTime();
    const randomStr = Math.random().toString().slice(-2);
    const pageId = `${timeStranpStr}00${randomStr}`;

    await makePagepipelineFromTemplate(this, templateId, pageId);

    ctx.body = { pageId };
  }

  async prepareFromPage() {
    const { ctx, service } = this;
    const pageId = ctx.request.body.pageId;

    const page = await service.page.getPageById(pageId);
    const templateId = page.templateId;

    await makePagepipelineFromPage(this, templateId, pageId);

    ctx.body = { pageId };
  }

  async prepareForRelease() {
    const { ctx, service, config } = this;
    const pageId = ctx.request.body.pageId;
    const page = await service.page.getPageById(pageId);
    const templateId = page.templateId;

    const pageActivityDir = path.join(config.baseDir, 'app/public/activities', pageId);
    const pagepipelineDir = path.join(config.baseDir, 'app/public/pipelines', pageId);

    const pagepipelineDirStat = await ctx.helper.file.fsStat(pagepipelineDir).catch(e => e);
    if (pagepipelineDirStat instanceof Error) {
      await makePagepipelineFromTemplate(this, templateId, pageId);
    }
    const pageActivityDirStat = await ctx.helper.file.fsStat(pageActivityDir).catch(e => e);
    if (pageActivityDirStat instanceof Error) {
      await makePageActivity(this, pageId);
    }

    ctx.body = { pageId };
  }

  async getBaseConfig() {
    const { ctx, config } = this;
    const pageId = ctx.query.pageId;

    const templatepipelineDir = path.join(config.baseDir, 'app/public/pipelines', pageId, 'server/config');
    const dataPath = path.join(templatepipelineDir, 'base-config.json');
    const dataStr = fs.readFileSync(dataPath, 'utf-8');
    const content = JSON.parse(dataStr);
    ctx.body = content;
  }

  async putBaseConfig() {
    const { ctx, config } = this;
    const pageId = ctx.request.body.pageId;
    const baseConfig = ctx.request.body.baseConfig;
    const baseConfigStr = JSON.stringify(baseConfig, null, 2);
    const templatepipelineDir = path.join(config.baseDir, 'app/public/pipelines', pageId, 'server/config');
    const baseConfigPath = path.join(templatepipelineDir, 'base-config.json');
    fs.writeFileSync(baseConfigPath, baseConfigStr, 'utf-8');
    await ctx.helper.execShell([
      'pwd',
      `cd ./app/public/pipelines/${pageId}/server`,
      'node node.js preview' ]);
    ctx.body = '修改页面基本配置成功.';
  }

  async getBaseConfigSchema() {
    const { ctx, config } = this;
    const pageId = ctx.query.pageId;
    const templatepipelineDir = path.join(config.baseDir, 'app/public/pipelines', pageId, 'server/config');
    const schemaPath = path.join(templatepipelineDir, 'base-config-schema.json');
    const schemaStr = fs.readFileSync(schemaPath, 'utf-8');
    const content = JSON.parse(schemaStr);
    ctx.body = content;
  }

  async getTemplateComponents() {
    const { ctx, config } = this;
    const pageId = ctx.query.pageId;
    const templatepipelineDir = path.join(config.baseDir, 'app/public/pipelines', pageId, 'server/config');
    const dataPath = path.join(templatepipelineDir, 'components.json');
    const dataStr = fs.readFileSync(dataPath, 'utf-8');
    const content = JSON.parse(dataStr);
    ctx.body = content;
  }

  async putTemplateComponents() {
    const { ctx, config } = this;
    const pageId = ctx.request.body.pageId;
    const templateComponents = ctx.request.body.templateComponents;
    const templateComponentsStr = JSON.stringify(templateComponents, null, 2);
    const templatepipelineDir = path.join(config.baseDir, 'app/public/pipelines', pageId, 'server/config');
    const templateComonentsPath = path.join(templatepipelineDir, 'components.json');
    fs.writeFileSync(templateComonentsPath, templateComponentsStr, 'utf-8');
    await ctx.helper.execShell([
      `cd ./app/public/pipelines/${pageId}/server`,
      'node node.js preview' ]);
    ctx.body = '修改页面组件列表成功';
  }

  async getComponentsSchema() {
    const { ctx, config } = this;
    const pageId = ctx.query.pageId;
    const templatepipelineDir = path.join(config.baseDir, 'app/public/pipelines', pageId, 'server/config');
    const schemaPath = path.join(templatepipelineDir, 'template-schemas.json');
    const schemaStr = fs.readFileSync(schemaPath, 'utf-8');
    const content = JSON.parse(schemaStr);
    ctx.body = content;
  }
}

module.exports = EditController;
