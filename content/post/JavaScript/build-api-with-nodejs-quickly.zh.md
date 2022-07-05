---
title: "使用 nodejs 快速为 Android 程序构建 API"
date: 2021-01-30T20:17:30+08:00
draft: false
ShowToc: true
description: "使用 nodejs 开发简单后端"
categories: [JavaScript]
tags: [nodejs,javascript,api,mysql]
cover:
    image: "images/nodejs.png"
    alt: "nodejs logo"
    relative: false
---

## 前言

之前在学习安卓的时候，很想要给自己的软件增加一个云服务功能，但是苦于没有学过后端，于是开始在互联网上查找资料。但是遗憾的是，后端是一个很大的范围，我查找了很多后端的资料也几乎都是在讲解如何写网页，并没有专门用来给安卓写后端的教程，在广泛地学习了大量后端内容后，成功的为自己的程序开发了一个简单的 API。希望这篇文章能够帮到那些没有系统地学习过后端，但是却想要快速开发一款能用的 API 的安卓开发者。

## 前期准备

1. 你要了解互联网通讯原理
2. 你要会一些基础的 `JavaScript`
3. 你要有一台服务器
4. 你会数据库操作
5. 最好有一个域名（非必须）
6. 掌握基础的终端操作

## 环境配置

本文章中后端开发使用的开发语言为 `JavaScript` 配合 `nodejs`。数据库采用常用的 `mysql`。

> 注： `nodejs` 开发常用的数据库是 `mongodb`，但是由于 `mysql` 比较常用这里就用 `mysql` 了，当然其他数据库也是可以的，你可以查找一下 `nodejs` 如何链接这些数据库，并将本文中 `mysql` 操作的部分替换掉就可以了。

### 本地测试客户端安装

你需要在自己用来开发的电脑上安装配置如下环境：

- **nodejs**
- **npm**

#### 安装 nodejs

Linux 下直接使用包管理安装即可。如果包管理安装的 node 很旧，可以自行谷歌一下安装方法，这里不再赘述。

以 Ubuntu 为例，直接在终端执行如下指令：

```bash
sudo apt install nodejs
```

安装完成后使用 `node -v` 查看 node 版本来确认安装是否成功。

