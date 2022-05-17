---
title: "How to Setup Your New Linux Server"
date: 2022-05-17T22:09:41+08:00
draft: false
ShowToc: true
categories: [Linux,Devops]
tags: [linux]
cover:
    image: "images/linux-server-setup.webp"
    alt: "Server Setup"
    relative: false
---

## Update system

```bash
# Debian
apt update
# Fedora
dnf update
```

## Install most used tools

```bash
# Debain
apt install -y neofetch htop tree ncdu ranger zsh vim neovim git curl wget lsd
# Fedora
dnf install -y neofetch htop tree ncdu ranger zsh vim neovim git curl wget lsd
```

## Create sudo user

```bash
# Debian
adduser aimerneige
usermod -aG sudo aimerneige
# Fedora
useradd -G wheel aimerneige
passwd aimerneige
```

## Test root privileges

```bash
su - aimerneige
sudo cat /etc/shadow
```

## Setup SSH public key

```bash
# run this on your local machine
ssh-copy-id aimerneige@server
```

## Test if you can connect to server

```bash
ssh aimerneige@server
```

## Disable root and password login

```bash
sudo vim /etc/ssh/sshd_config
```

- 将 `PermitRootLogin` 修改为 `no` 可以禁用 `root` 用户登录
- 将 `PasswordAuthentication` 修改为 `no` 可以禁用密码登录

## Skip password for sudo

```bash
sudo visudo
```

Add this on the end of file:

```
aimerneige ALL=(ALL) NOPASSWD:ALL
```

## Delete other user that provider created

```bash
sudo deluser default
```

{{< notice warning >}}

Do not delete the root user.

{{</ notice >}}

## Restart your server

```bash
sudo reboot
```

## Other config

### Setup zsh config

```bash
# Install oh-my-zsh
sh -c "$(curl -fsSL https://raw.github.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
# Update config from github (Use your own config file!!!!!)
sh -c "$(curl -fsSL https://raw.githubusercontent.com/aimerneige/zsh/master/install.sh)"
# Install zsh-autosuggestions
git clone https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions
# Install k
git clone https://github.com/supercrabtree/k $ZSH_CUSTOM/plugins/k
# Install starship
curl -sS https://starship.rs/install.sh | sh
```

### Setup neovim config

```bash
rm -rf ~/.config/nvim
# Use your own config file!!!!!
git clone git@github.com:aimerneige/nvim.git ~/.config/nvim
```

## Refer link

- [Best-practice for authentication after creating a new Linux server](https://anduin.aiursoft.com/post/2020/7/26/bestpractice-for-authentication-after-creating-a-new-linux-server)
