---
title: "在 Ubuntu 服务器上安装 qBittorrent-nox"
date: 2022-11-11T15:34:47+08:00
draft: false
ShowToc: true
categories: [Linux]
tags: [ubuntu,qBittorrent,qBittorrent-nox]
cover:
    image: "images/ubuntu-qbittorrent.svg"
    alt: "Ubuntu qBittorrent-nox"
    relative: false
---

# 在 Ubuntu 服务器上安装 qBittorrent-nox

### 更新系统

```bash
sudo apt update && sudo apt upgrade -y
```

### 导入 qBittorrent-nox 稳定版本的源

``` bash
sudo add-apt-repository ppa:qbittorrent-team/qbittorrent-stable -y
```

### 导入 qBittorrent-nox 非稳定版本的源（每夜版）

```bash
sudo add-apt-repository ppa:qbittorrent-team/qbittorrent-unstable -y
```

### 更新源

```bash
sudo apt update
```

### 安装 qBittorrent-nox

```bash
sudo apt install qbittorrent-nox -y
```

### 创建用户和用户组

```bash
sudo adduser --system --group qbittorrent-nox
```

```bash
# on fedora
sudo groupadd qbittorrent-nox
```

### 将你添加到用户组中

```bash
sudo adduser your-username qbittorrent-nox
```

```bash
# on fedora
sudo usermod -aG qbittorrent-nox your-username
```

### 创建 service 文件

```bash
sudo vim /etc/systemd/system/qbittorrent-nox.service
```

```service
[Unit]
Description=qBittorrent Command Line Client
After=network.target

[Service]
Type=forking
User=qbittorrent-nox
Group=qbittorrent-nox
UMask=007
ExecStart=/usr/bin/qbittorrent-nox -d --webui-port=8080
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

### 重载 systemctl

```bash
sudo systemctl daemon-reload
```

### 启动 qBittorrent-nox

```bash
sudo systemctl start qbittorrent-nox
```

### 开启开机自启动 qBittorrent-nox

```bash
sudo systemctl enable qbittorrent-nox
```

### 检查 qBittorrent-nox 是否启动

```bash
systemctl status qbittorrent-nox
```

### 登录到 qBittorrent-nox

| Item     | Value      |
| -------- | ---------- |
| username | admin      |
| password | adminadmin |

---

### 如何删除 qBittorrent-nox

```bash
# Remove qBittorrent Stable
sudo add-apt-repository --remove ppa:qbittorrent-team/qbittorrent-stable
# Remove qBittorrent Unstable (Nightly)
sudo add-apt-repository --remove ppa:qbittorrent-team/qbittorrent-unstable -y
# Remove qBittorrent
sudo apt autoremove qbittorrent-nox
```
