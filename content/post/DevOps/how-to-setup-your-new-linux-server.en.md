---
title: "How to Setup Your New Linux Server"
date: 2022-05-17T22:09:41+08:00
draft: false
ShowToc: true
categories: [DevOps]
tags: [linux]
cover:
    image: "images/linux-server-setup.webp"
    alt: "Server Setup"
    relative: false
---

## Update System

```bash
# Debian
apt update
# Fedora
dnf update
```

## Install Most Used Tools

```bash
# Debain
apt install -y neofetch htop tree ncdu ranger zsh vim neovim git curl wget net-tools
# Fedora
dnf install -y neofetch htop tree ncdu ranger zsh vim neovim git curl wget util-linux-user
```

## Create Sudo User

```bash
# Debian
adduser aimerneige
usermod -aG sudo aimerneige
# Fedora
useradd -G wheel aimerneige
passwd aimerneige
```

## Test Root Privileges

```bash
su - aimerneige
sudo cat /etc/shadow
```

## Setup SSH Public Key

```bash
# run this on your local machine
ssh-copy-id aimerneige@server
```

## Test if You Can Connect to Server

```bash
ssh aimerneige@server
```

## Disable Root and Password Login

```bash
sudo vim /etc/ssh/sshd_config
```

- Set `PermitRootLogin` as `no` To disable `root` login
- Set `PasswordAuthentication` ad `no` To disable password login

## Skip Password for Sudo

```bash
sudo visudo
```

Add this on the end of file:

```
aimerneige ALL=(ALL) NOPASSWD:ALL
```

## Delete Other User That Provider Created

```bash
sudo deluser default
```

{{< notice warning >}}

Do not delete the root user.

{{</ notice >}}

## Restart Your Server

```bash
sudo reboot
```

## Other Config

### Setup zsh Config

#### oh-my-zsh

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

#### lsd

Install lsd

```bash
# ubuntu
# https://github.com/Peltoche/lsd/releases
sudo dpkg -i lsd_0.23.1_amd64.deb

# fedora
sudo dnf install lsd -y
```

Edit .zshrc, add bellow alias record

```bash
alias ls=lsd
```

#### bat

Install bat

```bash
# ubuntu
sudo apt install bat -y

# fedora
sudo dnf install bat -y
```

Edit .zshrc, add bellow alias record

```bash
# add bellow line on ubuntu
# alias bat=batcat
alias cat=bat
```

### Install Node

Install nvm

```bash
# use curl
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.2/install.sh | bash

# use bash
wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.2/install.sh | bash
```

Use nvm Install latest LTS version of nodejs

```bash
nvm install --lts
```

Test if it works

```bash
node --version
npm --version
```

### Install Python

```bash
# ubuntu
sudo apt install -y python-is-python3 python2 python3-pip

# fedora
sudo dnf install -y python-is-python3 python2 python3-pip
```

### Setup neovim config

#### Install Requirements

```
pip install neovim
npm install --location=global neovim
```

#### Download config file

```bash
rm -rf ~/.config/nvim
# Use your own config file!!!!!
git clone https://github.com/aimerneige/nvim.git ~/.config/nvim
```

#### Install Plugin

```bash
# download will start automatically after start neovim
nvim
```

## Refer Link

- [Best-practice for authentication after creating a new Linux server](https://anduin.aiursoft.com/post/2020/7/26/bestpractice-for-authentication-after-creating-a-new-linux-server)
