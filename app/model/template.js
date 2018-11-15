/*
 * 模板表 model
 * @Author: CntChen
 * @Date: 2018-11-02
 */

'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const TemplateSchema = new Schema({
    id: {
      type: Number,
      unique: true,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    createTime: {
      type: Date,
      default: Date.now,
    },
    updateTime: {
      type: Date,
      default: Date.now,
    },
    files: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String,
      default: 'https://avatars3.githubusercontent.com/u/38666040',
    },
  });

  return mongoose.model('Template', TemplateSchema);
};
