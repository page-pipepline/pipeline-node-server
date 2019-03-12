'use strict';

module.exports = app => {
  class TemplateController extends app.Controller {
    async index() {
      const { ctx, service } = this;

      const dbParams = {
        conditions: ctx.request.query,
      };

      const result = await service.db.queryManyTemplates(dbParams);
      ctx.body = result;
    }

    async show() {
      const { ctx, service } = this;

      const dbParams = {
        conditions: {
          id: ctx.params.id,
        },
      };

      const result = await service.db.queryTemplate(dbParams);
      ctx.body = result;
    }

    async create() {
      const { ctx, service, config } = this;

      const id = Number(ctx.request.body.id);
      const name = ctx.request.body.name;
      const fileName = ctx.request.body.fileName;
      const imageName = ctx.request.body.imageName;

      const files = `${id}/${fileName}`;
      const thumbnail = `${id}/${imageName}`;

      // 移动文件到资源目录
      await ctx.helper.execShell(`mkdir -p ${config.resourcesPath.templateDir}/${id}`);
      await ctx.helper.execShell(`mv ${config.temporaryDir}/${id}/* ${config.resourcesPath.templateDir}/${id}`);

      const dbParams = {
        conditions: {},
        payload: {
          id,
          name,
          files,
          thumbnail,
        },
      };

      const result = await service.db.createTemplate(dbParams);
      ctx.body = result;
    }

    async update() {
      const { ctx, service } = this;

      const dbParams = {
        conditions: {
          id: ctx.params.id,
        },
        payload: ctx.request.body,
      };

      const result = await service.db.updateTemplate(dbParams);
      ctx.body = result;
    }

    async destroy() {
      const { ctx, service } = this;

      const dbParams = {
        conditions: {
          id: ctx.params.id,
        },
      };

      const result = await service.db.deleteTemplate(dbParams);
      ctx.body = result;
    }

    async getTemplateId() {
      const { ctx } = this;
      ctx.body = ctx.helper.uuid.getUuid();
    }
  }

  return TemplateController;
};
