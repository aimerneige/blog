---
title: "Add Friend Link in PaperMod Blog"
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

PaperMod is a good hugo blog theme, but it did not support a friend link officially. So you need to do some simple customize.

## Full Code

Put this shortcode into `layouts/shortcodes/friends.html`

{{< gist aimerneige f4929c8c17b36aa0ce301e84e39aae0b >}}

## Usage

Add your friends in `data/friends.yml` like this:

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
