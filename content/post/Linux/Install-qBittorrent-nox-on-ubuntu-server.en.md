---
title: "Install qBittorrent-nox on Ubuntu Server"
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

# Install qBittorrent-nox on Ubuntu Server

### Update ubuntu

```bash
sudo apt update && sudo apt upgrade -y
```

### Import qBittorrent-nox Stable

``` bash
sudo add-apt-repository ppa:qbittorrent-team/qbittorrent-stable -y
```

### Import qBittorrent-nox Unstable (Nightly)

```bash
sudo add-apt-repository ppa:qbittorrent-team/qbittorrent-unstable -y
```

### Reflect the newly added PPA

```bash
sudo apt update
```

### Install qBittorrent-nox

```bash
sudo apt install qbittorrent-nox -y
```

### Create usergroup

```bash
sudo adduser --system --group qbittorrent-nox
```

```bash
# on fedora
sudo groupadd qbittorrent-nox
```

### Add you to usergroup

```bash
sudo adduser your-username qbittorrent-nox
```

```bash
# on fedora
sudo usermod -aG qbittorrent-nox your-username
```

### Create a systemd service file

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
UMask=022
ExecStart=/usr/bin/qbittorrent-nox -d --webui-port=8080
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

### Reload systemctl

```bash
sudo systemctl daemon-reload
```

### Start qBittorrent-nox

```bash
sudo systemctl start qbittorrent-nox
```

### Enable qBittorrent-nox

```bash
sudo systemctl enable qbittorrent-nox
```

### Check if qBittorrent-nox start

```bash
systemctl status qbittorrent-nox
```

### Login in to your qBittorrent-nox

| Item     | Value      |
| -------- | ---------- |
| username | admin      |
| password | adminadmin |

---

### How to Remove qBittorrent-nox

```bash
# Remove qBittorrent Stable
sudo add-apt-repository --remove ppa:qbittorrent-team/qbittorrent-stable
# Remove qBittorrent Unstable (Nightly)
sudo add-apt-repository --remove ppa:qbittorrent-team/qbittorrent-unstable -y
# Remove qBittorrent
sudo apt autoremove qbittorrent-nox
```
