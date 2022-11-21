---
title: "如何配置新购置的 Linux 服务器"
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

## 更新系统

```bash
# Debian
apt update
# Fedora
dnf update
```

## 安装常用工具

```bash
# Debain
apt install -y neofetch htop tree ncdu ranger zsh vim neovim git curl wget net-tools
# Fedora
dnf install -y neofetch htop tree ncdu ranger zsh vim neovim git curl wget util-linux-user
```

## 创建 sudo 用户

```bash
# Debian
adduser aimerneige
usermod -aG sudo aimerneige
# Fedora
useradd -G wheel aimerneige
passwd aimerneige
```

## 测试 root 权限

```bash
su - aimerneige
sudo cat /etc/shadow
```

## 配置 SSH 连接密钥

```bash
# 在你的本地环境执行这条指令
ssh-copy-id aimerneige@server
```

## 测试连通性

```bash
ssh aimerneige@server
```

## 禁用 root 和密码登录

```bash
sudo vim /etc/ssh/sshd_config
```

- 将 `PermitRootLogin` 修改为 `no` 可以禁用 `root` 用户登录
- 将 `PasswordAuthentication` 修改为 `no` 可以禁用密码登录

## 设置 sudo 免密码

```bash
sudo visudo
```

在末尾添加如下内容

```
aimerneige ALL=(ALL) NOPASSWD:ALL
```

## 删除云服务商提供的其他用户

```bash
sudo deluser default
```

{{< notice warning >}}

不要删除 root 用户。

{{</ notice >}}

## 重启服务器

```bash
sudo reboot
```

## 其他配置

### 配置 zsh 环境

#### oh-my-zsh

```bash
# 安装 oh-my-zsh
sh -c "$(curl -fsSL https://raw.github.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
# 从 github 更新配置 （使用你自己的配置文件！！！！！）
sh -c "$(curl -fsSL https://raw.githubusercontent.com/aimerneige/zsh/master/install.sh)"
# 安装 zsh-autosuggestions
git clone https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions
# 安装 k
git clone https://github.com/supercrabtree/k $ZSH_CUSTOM/plugins/k
# 安装 starship
curl -sS https://starship.rs/install.sh | sh
```

#### lsd

安装 lsd

```bash
# ubuntu
# https://github.com/Peltoche/lsd/releases
sudo dpkg -i lsd_0.23.1_amd64.deb

# fedora
sudo dnf install lsd -y
```

修改 .zshrc 文件，添加 alias

```bash
alias ls=lsd
```

#### bat

安装 bat

```bash
# ubuntu
sudo apt install bat -y

# fedora
sudo dnf install bat -y
```

修改 .zshrc 文件，添加 alias

```bash
# add bellow line on ubuntu
# alias bat=batcat
alias cat=bat
```

### 安装 node 环境

安装 nvm

```bash
# 使用 curl
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.2/install.sh | bash

# 使用 bash
wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.2/install.sh | bash
```

重新加载你的 shell

使用 nvm 安装 lts 版本的 nodejs

```bash
nvm install --lts
```

测试是否生效

```bash
node --version
npm --version
```

### 安装 python 环境

```bash
# ubuntu
sudo apt install -y python-is-python3 python2 python3-pip

# fedora
sudo dnf install -y python-is-python3 python2 python3-pip
```

### 配置 neovim

#### 安装依赖

```bash
pip install neovim
npm install --location=global neovim
```

#### 下载配置

```bash
rm -rf ~/.config/nvim
# 使用你自己的配置文件！！！！！
git clone https://github.com/aimerneige/nvim.git ~/.config/nvim
```

#### 安装插件

```bash
# 启动 neovim 后自动下载
nvim
```

### 移除 snap

查看已安装的 snap 包

```bash
snap list
```

依次移除全部的 snap 包

```bash
sudo snap remove --purge lxd
sudo snap remove --purge core20
sudo snap remove --purge snapd
```

移除 snapd

```bash
sudo apt remove --autoremove snapd
```

修改如下文件来防止自动更新下载 snap 的包

```bash
sudo vim /etc/apt/preferences.d/nosnap.pref
```

写入如下内容：

```pref
Package: snapd
Pin: release a=*
Pin-Priority: -10
```

更新系统

```bash
sudo apt update
```

## 参考链接

- [Best-practice for authentication after creating a new Linux server](https://anduin.aiursoft.com/post/2020/7/26/bestpractice-for-authentication-after-creating-a-new-linux-server)