如果是 windows 用户就更加简单了，直接在 [nodejs 官网](https://nodejs.org/) 下载安装包运行即可。推荐使用长周期稳定版本。如果你想体验新特性，也可以考虑使用最新的版本。

#### 安装 npm

通常情况下，安装 `nodejs` 时会附带安装 `npm`，你可以直接使用 `npm -v` 来查看当前系统安装的 `npm` 版本来检测安装情况。

如果没有安装，以 `Ubuntu` 系统为例，可以在终端执行下面的指令：

```bash
sudo apt install npm
```

`windows` 用户在执行完 `node` 的安装程序后 `npm ` 会自动安装完成。

### 服务器安装

你需要在服务器上安装配置如下环境：

- **nodejs**
- **npm**
- **mysql**
- **nginx**

#### 安装 nodejs 与 npm

其中 `nodejs` 和 `npm` 的安装同客户端完全相同，这里不再赘述。

#### 安装 mysql

`mysql` 可以一并安装在运行 `node` 项目的服务器上，也可以使用独立的数据库提供服务器。

本文章主要讨论如何构建 `API` ，这里不再赘述如何安装配置 `mysql`。可以查看我的其他文章。

#### 安装 nginx

nginx 用于将服务反向代理到 80 端口，以 `Ubuntu` 系统为例，直接在终端执行如下指令：

```bash
sudo apt install nginx
```

Windows 用户自行查阅相关资料。<sub>~~不会吧，不会吧，不会有人服务器用 windows 吧？？~~</sub>

## 项目构建

### 使用模版

为了方便快速构建一个项目，我写了一个模版，你可以在 [GitHub](https://github.com/aimerneige/node_json_api_template) 上找到它。

使用这个模版快速构建一个新的仓库，将它 clone 到本地，并进行下面的修改：

1. 修改 package.json
2. 修改 LICENSE
3. 修改 README
4. 在 `src/config` 下新建 `db.js` 写入数据库服务器的配置。

### 安装依赖

在项目路径下启动终端，执行如下指令：

```bash
npm i
```

这个指令是 `npm install` 的缩写，`npm` 会安装需要的依赖，本模版项目只依赖了俩个包：

1. express
2. mysql

依赖安装完成后，你会在项目路径下看到 `node_modules` 这个文件夹，它已经被写在 `.gitignore` 中，这个文件夹下是项目所需要的依赖，即使你意外地删掉了这个文件夹，再次执行 `npm i` 就可以将这些文件下载回来，所以你不应该在意这个文件夹中有什么内容，`npm` 会帮我们处理它。

### 启动项目

使用 `cd` 命令切换到 `src` 目录下，执行下面的指令：

```bash
node app.js
```

之后你会在终端看到如下输出：

```bash
Server start in development mode on http://localhost:4000; press Ctrl + C to terminated.
```

打开你的浏览器访问 <http://localhost:4000/>

如果你看到下面的内容，说明项目成功启动了：

```json
{ "status": 200, "info": "If you see this, the server deploy success!" }
```

如果你在服务器启动项目，假设你的服务器 ip 为 `43.192.82.215` 并且配置了域名 `api.aimerneige.com` ，你可以通过在浏览器内访问下面的地址测试服务器：

- <http://43.192.82.215:4000/>
- <http://api.aimerneige.com:4000/>

注意：

- 在本地测试启动的服务器只能通过 **本地/内网** 访问
- 在有公网 ip 的服务器上部署的服务可以在 **任意浏览器内** 打开

如果你在服务器测试，请注意以这样的方式运行仅能用来测试，不可以用作生产环境，后文会介绍如何在服务器部署项目。

### 程序入口

项目可以启动后，说明环境配置无误，接下来可以开始写代码了。

我们简单看一下程序的入口 `app.js`

本项目依赖 express 构建，首先导入 express 的模块：

```js
// require
const express = require("express");
```

接下来导入路由目录下的路由模块：

```js
// user require
const indexRouter = require("./routes/index");
```

创建 express 对象：

```js
// express app
var app = express();
```

设置监听端口：

```js
// set port
app.set("port", process.env.PORT || 4000);
```

添加可以支持 json 解析的中间件：

```js
// json parse
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
```

添加路由中间件：

```js
// routes
app.use("/", indexRouter);
```

路由匹配失败后返回 404 错误：

```js
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
});
```

处理错误信息：

```js
// error handler
app.use(function (err, req, res, next) {
  res.type("application/json");
  res.status(err.status || 500);
  res.send({
    status: err.status || 500,
    message: err.message,
  });
});
```

检测当前模块是否被直接执行，如果是则启动服务器，否者导出模块：

```js
// check if run app.js directly
if (require.main === module) {
  app.listen(app.get("port"), function () {
    console.log(
      "Server start in " +
        app.get("env") +
        " mode on http://localhost:" +
        app.get("port") +
        "; press Ctrl + C to terminated."
    );
  });
} else {
  module.exports = app;
}
```

其他的代码可以暂时不去理会，最重要的是路由这一部分：

```js
// 导入路由模块
const indexRouter = require("./routes/index");
// 添加路由中间件
app.use("/", indexRouter);
```

在编写 api 时，只需要在 `/src/routes` 目录下新建路由模块，并在 `app.js` 下引用即可。

### 添加路由

接下来我们看一下默认的路由模块 `index.js` ：

导入 express 模块：

```js
const express = require("express");
const router = express.Router();
```

配置路由规则：

```js
router.get("/", function (req, res, next) {
  res.type("application/json");
  res.status(200);
  res.send({
    status: 200,
    info: "If you see this, the server deploy success!",
  });
});
```

导出模块：

```js
module.exports = router;
```

其中重点即配置路由规则这一部分。

我相信这几行代码还是很易懂的，相对地，如果我们想要使用 post 方法，访问路径为 `/about` 需要这样写：

```js
router.post("/about", fuction(){ /* function */ } );
```

设置好请求方法和请求路径后，回调函数用来向客户端返回数据。

设置返回数据类型，这里使用 `json` 进行数据传输：

```js
res.type("application/json");
```

设置返回状态码：

```js
res.status(200);
```

返回指定数据：

```js
res.send(return_data);
```

由于开发语言为 js ，而且本项目添加了解析 json 的中间件，如果想要返回 json，不需像其他语言那样要将对象解析为 json 字符串，直接返回一个对象即可，客户端会成功接收到正确的 json 字符串。

```js
// 服务器返回的对象
{
    status: 200,
    info: "If you see this, the server deploy success!",
}
```

```json
// 客户端拿到的字符串
{ "status": 200, "info": "If you see this, the server deploy success!" }
```

书写好路由模块后在 `app.js` 中引用即可：

```js
// 导入模块
const indexRouter = require("./routes/index");

// ... 中间的其他代码

// 在 app 中应用路由模块
app.use("/", indexRouter);
```

要注意模块导入的位置，不能乱放。和模版保持一致即可。

### 添加更多的路由信息

就像上面的例子中所写的，我们可以继续添加新的路由模块，也可以在同一个路由模块下添加更多的访问路径。

- `src/app.js`

```js
// ...

const indexRouter = require("./routes/index");
const userRouter = require("./routes/user");

// ...

app.use("/", indexRouter);
app.use("/user", userRouter);
```

- `src/routes/index.js`

```js
// ...

// 访问路径 /
router.get("/", fuction(){ /* function */ } );

// 访问路径 /about
router.get("/about", function() { /* function */ });

// ...
```

- `src/routes/user.js`

```js
// ...

// 访问路径 /user/cat
router.get("/cat", fuction(){ /* function */ } );

// 访问路径 /user/edit
router.post("/edit", fuction(){ /* function */ } );

// 访问路径 /user/new
router.psot("/new", fuction(){ /* function */ } );

// ...
```

### 获取客户端数据

#### 获取请求参数信息

`req.query` 对象是由客户端请求参数构成的，在回调函数内，可以直接调用它来获取客户端请求参数，如果客户端传递了参数，我们就可以拿到对应的数据，否者我们只能得到 `undefined`。由此可以通过判空来确定客户端请求参数是否正确。

例如我们的请求路径为 `/data` 所需请求参数为 `id` 和 `class` 可以这样写：

> 注： 对应的示例请求地址为 `https://api.example.com/data?id=1930201&class=302`

```js
router.get("/data", function (req, res) {
  res.type("application/json");
  if (req.query.class === undefined || req.query.id === undefined) {
    res.status(400);
    // 向客户端返回错误信息，提示客户端返回正确的参数
    res.send({
      status: 400,
      info: "Wrong arguments!",
    });
  } else {
    // 向用户返回数据（通常会用客户端参数来调用数据库，为了简便这里返回一个类做简单示范）
    res.status(200);
    res.send({
      status: 200,
      info: {
        class: req.query.class,
        id: req.query.id,
      },
    });
  }
});
```

我们可以通过判空来确定客户端请求参数是否正确，之后可以使用参数来进行其他操作，比如构建类，调取数据库等等。

#### 获取请求体信息

与请求参数类似，请求体信息也保存在一个类中，就是 `req.body`。使用方法和之前请求参数完全一致，这里只写一个示例，不多赘述。

```js
router.post("/new", function (req, res) {
  res.type("application/json");
  if (req.body.class === undefined || req.body.id === undefined) {
    res.status(400);
    // 向客户端返回错误信息，提示客户端返回正确的参数
    res.send({
      status: 400,
      info: "Wrong arguments!",
    });
  } else {
    var new_student = {
      class: req.body.class,
      id: req.body.id,
    };
    // 向数据库内添加新的学生
    res.status(200);
    res.send({
      status: 200,
      info: "Student create successful!",
    });
  }
});
```

#### 获取更多信息

在回调函数中，req 对象中保存了所有来自客户请求的数据，前面介绍的只是比较常用的，其他内容可以查找文档。

### 获取数据库信息

#### 配置数据库信息

参考 `db.js.example` 创建 `db.js` 写入服务器的配置

```js
var mysql = require("mysql");

var pool = mysql.createPool({
  host: "host_ip",
  user: "user_name",
  password: "password",
  database: "data",
  port: 3306,
});

function query(sql, callback) {
  pool.getConnection(function (err, connection) {
    connection.query(sql, function (err, rows) {
      callback(err, rows);
      connection.release();
    });
  });
}

exports.query = query;
```

配置好数据库服务器后，就可以通过下面的方法访问数据库的数据了：

```js
sql_command = "DROP DATABASE *;"; // ⚠️ 注意修改
db.query(sql_command, function (err, result, fields) {
  if (err) {
    // 如果数据库指令执行出现了错误，返回错误信息
    requestSQLFailedLog(sql_command, err);
    res.status(400);
    res.send({ status: 400, info: err });
  } else {
    // 如果数据库指令执行成功，返回数据
    requestSQLSuccessLog(sql_command, result);
    res.status(200);
    res.send(result);
  }
});
```

## 服务部署

> 待完善，咕咕咕

1. 将项目上传到服务器
2. 修改 `db.js` 的配置
3. `cd src`
4. `node cluster.js`
5. 如果你想要后台运行，执行 `nohup node cluster.js &`
