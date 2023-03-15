---
title: "Install Filebrowser on Ubuntu Server"
date: 2022-11-18T16:37:27+08:00
draft: false
ShowToc: true
categories: [Linux]
tags: [ubuntu,filebrowser]
cover:
    image: "images/ubuntu-filebrowser.png"
    alt: "Ubuntu Filebrowser"
    relative: false
---

## Install Filebrowser

Install file browser to your server:

```bash
curl -fsSL https://raw.githubusercontent.com/filebrowser/get/master/get.sh | bash
```

Have a quick test:

```bash
filebrowser -a 0.0.0.0 -r /path/to/your/files
```

Access your server and try to login in.

Username: `admin`\
Password: `admin`

## Create Your Own Config

Write your config file:

```bash
sudo mkdir /etc/filebrowser/
sudo vim /etc/filebrowser/.filebrowser.yaml
```

Write something like this:

```yaml
port: 8080
address: 0.0.0.0
root: /path/to/your/file
database: /etc/filebrowser/filebrowser.db
```

## Create Service

Write a service file:

```bash
sudo vim /etc/systemd/system/filebrowser.service
```

Write something like this:

```service
[Unit]
Description=File Browser Service
After=network.target

[Service]
Type=simple
Restart=on-failure
RestartSec=5s
ExecStart=filebrowser

[Install]
WantedBy=multi-user.target
```

Start and enable it:

```bash
sudo systemctl start filebrowser.service
sudo systemctl enable filebrowser.service
```

Make sure to change your access password!

## Link

- [File Browser](https://filebrowser.org/)
