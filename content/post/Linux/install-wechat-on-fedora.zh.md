---
title: "在 Fedora 系统上安装微信"
date: 2022-11-10T12:03:27+08:00
draft: false
ShowToc: true
categories: [Linux]
tags: [wechat,fedora,wine]
cover:
    image: "images/fedora-wechat.svg"
    alt: "Fedora WeChat"
    relative: false
---

# 在 Fedora 系统上运行微信

## 安装 wine

```bash
sudo dnf install wine
```

## 调整缩放比例

输入下面的指令打开 winecfg

```bash
winecfg
```

在 `Graphics` 一栏中调整合适的 dpi 以保证有舒适的使用体验。（4k 屏幕，192 dpi）

## 下载并配置字体

依次执行如下指令即可

```bash
sudo dnf install cabextract
```

```bash
sudo dnf install winetricks
```

```bash
winetricks corefonts gdiplus riched20 riched30
```

## 下载并安装微信

直接下载官方的 exe 安装包（在网页下载也是一样的）

```bash
wget https://dldir1.qq.com/weixin/Windows/WeChatSetup.exe
```

使用 wine 启动微信

```bash
wine ./WeChatSetup.exe
```

接下来按照 Windows 的安装逻辑点击下一步安装好微信

安装结束后可以删除安装包

## 修改语言设置

修改这个文件

```bash
vim ~/.local/share/applications/wine/Programs/WeChat/WeChat.desktop
```

调整 `Exec` 这一部分，添加如下环境变量

```bash
env LC_ALL="zh_CN.UTF8" 
```

最终结果应该是这样（注意路径）

```desktop
[Desktop Entry]
Name=WeChat
Exec=env LC_ALL="zh_CN.UTF8" env WINEPREFIX="/home/aimer/.wine" wine C:\\\\ProgramData\\\\Microsoft\\\\Windows\\\\Start\\ Menu\\\\Programs\\\\WeChat\\\\WeChat.lnk
Type=Application
StartupNotify=true
Path=/home/aimer/.wine/dosdevices/c:/Program Files (x86)/Tencent/WeChat
Icon=E03C_WeChat.0
StartupWMClass=wechat.exe
```

## 启动微信

安装过程中会自动添加 desktop 文件，直接打开即可。

## 已知问题

1. 只能使用中文，使用英文时无法正常显示中文字符
2. 表情包的名称显示不正常
3. 通过微信调用的进程会携带中文的环境变量
4. 程序窗口被覆盖后窗口阴影依然显示在最前
5. 小程序有可能闪退

## 替代方案

### nspawn

如果你不介意安装一个 systemd-nspawn 的容器的话，可以尝试这个项目：

- [GitHub - loaden/nspawn-qq](https://github.com/loaden/nspawn-qq)

### 社区包

请参考这篇博客文章：

- [XUTHUS - fedora 安装微信和企业微信](https://www.xuthus.cc/linux/fedora34-install-wechat.html)

# 参考链接

- [AnduinXue - Run WeChat in Ubuntu](https://anduin.aiursoft.cn/post/2022/7/25/run-wechat-in-ubuntu)
