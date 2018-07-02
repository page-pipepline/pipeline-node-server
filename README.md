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
