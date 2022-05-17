---
title: "Install WSA With Google Play Store and Root"
date: 2022-05-17T23:13:13+08:00
draft: false
ShowToc: true
categories: [Windows]
tags: [wsa]
cover:
    image: "images/wsl-play-store-magisk.webp"
    alt: "wsl play-store magisk"
    relative: false
---

## Install

1. Uninstall old wsa (if you have)
2. make sure you have `Virtual Machine Platform` enabled on `Turn Windows features on or off`
3. fork this repo: https://github.com/LSPosed/MagiskOnWSA
4. build it with actions
5. download build result
6. run the install script
7. start the wsa and enjoy it

## Enable usb debug

1. Open wsa settings, enable `Developer Mode`
2. copy wsa ip address
3. `adb connect WSA-IP-ADDRESS`
