---
title: "在 PaperMod 博客中设置自定义字体"
date: 2023-03-02T20:54:06+08:00
draft: false
ShowToc: true
categories: [Web]
tags: [blog,papermod,fonts,css]
cover:
    image: "images/lxgw.png"
    alt: "lxgw"
    relative: false
---

## 下载字体

下载你需要的字体，并存储在 `static/fonts`

## 导入字体

```css
@font-face {
  font-family: "LXGWWenKai-Regular";
  src: url("/fonts/lxgw-wenkai/LXGWWenKai-Regular.ttf") format("truetype");
}
```

## 应用字体

```css
body {
  font-family: LXGWWenKai-Regular;
}
```

## 在 PaperMod 中应用

把你自己的 css 文件文件放在 `assets/css/extended/custom_fonts.css`

## 导入多字重的字体文件

```css
@font-face {
  font-family: "LXGWWenKai";
  src: url("/fonts/lxgw-wenkai/LXGWWenKai-Light.ttf") format("truetype");
  font-weight: lighter;
  font-style: normal;
}

@font-face {
  font-family: "LXGWWenKai";
  src: url("/fonts/lxgw-wenkai/LXGWWenKai-Regular.ttf") format("truetype");
  font-weight: normal;
  font-style: normal;
}

@font-face {
  font-family: "LXGWWenKai";
  src: url("/fonts/lxgw-wenkai/LXGWWenKai-Bold.ttf") format("truetype");
  font-weight: bold;
  font-style: normal;
}
```

## 使用 CDN

```css
@import url('https://cdn.jsdelivr.net/npm/jetbrains-mono@1.0.6/css/jetbrains-mono.min.css');

code {
  font-family: 'JetBrains Mono';
}
```

## 参考链接

- [Sulv's Blog - Hugo博客自定义字体](https://www.sulvblog.cn/posts/blog/hugo_change_font/)
- [PaperMod - FAQs](https://adityatelange.github.io/hugo-PaperMod/posts/papermod/papermod-faq/#bundling-custom-css-with-themes-assets)
- [StackOverflow - Using custom fonts using CSS?](https://stackoverflow.com/questions/12144000/using-custom-fonts-using-css)
- [StackOverflow - Multiple font-weights, one @font-face query](https://stackoverflow.com/questions/28279989/multiple-font-weights-one-font-face-query)
- [GitHub - lxgw/LxgwWenKai](https://github.com/lxgw/LxgwWenKai)
