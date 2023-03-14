---
title: "Install qBittorrent-nox Inside Docker"
date: 2023-03-14T20:27:07+08:00
draft: false
ShowToc: true
categories: [Linux]
tags: [docker,qBittorrent,qBittorrent-nox]
cover:
    image: "images/docker-qbittorrent.png"
    alt: "Docker qBittorrent-nox"
    relative: false
---

## Install docker

You need to install docker first before get started.

Take fedora as an example, just simply run these command:

```bash
# First, remove old docker packages
sudo dnf remove docker \
                  docker-client \
                  docker-client-latest \
                  docker-common \
                  docker-latest \
                  docker-latest-logrotate \
                  docker-logrotate \
                  docker-selinux \
                  docker-engine-selinux \
                  docker-engine

# Install latest docker via dnf package manager
# Set up the repository
sudo dnf -y install dnf-plugins-core
sudo dnf config-manager \
    --add-repo \
    https://download.docker.com/linux/fedora/docker-ce.repo
# Install Docker Engine
sudo dnf install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Start Using Docker
# Start Docker
sudo systemctl start docker
# Start Docker As System Boot
sudo systemctl enable docker
# Test If Docker Works
sudo docker run hello-world
```

View [Docs](https://docs.docker.com/engine/install/ubuntu/) for more detail about how to install docker in ubuntu system.

## Install qBittorrent-nox

Here is the *docker-compose* file, save it as `qbt-docker-compose.yaml`.

```yaml
version: '3.9'
services:
  qbt:
    container_name: qbittorrent-nox
    image: qbittorrentofficial/qbittorrent-nox
    ports:
      # web ui port
      - 8080:8080/tcp
      # for bittorrent traffic
      - 6881:6881/tcp
      - 6881:6881/udp
    environment:
      - TZ=Asia/Shanghai
      - UMASK_SET=022
      - QBT_EULA=accept
      - QBT_VERSION=latest
      - QBT_WEBUI_PORT=8080
    tty: true
    stop_grace_period: 30m
    tmpfs:
      - /tmp
    volumes:
      - ./config:/config:rw
      - ./downloads:/downloads:rw
```

You can edit this *docker-compose* file if you want.

Start to test your qBittorrent-nox with bellow command:

```bash
docker-compose -f qbt-docker-compose.yaml up
```

Open your browser and visit <http://127.0.0.1:8080>, the default user is `admin`, password is `adminadmin`.

If everything goes right, use `Ctrl-C` to stop it. Run this command to make it running in detached mode:

```bash
docker-compose -f qbt-docker-compose.yaml up -d
```

## Transfer

If you have qBittorrent-nox running in an old device, where have a lot of torrent files seeding, with multicategory classified, and you want it running in docker and transfer them into a new device. It is really a nightmare to add all of them back manually, so here is how you can transfer them without any misery.

Stop your old qBittorrent-nox service:

```bash
systemctl stop qbittorrent-nox.service
```

Copy all config file inside `$HOME/.config` and `$HOME/.local`, we will use them later on. The `$HOME` directory is the home of qBittorrent-nox user. For example, I run qBittorrent-nox in user `qbittorrent-nox` so the `$HOME` will be `/home/qbittorrent-nox`.

Copy all of your bt file into your new device. If you keep all of your bt file inside a Portable HDD or SSD, plug it in your new device and mount it properly.

Install docker and start a qBittorrent-nox service first like I said before.

```bash
docker-compose -f qbt-docker-compose.yaml up
```

After it runs correctly, stop it via `Ctrl-C`.

Copy all of the file inside `$HOME/.config` to `config/qBittorrent/config`.

Copy all of the file inside `$HOME/.local` to `config/qBittorrent/data`.

Edit `config/qBittorrent/config/qBittorrent.conf`, match all the port settings.

Make sure you have these config settings inside `config/qBittorrent/config/qBittorrent.conf`:

```conf
[LegalNotice]
Accepted=true
```

Edit the volumes to match your saved path.

```yaml
volumes:
  - ./config:/config:rw
  - /path/to/your/hhd:/pt/saved/path:ro
```

You can use read-only to keep your hhd data safe.

Run qBittorrent-nox again, if nothing goes wrong, run qBittorrent-nox in detached mode:

```bash
docker-compose -f qbt-docker-compose.yaml up -d
```
