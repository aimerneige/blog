---
title: "如何禁止电脑开机时自动连接蓝牙耳机"
date: 2023-04-17T17:49:10+08:00
draft: false
ShowToc: true
categories: [Linux]
tags: [GNOME,bluetooth]
---

## 前言

由于电子设备比较多，蓝牙耳机配对的设备也比较多，这就引起了一个问题，本来连着手机听歌听的好好的，电脑开机之后就会自动抢占蓝牙耳机的信号，导致我还得重新在手机上连接耳机，严重影响听歌体验，于是就查询了如何禁用电脑自动连接的行为，希望这篇文章对你也有用。

## 如何操作

编辑 `/etc/bluetooth/main.conf` 这个文件：

```bash
sudo vim /etc/bluetooth/main.conf
```

找到这些内容：

```conf
# AutoEnable defines option to enable all controllers when they are found.
# This includes adapters present on start as well as adapters that are plugged
# in later on. Defaults to 'true'.
# AutoEnable=true
```

修改配置文件，禁用自动连接：

```conf
AutoEnable=false
```

重启设备，测试效果。
