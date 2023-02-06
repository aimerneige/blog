---
title: "Ubuntu 19.10 配置 Hexo"
date: 2020-02-16T01:26:34+08:00
draft: true
ShowToc: true
categories: [Linux]
tags: [ubuntu,hexo]
---

# Ubuntu 19.10 配置 Hexo

> 本教程仅供参考，具体以官方文档为主
>
> 遇到问题建议去看官方文档
>
> 官方文档全中文，而且十分详细
>
> 本文章也是基于官方文档写的

## 官方文档

> https://hexo.io/zh-cn/docs/

## 安装依赖环境

安装 git:

```bash
sudo apt install git
```

安装 Node.js:

```bash
sudo apt install nodejs
```

安装 npm:

```bash
sudo apt install npm
```

## 安装 Hexo

```bash
sudo npm install -g hexo-cli
```

用你喜欢的方式创建一个文件夹，用来保存你的博客相关文件

```bash
cd ~/Code
mkdir Blog
```

在这个目录下打开终端，执行初始化命令

```bash
cd ~/Code/Blog
hexo init
```

## 安装插件

> npm install hexo-generator-index --save
>
> npm install hexo-generator-archive --save
>
> npm install hexo-generator-category --save
>
> npm install hexo-generator-tag --save
>
> npm install hexo-server --save
>
> npm install hexo-deployer-git --save
>
> npm install hexo-deployer-heroku --save
>
> npm install hexo-deployer-rsync --save
>
> npm install hexo-deployer-openshift --save
>
> npm install hexo-renderer-marked --save
>
> npm install hexo-renderer-stylus --save
>
> npm install hexo-generator-feed --save
>
> npm install hexo-generator-sitemap --save

## 测试

```bash
hexo server
```

## 开始配置你的站点吧！
