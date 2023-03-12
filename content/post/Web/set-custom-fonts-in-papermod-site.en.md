---
title: "Set Custom Fonts in PaperMod Site"
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

## Download fonts

Download the fonts you need and put it into `static/fonts`

## Import your fonts

```css
@font-face {
  font-family: "LXGWWenKai-Regular";
  src: url("/fonts/lxgw-wenkai/LXGWWenKai-Regular.ttf") format("truetype");
}
```

## Apply it in css

```css
body {
  font-family: LXGWWenKai-Regular;
}
```

## Use in PaperMod

Put your own css file in `assets/css/extended/custom_fonts.css`

## Import multi-weight fontfamily

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

## Use cdn

```css
@import url('https://cdn.jsdelivr.net/npm/jetbrains-mono@1.0.6/css/jetbrains-mono.min.css');

code {
  font-family: 'JetBrains Mono';
}
```

## Links

- [Sulv's Blog - Hugo博客自定义字体](https://www.sulvblog.cn/posts/blog/hugo_change_font/)
- [PaperMod - FAQs](https://adityatelange.github.io/hugo-PaperMod/posts/papermod/papermod-faq/#bundling-custom-css-with-themes-assets)
- [StackOverflow - Using custom fonts using CSS?](https://stackoverflow.com/questions/12144000/using-custom-fonts-using-css)
- [StackOverflow - Multiple font-weights, one @font-face query](https://stackoverflow.com/questions/28279989/multiple-font-weights-one-font-face-query)
- [GitHub - lxgw/LxgwWenKai](https://github.com/lxgw/LxgwWenKai)
