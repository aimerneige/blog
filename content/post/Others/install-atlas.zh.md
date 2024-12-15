---
title: "Install Atlas"
date: 2024-02-06T08:06:29Z
draft: false
ShowToc: true
description: "F**k Windows Upgrade to Atlas"
categories: [Others]
tags: [windows]
cover:
    image: "images/atlasos.webp"
    alt: "Atlas OS"
    relative: false
---

## 前言

受够了 Windows 永无止境更新？受够了 Windows 乱七八糟的各种预装软件？受够了微软的套壳浏览器占用系统资源？只想要一个干净的系统打游戏？或者你的电脑比较老旧跑新版本的 Windows 有点卡顿？你需要 Atlas OS！

## 什么是 Atlas OS

Atlas OS 是一个基于 Windows 10 定制的操作系统，旨在为游戏玩家提供更优秀的游戏性能和更低的延迟。它删除了许多非必要的系统组件和后台进程，从而节省了大量系统资源，使其更适合于专门的游戏 PC 或 Steam Deck 等游戏主机。Atlas OS 是一个开源、免费的项目，旨在优化性能、隐私和安全。

## 如何下载

不同于常规的操作系统，Atlos OS 没有提供 iso 选项，这是由于对 Windows 镜像进行修补并再分发违反了微软的协议，Atlos OS 官方无法直接提供修改过后的系统。相反，你需要下载如下文件：

1. [AME Wizard](https://download.ameliorated.io/AME%20Wizard%20Beta.zip)
2. [Atlas Playbook](https://cdn.jsdelivr.net/atlas/0.3.2/AtlasPlaybook_v0.3.2.zip)

上面的文件在 [Atlas OS 官网](https://atlasos.net/) 首页即可找到，请尽量前往官网下载更新版本的 Atlos OS。其中 **AME Wizard** 相当于是安装器，而 **Atlas Playbook** 相当于是安装脚本。

安装完 Windows 后，运行 **AME Wizard**，它会按照 **Atlas Playbook** 对系统进行一系列的魔改，以实现安装的目的，并规避版权问题。

Atlas OS 删除了很多系统的功能，它甚至删除了蓝牙和 WiFi 功能，可谓是极致极简。如果你对某些功能有需求，可以在安装完成后执行 Atlos OS 提供的脚本恢复你想要的功能。

## 安装步骤

1. 按照正常流程安装 Windows 10 22H2
2. 安装过程断网，不登陆微软账号
3. 安装硬件驱动，确保电脑可以正常使用
4. 打开 AME 工具
5. 把 aptx 脚本拖入
6. 按照软件指示下一步
7. 重启后软件会自启动
8. 安装完成后可以删除安装工具
9.  执行桌面下 atlas 的脚本可以启用一些需要的功能

## 可能遇到的问题

在第 7 步可能会由于网络问题，程序会无限循环，这不是 Atlos OS 引发的问题，请使用畅通的国际网络。

## 参考链接

- [ATLAS](https://atlasos.net/)
- [Installing AtlasOS](https://docs.atlasos.net/getting-started/installation/)