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
apt install -y neofetch htop tree ncdu ranger zsh vim neovim git curl wget
# Fedora
dnf install -y neofetch htop tree ncdu ranger zsh vim neovim git curl wget
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

### 配置 neovim

```bash
rm -rf ~/.config/nvim
# 使用你自己的配置文件！！！！！
git clone git@github.com:aimerneige/nvim.git ~/.config/nvim
```

## 参考链接

- [Best-practice for authentication after creating a new Linux server](https://anduin.aiursoft.com/post/2020/7/26/bestpractice-for-authentication-after-creating-a-new-linux-server)
