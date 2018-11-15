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
      const { ctx, service } = this;

      const dbParams = {
        conditions: {},
        payload: ctx.request.body,
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
  }

  return TemplateController;
};
