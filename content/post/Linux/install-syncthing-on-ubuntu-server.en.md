---
title: "Install Syncthing on Ubuntu Server"
date: 2023-07-14T16:40:36+08:00
draft: false
ShowToc: true
categories: [Linux]
tags: [tools,syncthing]
cover:
    image: "images/ubuntu-syncthing.svg"
    alt: "Ubuntu Syncthing"
    relative: false
---

## Install Syncthing

[Debian/Ubuntu installation instructions](https://apt.syncthing.net/)

Import PGP keys

```bash
# Add the release PGP keys:
sudo curl -o /usr/share/keyrings/syncthing-archive-keyring.gpg https://syncthing.net/release-key.gpg
```

Add APT source

```bash
# Add the "stable" channel to your APT sources:
echo "deb [signed-by=/usr/share/keyrings/syncthing-archive-keyring.gpg] https://apt.syncthing.net/ syncthing stable" | sudo tee /etc/apt/sources.list.d/syncthing.list
```

Install Syncthing

```bash
# Update and install syncthing:
sudo apt-get update
sudo apt-get install syncthing
```

## Install systemd unit

Download service file

```bash
wget https://github.com/syncthing/syncthing/blob/main/etc/linux-systemd/system/syncthing%40.service
```

Install service file

```bash
sudo chown root:root syncthing@.service
sudo mv syncthing@.service /etc/systemd/system/
sudo systemctl daemon-reload
```

Enable service

```bash
sudo systemctl enable syncthing@aimer
sudo systemctl start syncthing@aimer
```

## Enable remote access on server

Edit config file at `$HOME/.config/syncthing/config.xml`

```bash
vim ~/.config/syncthing/config.xml
```

Change this line to `0.0.0.0:8384`

```xml
    <address>127.0.0.1:8384</address>
```

Restart syncthing

```bash
sudo systemctl restart syncthing@aimer
```

## Configuration

Open your gui page and set a password, then link your device and enjoy it!

![Syncthing Link](/images/syncthing-link.png)

## Link

- [YouTube - Syncing your Files Across ALL your Computers via Syncthing](https://www.youtube.com/watch?v=J1bCWv14zYg)
