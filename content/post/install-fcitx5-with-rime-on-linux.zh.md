---
title: "Linux 下安装 fcitx5 与 Rime"
date: 2020-12-13T19:35:18+08:00
draft: false
ShowToc: true
description: "Linux 下中文输入法安装"
categories: [Linux]
tags: [software,tool]
cover:
    image: "images/rime.png"
    alt: "Rime logo"
    caption: "rime logo"
    relative: false
---

## 前言

Linux 下中文输入法一直是硬伤，各种方面都没有 windows 或 mac 下好用，最近在逛 github 的时候偶然翻到一个仓库 **[四叶草拼音输入方案](https://github.com/fkxxyz/rime-cloverpinyin)**，这个仓库提供的输入方案用起来十分舒服，但是在安装的时候也遇到一些坑，于是写了这篇文章来记录。

> 测试环境：
>
> ```bash
> ..............                                     aimerneige@an
>             ..,;:ccc,.                             -------------
>           ......''';lxO.                           OS: Kali GNU/Linux Rolling x86_64
> .....''''..........,:ld;                           Host: TM1701
>            .';;;:::;,,.x,                          Kernel: 5.9.0-kali4-amd64
>       ..'''.            0Xxoc:,.  ...              Uptime: 2 hours, 11 mins
>   ....                ,ONkc;,;cokOdc',.            Packages: 3537 (dpkg)
>  .                   OMo           ':ddo.          Shell: zsh 5.8
>                     dMc               :OO;         Resolution: 1920x1080, 1440x2560
>                     0M.                 .:o.       DE: GNOME 3.38.2
>                     ;Wd                            WM: Mutter
>                      ;XO,                          WM Theme: Kali-Dark
>                        ,d0Odlc;,..                 Theme: Kali-Dark [GTK2/3]
>                            ..',;:cdOOd::,.         Icons: Flat-Remix-Blue-Dark [GTK2/> 3]
>                                     .:d;.':;.      Terminal: gnome-terminal
>                                        'd,  .'     CPU: Intel i7-8550U (8) @ 4.000GHz
>                                          ;l   ..   GPU: NVIDIA GeForce MX250
>                                           .o       GPU: Intel UHD Graphics 620
>                                             c      Memory: 3698MiB / 15899MiB
>                                             .'
>                                              .
> ```

## 安装 fcitx5

```bash
sudo apt install fcitx5
```

## 启用 fcitx5

```bash
im-config
```

在开启的图形化界面中启用 fcitx5

## 配置 fcitx5

编辑文件 `~/.xprofile` 写入如下内容：

```bash
export GTK_IM_MODULE=fcitx5
export QT_IM_MODULE=fcitx5
export XMODIFIERS="@im=fcitx5"

export LANG="zh_CN.UTF-8"
export LC_CTYPE="zh_CN.UTF-8"
```

编辑完成后注销账户，重新启动桌面

## 安装 rime

```
sudo apt install fcitx5-rime
```

## 启用 rime

在托盘处点击配置，并添加 rime。

如果你的系统和我一样是英文，取消勾选“Only Show Current Language”即可查看中文选项

更快地，你可以直接在上面的搜索框搜索 Rime

## 安装输入方案

安装 [四叶草拼音输入方案](https://github.com/fkxxyz/rime-cloverpinyin) 提供的输入方案

具体安装方法查看 [项目 wiki](https://github.com/fkxxyz/rime-cloverpinyin/wiki)

## 更换简体中文

按下 Ctrl + ` 将输入模式切换为简体中文

你也可以按照自己的喜好更改全角/半角的设置

## 后记

如果你在安装中遇到任何问题，请查阅 [fcitx](https://www.fcitx-im.org/wiki/Special:MyLanguage/Fcitx) [rime](https://rime.im/docs/) [四叶草拼音输入方案](https://github.com/fkxxyz/rime-cloverpinyin/wiki) 提供的文档。

或是在 Arch Wiki 上查阅相关内容。
