---
title: "使用 ProgressDialog 实现加载提示"
date: 2020-02-20T23:40:51+08:00
draft: false
ShowToc: true
categories: [Android]
tags: [android]
---

在进行一些耗时操作的时候，经常需要加载提示框来提醒用户当前在进行耗时操作，需要等待。

而实现这样一个加载框十分简单。

## 构建 `ProgressDialog` 对象

你可以在耗时操作开始前临时建立新的 `ProgressDialog` 对象，你也同样可以在 Activity 中构建 `ProgressDialog` 的引用，并在 `OnCreate` 方法内构建实体，在需要的时候直接显示和隐藏。

其中前者相对灵活，但是使用范围有限，后者使用范围较广，但是可以会使得 `OnCreate` 中的代码较为繁琐。

但是，不管使用那种方法，`ProgressDialog` 的构建都是非常简单。

```java
    ProgressDialog progressDialog;
    progressDialog = new ProgressDialog(MainActivity.this);
    // ProgressDialog progressDialog = new ProgressDialog(MainActivity.this);
    progressDialog.setTitle("This is Title");
    progressDialog.setMessage("This is Message");
    progressDialog.setCancelable(true);
```

其他属性可自行探索或者查阅官方文档

## 显示加载框

在耗时操作开始前(或者任何你想要显示提示框的地方)，通过以下操作显示加载框:

```java
    progressDialog.show();
```

## 关闭提示框

在耗时操作关闭时(或者任何你想要关闭提示框的地方)，通过以下操作关闭加载框:

```java
    progressDialog.hide();
```

很简单不是吗<sub><sub>又水了一期，不过好像没人看我的博客</sub></sub>
