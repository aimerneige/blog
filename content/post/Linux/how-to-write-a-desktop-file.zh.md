---
title: "如何编写 .desktop 文件"
date: 2023-01-25T14:41:12+08:00
draft: false
ShowToc: true
categories: [Linux]
tags: [desktop,application]
cover:
    image: "images/linux-desktopfile.png"
    alt: "Desktop File"
    relative: false
---

# 前言

在 Linux 系统中，经常会遇到一些软件只提供了可执行文件，而并没有提供可以通过包管理安装的途径，常见于 AppImage 封装的软件，这时候每次需要运行软件都需要通过终端来执行，非常麻烦。不过这个问题可以通过手动编写 .desktop 文件来解决，这样这些可执行文件就可以和其他软件一样拥有桌面图标。

# 用法

使用 vim 或其他文本编辑器直接编写 `.desktop` 文件后将其置于如下路径之一即可：

- `/usr/share/applications/`
- `/usr/local/share/applications/`
- `~/.local/share/applications/`

# 示例

## 来自 Arch Linux Wiki 的示例

```desktop
[Desktop Entry]

# The type as listed above
Type=Application

# The version of the desktop entry specification to which this file complies
Version=1.0

# The name of the application
Name=jMemorize

# A comment which can/will be used as a tooltip
Comment=Flash card based learning tool

# The path to the folder in which the executable is run
Path=/opt/jmemorise

# The executable of the application, possibly with arguments.
Exec=jmemorize

# The name of the icon that will be used to display this entry
Icon=jmemorize

# Describes whether this application needs to be run in a terminal or not
Terminal=false

# Describes the categories in which this entry should be shown
Categories=Education;Languages;Java;
```

其中，`Type` 和 `Name` 是必须的，其他都是可选项。

## Fluent Reader

[Fluent Reader](https://hyliu.me/fluent-reader/) 是一款开源的 rss 阅读器，它有非常精美的界面，也支持包括 Linux 在内的全部桌面平台，但是它在 Linux 下只提供了 AppImage 格式的封包，虽然可以方便支持全部 Linux 平台但是如果不写 .desktop 文件每次启动都需要开终端很麻烦，这里以它为例来编写一个 .desktop 文件。

### 下载

首先自然是下载软件，在 [release](https://github.com/yang991178/fluent-reader/releases) 界面下载最新的 AppImage 文件即可。将其存储在适合的路径下即可，本文以 `~/Software/Fluent-Reader` 为例。

### 给予可执行权限

不要忘记使用 chmod 指令给刚下载的 AppImage 文件赋予可执行权限。

```bash
chmod +x Fluent.Reader.1.1.3.AppImage
```

### 准备一个图标

一般地，在 GitHub 可以轻松找到软件的图标。

```bash
wget https://raw.githubusercontent.com/yang991178/fluent-reader/master/build/icon.png
```

### 编写 .desktop 文件

```bash
vim ~/.local/share/applications/fluent-reader.desktop
```

```bash
[Desktop Entry]
Categories=Network;News;
Exec=/home/aimer/Software/Fluent-Reader/Fluent.Reader.1.1.3.AppImage
Icon=/home/aimer/Software/Fluent-Reader/icon.png
Name=Fluent Reader
Comment=A modern desktop RSS reader
StartupNotify=true
Terminal=false
Type=Application
```

## Categories

> https://specifications.freedesktop.org/menu-spec/latest/apa.html

| Main Category | Description                                                                    | Notes |
| ------------- | ------------------------------------------------------------------------------ | ----- |
| AudioVideo    | Application for presenting, creating, or processing multimedia (audio/video)   |       |
| Audio         | An audio application                                                           |  	Desktop entry must include AudioVideo as well     |
| Video         | A video application                                                            |   	Desktop entry must include AudioVideo as well    |
| Development   | An application for development                                                 |       |
| Education     | Educational software                                                           |       |
| Game          | A game                                                                         |       |
| Graphics      | Application for viewing, creating, or processing graphics                      |       |
| Network       | Network application such as a web browser                                      |       |
| Office        | An office type application                                                     |       |
| Science       | Scientific software                                                            |       |
| Settings      | Settings applications                                                          |       |
| System        | System application, "System Tools" such as say a log viewer or network monitor |       |
| Utility       | Small utility application, "Accessories"                                       |       |

# 参考链接

- [Arch Linux Wiki - Desktop entries](https://wiki.archlinux.org/title/desktop_entries)
- [A. Registered Categories](https://specifications.freedesktop.org/menu-spec/latest/apa.html)
