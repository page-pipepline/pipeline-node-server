# pipeline-node-server
> 页面可视化搭建框架的后台服务

## 简介
提供模板生成页面的基本操作接口.

## 服务端脚本软件
* unzip

## 准备工作
* 需要在该项目同级建立`pipeline-resources`目录.
* 到`pipeline-template`项目中生成模板压缩包`pipeline-template.zip`.
* 添加模板文件 `pipeline-resources/template/1/pipeline-template.zip`.(目前路径写死)

## 非必须
* 添加模板时上传的图片, 存储的是相对`pipeline-resources`的路径, 如果要本地访问到, 需要配置一下资源目录的nginx或代理.
  编辑器会将 `1/thumbnail.png` -> `http://res.pipeline/1/thumbnail.png`.
```
# Whistle 代理配置
# pipeline
/http://res.pipeline/(.*)/ /Path/To/Your/pipeline-resources/template/$1
```

## 启动
```
$ npm i
$ npm run debug
```

## QuickStart

<!-- add docs here for user -->

see [egg docs][egg] for more detail.

### Development

```bash
$ npm i
$ npm run dev
$ open http://localhost:7001/
```

### Deploy

```bash
$ npm start
$ npm stop
```

### npm scripts

- Use `npm run lint` to check code style.
- Use `npm test` to run unit test.
- Use `npm run autod` to auto detect dependencies upgrade, see [autod](https://www.npmjs.com/package/autod) for more detail.

[egg]: https://eggjs.org
