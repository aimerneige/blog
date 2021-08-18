---
title: "在 Windows10 安装和配置 alacritty"
date: 2020-10-22T15:15:19+08:00
draft: false
ShowToc: false
categories: [Others]
tags: [software,windows]
---

> 注意将本文章提到的路径中 `AimerNeige` 修改为自己的用户名，之后不再赘述。

## 安装 alacritty

按照自己的喜好 在 [GitHub](https://github.com/alacritty/alacritty) 下载最新版 [release](https://github.com/alacritty/alacritty/releases) 或自己编译。

本次演示中可执行文件存储目录：

`‪C:\Tools\Alacritty\alacritty.exe`

## 配置 alacritty

将配置文件放置在如下目录：

`C:\Users\AimerNeige\AppData\Roaming\alacritty\alacritty.yml`

配置方法和 Linux 下类似。

[我的配置文件](https://github.com/aimerneige/alacritty)

## 将 alacrity 注册为右键菜单启动

新建文本文件，填入如下内容，修改后缀为 `.reg` 运行，将配置写入注册表。

```
Windows Registry Editor Version 5.00

[HKEY_CLASSES_ROOT\Directory\Background\shell\alacritty]
@="Alacritty terminal here"
"Icon"="C:\\Tools\\Alacritty\\alacritty.ico"

[HKEY_CLASSES_ROOT\Directory\Background\shell\alacritty\command]
@="C:\\Tools\\Alacritty\\alacritty.exe"
```

当然，你也可以按照自己的喜好手动编辑注册表。

其中 `Icon` 这一行中使用的的图标文件可以在 [GitHub 官方仓库](https://raw.githubusercontent.com/alacritty/alacritty/master/extra/windows/alacritty.ico) 下载，或者也可以使用自己喜欢的内容。

你也可以将 `@="Alacritty terminal here"` 修改为自己喜欢的内容。
