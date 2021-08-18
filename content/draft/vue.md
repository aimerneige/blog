# Vue 学习记录

![](https://vuejs.org/images/logo.png)

首先贴个官网：

- 官网 <https://vuejs.org/>
- 中文官网 <https://cn.vuejs.org/>

## vuejs 简单介绍

### WHY VUE.JS?

快速了解 vuejs

<https://www.youtube.com/watch?v=p1iLqZnZPdo>

### 作者

![尤雨溪](https://bkimg.cdn.bcebos.com/pic/4afbfbedab64034f29596c8ba6c379310b551da2?x-bce-process=image/watermark,image_d2F0ZXIvYmFpa2U4MA==,g_7,xp_5,yp_5)

vuejs 的作者是来之中国的**尤雨溪**，你可以在下面的百度百科中查看关于作者的更多信息：

[百度百科-尤雨溪](https://baike.baidu.com/item/%E5%B0%A4%E9%9B%A8%E6%BA%AA/2281470)

### vuejs 的优势？

- 体积小
- 更高的运行效率
- 双向数据绑定
- 生态丰富
- 中文资料多

## 安装 vuejs

### chrome 扩展

安装下面的 chrome 扩展，可以更加方便地在 chrome 中调试 vue 应用。

https://github.com/vuejs/vue-devtools

### 直接引入

按照官网的描述，直接通过下面的方法将 html 代码嵌入 html 即可：

```html
<!-- 开发环境版本，包含了有帮助的命令行警告 -->
<script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
```

```html
<!-- 生产环境版本，优化了尺寸和速度 -->
<script src="https://cdn.jsdelivr.net/npm/vue"></script>
```

在学习过程中我们使用开发环境版本。

当然你也可以直接下载 vuejs 然后引用本地文件。

### vue-cli

https://cn.vuejs.org/v2/guide/installation.html#%E5%91%BD%E4%BB%A4%E8%A1%8C%E5%B7%A5%E5%85%B7-CLI

不建议初学者使用 vue-cli 工具

## 构建第一个 vuejs 应用

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Hello Vue</title>
    <script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
</head>
<body>
    <div id="app">
        <h1> {{ title }} </h1>
        <p> {{ message }} </p>
    </div>

<script type="application/javascript">
    const app = new Vue({
        el: "#app",
        data: {
            title: "Hello World!",
            message: "Hello World! Welcome to vue.js",
        }
    });
</script>
</body>
</html>
```

## 数据与方法

创建 vue 实例后，可以通过修改实例或数据的形式来更改显示内容。

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Hello Vue</title>
    <script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
</head>
<body>
    <div id="app">
        <h1> {{ title }} </h1>
        <p> {{ message }} </p>
    </div>

<script type="application/javascript">
    const data = {
        title: "Hello World!",
        message: "Hello World! Welcome to vue.js",
    };
    const vm = new Vue({
        el: "#app",
        data: data
    });
    // vm.title = "Hello World!";
    data.title = "Hello Vue!";
</script>
</body>
</html>
```

如果想要显示和修改数据，则必须在创建 vue 实例前创建这个变量，否者是无效的。

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Hello Vue</title>
    <script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
</head>
<body>
    <div id="app">
        <h1> {{ title }} </h1>
        <p> {{ message }} </p>
    </div>

<script type="application/javascript">
    const data = {
        title: "Hello World!",
    };
    const vm = new Vue({
        el: "#app",
        data: data
    });
    // vm.message = "Hello World! Welcome to vue.js";
    data.message = "Hello World! Welcome to vue.js";
</script>
</body>
</html>
```

watch 方法可以监听某个变量的变化：

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Hello Vue</title>
    <script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
</head>
<body>
<div id="app">
    <h1> {{ title }} </h1>
    <p> {{ message }} </p>
</div>

<script type="application/javascript">
    const data = {
        title: "Hello World!",
        message: "Hello World! Welcome to vue.js",
    };
    const vm = new Vue({
        el: "#app",
        data: data
    });
    vm.$watch("title", function (newVal, oldVal) {
        console.log("newVal:\t", newVal);
        console.log("oldVal:\t", oldVal);
    });
</script>
</body>
</html>
```

## 生命周期

![](https://cn.vuejs.org/images/lifecycle.png)

## 模版语法

### 文本

使用双大括号包裹，变量 meg 的内容会被渲染进视图。

```html
<span>Message: {{ msg }}</span>
```

使用 `v-once` 能执行一次性地插值，当数据改变时，插值处的内容不会更新。

```html
<span v-once>这个将不会改变: {{ msg }}</span>
```

<!-- 如果需要在 html 中使用双大括号，使用 `v-html` 指令。 -->

```html
<p>Using mustaches: {{ rawHtml }}</p>
<p>Using v-html directive: <span v-html="rawHtml"></span></p>
```









