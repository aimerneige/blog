---
title: "Hello Hugo"
date: 2021-08-17T07:16:04+08:00
draft: false
ShowToc: true
description: "Install and Config hugo"
categories: [Others]
tags: [hugo,site]
cover:
    image: "images/hugo-logo-wide.svg"
    alt: "hugo-logo"
    relative: false
---

# Before Start

It’s been a long time since I wrote a blog post last time. That's because I often reinstall my system on computer, and every time I install and configure the blog of `hexo` on my computer is a troublesome thing. But recently, I discovered `hugo`, a simple and easy-to-use blog system, which can keep me away from `hexo`, which is slow and troublesome to configure and install. It has a great experience to use and I happened to change a blog theme, so I decided to use `hugo` to build my new blog. This article briefly introduces how to install and use `hugo`.

# Install

## You may need

1. golang
2. git
3. text editor you love

## You must needn't

1. nodejs
2. npm

![js joke](/images/node-models-black-hole.jpg)

## Install `hugo`

Install `hugo` is very simple. Take `fedora` system as an example, simply run this command:


```bash
sudo dnf install hugo
```

## Create Site Directory

Create your site directory with this command:

```bash
hugo new site blog
```

Change to work directory:

```bash
cd blog
```

Use git for version control:

```bash
git init
```

## Install Theme


Pick up your favorite theme, clone it into `./themes` directory directly.

```bash
git clone https://github.com/adityatelange/hugo-PaperMod themes/PaperMod --depth=1
```

> Use `--depth=1` to ignore the commit history.

Of course, you can download a zip file and unzip it.

If you wants to make version control more convenient and update more easily, use this command to add submodule:

```bash
git submodule add https://github.com/adityatelange/hugo-PaperMod.git themes/PaperMod
```

Clone submodules when reclone repo:

```bash
git submodule update --init --recursive
```

Update theme:

```bash
git submodule update --remote --merge
```

# Config

`hugo` support many config file format. The `yaml` file is more readable, so in the next article we will use `yaml`.

Different from `hexo`, you have only one config file, just follow you theme's doc and edit config file.

## Apply Theme

```yaml
theme: "PaperMod"
```

## Edit Theme Config

Different thems has different way to config, please follow your theme's doc.

Follow config for reference:

```yaml
baseURL: "https://aimerneige.com/"
languageCode: "en-us"
title: "AimerNeige's Blog"
theme: "PaperMod"

enableRobotsTXT: true
buildDrafts: false
buildFuture: false
buildExpired: false

defaultContentLanguage: en
defaultContentLanguageInSubdir: true

languages:
  en:
    languageName: "English"
    weight: 1
    menu:
      main:
        - name: About
          url: about/
          weight: 5
        - name: Friends
          url: friends/
          weight: 6
        - name: Post
          url: post/
          weight: 7
        - name: Archive
          url: archives/
          weight: 8
        - name: Tags
          url: tags/
          weight: 9
        - name: Categories
          url: categories/
          weight: 10
        - name: Search
          url: search/
          weight: 11
  zh:
    languageName: "中文"
    weight: 2
    menu:
      main:
        - name: 关于
          url: about/
          weight: 5
        - name: 朋友
          url: friends/
          weight: 6
        - name: 文章
          url: post/
          weight: 7
        - name: 归档
          url: archives/
          weight: 8
        - name: 标签
          url: tags/
          weight: 9
        - name: 分类
          url: categories/
          weight: 10
        - name: 搜索
          url: search/
          weight: 11
    params:
      profileMode:
        enabled: true
        title: "Aimer Neige"
        subtitle: "技术宅拯救世界"
        imageUrl: "https://avatars.githubusercontent.com/u/51701792?v=4"
        imageTitle: "avatar.jpeg"
        imageWidth: 140
        imageHeight: 140

params:
  env: production
  keywords: [Blog, OpenSource, Coding, Golang, Programming]
  author: "Aimer Neige"
  defaultTheme: auto
  disableThemeToggle: false

  ShowToc: true
  TocOpen: false
  ShowBreadCrumbs: true
  ShowReadingTime: false
  ShowPostNavLinks: true
  ShowShareButtons: false
  ShowCodeCopyButtons: true
  displayFullLangName: true

  editPost:
    URL: "https://github.com/aimerneige/blog/content"
    Text: "Suggest Changes"
    appendFilePath: true

  homeInfoParams:
    Title: "Aimer Neige"
    Content: "Tech Otakus Save The World"

  profileMode:
    enabled: true
    title: "Aimer Neige"
    subtitle: "Tech Otakus Save The World"
    imageUrl: "https://avatars.githubusercontent.com/u/51701792?v=4"
    imageTitle: "avatar.jpeg"
    imageWidth: 140
    imageHeight: 140

  socialIcons:
    - name: github
      url: "https://github.com/AimerNeige"
    - name: twitter
      url: "https://twitter.com/NeigeAimer"
    - name: steam
      url: "https://steamcommunity.com/id/AimerNeige"
    - name: Telegram
      url: "https://t.me/AimerNeige"
    - name: KoFi
      url: "https://ko-fi.com/aimerneige"
    - name: RsS
      url: "index.xml"

taxonomies:
  category: categories
  tag: tags
  series: series

outputs:
  home:
    - HTML
    - RSS
    - JSON
```

# Migrate

Copy your markdown file to new site directory and edit config.

# Test

Use this command to run a local test server:

```bash
hugo serve -D
```

# Deploy

Generate static file with this command:

```bash
hugo
```

Then public it to github:

```bash
cd public
git add -A
git commit -m "commit message"
git push
```
