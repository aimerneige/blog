---
title: "Install and Configure Samba"
date: 2022-11-20T17:55:43+08:00
draft: false
ShowToc: true
categories: [Linux]
tags: [smb,fileshare]
cover:
    image: "images/Logo_Samba_Software.svg"
    alt: "Samba Logo"
    relative: false
---

# SMB File Share

## Update System

```bash
sudo apt update
```

## Install Samba

```bash
sudo apt install samba
```

## Edit Share Config

```bash
sudo vim /etc/samba/smb.conf
```

Add share point at the end of the config file

```conf
[share-name]
    comment = Your Comment Here
    path = /path/to/share/dir
    read only = no
    browsable = yes

[public]
    comment = Public Shared Disk
    path = /mnt/disk/smb/share
    read only = no
    browsable = yes
    create mask = 0644
    directory mask = 0755

[private]
    comment = Pricate Data Share
    path = /mnt/disk/smb/private
    read only = no
    browsable = no
    valid user = aimer, umb
    create mask = 0644
    directory mask = 0755

[media]
    comment = Media Files
    path = /media
    read only = yes
    browsable = yes
```

## Start Samba

```bash
sudo systemctl start smbd.service
```

## Enable Autostart

```bash
sudo systemctl enable smbd.service
```

## Update Firewall Rules

```bash
sudo ufw allow samba
```

## Setting User Password

```bash
sudo smbpasswd -a username
```

{{< notice warning >}}
Username used must belong to a system account, else it won’t save.
{{< /notice >}}

## Reset User Password

```bash
sudo smbpasswd -a user-name
```

# Link

- [Install and Configure Samba](https://ubuntu.com/tutorials/install-and-configure-samba)
