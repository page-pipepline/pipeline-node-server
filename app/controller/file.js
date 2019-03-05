'use strict';

const fs = require('fs');
const path = require('path');

const Controller = require('egg').Controller;

class File extends Controller {
  async upload() {
    const { ctx, config } = this;

    const templateId = ctx.helper.uuid.getUuid();

    const stream = await ctx.getFileStream();
    const fileBuffer = await ctx.helper.upload.streamPromise(stream);
    const filePath = path.join(config.temporaryDir, templateId, stream.filename);

    console.log(config.temporaryDir);
    // 创建临时目录
    await ctx.helper.execShell(`mkdir -p ${config.temporaryDir}/${templateId}`);
    // 写入文件
    fs.writeFileSync(filePath, fileBuffer);

    this.ctx.body = {
      templateId,
    };
  }
}

module.exports = File;
