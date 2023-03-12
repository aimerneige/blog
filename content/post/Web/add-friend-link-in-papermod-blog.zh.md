---
title: "在 PaperMod 博客中添加友链"
date: 2023-03-12T13:25:06+08:00
draft: false
ShowToc: true
categories: [Web]
tags: [blog,papermod,css]
cover:
    image: "images/friend-link.png"
    alt: "Friend Link"
    relative: false
---

PaperMod 是一个非常棒的博客主题，但是它不支持友链，所以你要自己写一些代码。

## 完整代码

把下面的代码存储在 `layouts/shortcodes/friends.html`

{{< gist aimerneige f4929c8c17b36aa0ce301e84e39aae0b >}}

## 用法

在 `data/friends.yml` 中添加你的友链数据，示例：

```yml
- title: "伞"
  intro: "一只咸鱼的学习记录"
  link: "https://umb.ink/"
  image: "https://avatars.githubusercontent.com/u/53655863?v=4"
- title: "HelloWorld的小博客"
  intro: "这里是一个小白的博客"
  link: "https://mzdluo123.github.io/"
  image: "https://avatars.githubusercontent.com/u/23146087?v=4"
```
