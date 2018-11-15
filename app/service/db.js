/*
 * 基本 mongodb 操作函数
 * @Author: CntChen
 * @Date: 2018-11-02
 */

'use strict';

const DBLOG_PREFIX = '[db-service]:';

const existCheck = (object, keysWithErrorInfo, prefix = '') => {
  const keys = Object.keys(keysWithErrorInfo);
  const errors = keys.map(key => {
    if (object[key]) {
      return true;
    }
    return new Error(`${prefix}, ${key}, ${keysWithErrorInfo[key]}`);
  }).filter(item => item instanceof Error);

  // return first error or true
  if (errors.length) {
    return errors[0];
  }
  return true;
};

module.exports = app => {
  class db extends app.Service {
    // CRUD for Template
    async queryManyTemplates({ conditions = {} } = {}) {
      const query = await app.model.Template.find(conditions)
        .catch(err => {
          app.logger.error(DBLOG_PREFIX, err);
          throw err;
        });
      return query;
    }
    async queryTemplate({ conditions = {} } = {}) {
      const checkResult = existCheck(conditions, {
        id: 'should not be undefined.',
      }, 'queryTemplate');
      if (checkResult instanceof Error) {
        throw new Error(`${DBLOG_PREFIX} ${checkResult.toString()}`);
      }

      const query = await app.model.Template.findOne(conditions)
        .catch(err => {
          app.logger.error(DBLOG_PREFIX, err);
          throw err;
        });
      return query;
    }
    async createTemplate({ payload = {} }) {
      // TODO: id 自增, 寻找不消耗时间的方式, 或者使用 _id
      const count = await app.model.Template.count();
      payload.id = count + 1;

      const newTemplate = new app.model.Template(payload);
      const query = await newTemplate.save()
        .catch(err => {
          app.logger.error(DBLOG_PREFIX, err);
          throw err;
        });
      return query;
    }
    async updateTemplate({ conditions = {}, payload = {} }) {
      const checkResult = existCheck(conditions, {
        id: 'should not be undefined.',
      }, 'updateTemplate');
      if (checkResult instanceof Error) {
        throw new Error(`${DBLOG_PREFIX} ${checkResult.toString()}`);
      }

      const query = await app.model.Template.updateOne(conditions, payload)
        .catch(err => {
          app.logger.error(DBLOG_PREFIX, err);
          throw err;
        });
      return query;
    }
    async deleteTemplate({ conditions = {} }) {
      const checkResult = existCheck(conditions, {
        id: 'should not be undefined.',
      }, 'deleteTemplate');
      if (checkResult instanceof Error) {
        throw new Error(`${DBLOG_PREFIX} ${checkResult.toString()}`);
      }

      const query = await app.model.Template.deleteOne(conditions)
        .catch(err => {
          app.logger.error(DBLOG_PREFIX, err);
          throw err;
        });
      return query;
    }
  }

  return db;
};
