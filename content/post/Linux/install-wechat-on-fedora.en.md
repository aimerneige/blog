---
title: "Install WeChat on Fedora"
date: 2022-11-10T12:03:30+08:00
draft: false
ShowToc: true
categories: [Linux]
tags: [wechat,fedora,wine]
cover:
    image: "images/fedora-wechat.svg"
    alt: "Fedora WeChat"
    relative: false
---

# Install WeChat on Fedora

## Install Wine

```bash
sudo dnf install wine
```

## Adjust DPI Config

Use bellow command to open winecfg

```bash
winecfg
```

Adjust the dpi to a suitable value at tab `Graphics`. (4k monitor, 192 dpi)

## Download And Config Fonts

Run the following commands

```bash
sudo dnf install cabextract
```

```bash
sudo dnf install winetricks
```

```bash
winetricks corefonts gdiplus riched20 riched30
```

## Download & Install WeChat

Just download the exe Installer. (Same with download it from browser.)

```bash
wget https://dldir1.qq.com/weixin/Windows/WeChatSetup.exe
```

Star WeChat Installer with wine:

```bash
wine ./WeChatSetup.exe
```

Then install it as in Windows.

After installed, you can delete the installer file.

## Adjust language Settings

Edit this file:

```bash
vim ~/.local/share/applications/wine/Programs/WeChat/WeChat.desktop
```

Change the part `Exec` , add a new enviroment variable:

```bash
env LC_ALL="zh_CN.UTF8" 
```

The finally result should like this: (note for the path)

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

## Start WeChat

Durning the install process, a desktop file has been added to your system. Just open it as a normal application.

## Know Issue

1. You can only use Chinese. Chinese characters will not display properly when you set language settings to English
2. The name of the sticker can not be displayed properly
3. The program launched by WeChat will be in Chinese
4. The shadow of the WeChat's windows still at the top of other program
5. The mini-program might not work

## Alternative

If you don't mind installing a nspawn sub-system into your computer, try this awesome project:

- [GitHub - loaden/nspawn-qq](https://github.com/loaden/nspawn-qq)

# Refer Link

- [AnduinXue - Run WeChat in Ubuntu](https://anduin.aiursoft.cn/post/2022/7/25/run-wechat-in-ubuntu)