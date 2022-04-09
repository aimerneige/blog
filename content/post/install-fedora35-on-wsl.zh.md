---
title: "Install Fedora35 on wsl"
date: 2022-04-09T22:22:44+08:00
draft: false
ShowToc: true
categories: [Windows,wsl]
tags: [wsl,fedora35]
cover:
    image: "images/fedora-wsl.png"
    alt: "Fedora Windows"
    relative: false
---

## 安装 wsl2

使用管理员身份开启 windows terminal.

执行如下指令：

```ps1
wsl.exe --install
```

等待安装完成后在开始菜单执行重启(reboot)

{{< notice warning >}}

注意是在开始菜单选择 `Restart` 而不能是选择 `Shut Down` 关机之后手动开机。

{{< /notice >}}

安装过程中系统会自动下载 Ubuntu 的子系统，重启后会弹出 ubuntu 的命令行初始界面，输入用户名和密码即可开始使用 ubuntu 子系统。

执行下面的指令设置 wsl 默认版本为 wsl2：

```ps1
wsl --set-default-version 2
```

## 安装其他版本的子系统

如果你想要其他版本的子系统，可以执行如下指令获取可通过 wsl 指令直接安装的发行版列表：

```ps1
wsl --list --online
```

返回数据类似下面这样：

```ps1
The following is a list of valid distributions that can be installed.
Install using 'wsl --install -d <Distro>'.

NAME            FRIENDLY NAME
Ubuntu          Ubuntu
Debian          Debian GNU/Linux
kali-linux      Kali Linux Rolling
openSUSE-42     openSUSE Leap 42
SLES-12         SUSE Linux Enterprise Server v12
Ubuntu-16.04    Ubuntu 16.04 LTS
Ubuntu-18.04    Ubuntu 18.04 LTS
Ubuntu-20.04    Ubuntu 20.04 LTS
```

如果想要安装某发行版，直接执行相应指令即可。例如可以通过下面的指令安装 `debian` 子系统：

```ps1
wsl --install -d Debian
```

当你安装了多个发行版，可以通过下面的指令指定默认发行版：

```ps1
wsl --setdefault <Distro>
```

例如，设置 Kali-linux 为默认发行版：

```ps1
wsl --setdefault Kali-linux
```

## 安装 fedora 35

wsl 提供的发行版中，并不包含 fedora 系统，所以只能手动安装。

### 下载 fedora 镜像文件(**rootfs** image)

在 [Fedora-Container-Base](https://koji.fedoraproject.org/koji/packageinfo?packageID=26387) 选择需要的 fedora 版本下载。

在保证 `State` 一栏为 `complete` 的前提下找到需要的版本。

[Fedora 35 build](https://koji.fedoraproject.org/koji/buildinfo?buildID=1921137)

我们要下载的文件是 `xz` 格式，同时选择正确的架构，如 `x86_64`。

(点击下面的链接直接下载)

[Fedora-Container-Base-35-20220221.0.x86_64.tar.xz](https://kojipkgs.fedoraproject.org/packages/Fedora-Container-Base/35/20220221.0/images/Fedora-Container-Base-35-20220221.0.x86_64.tar.xz)

下载好之后解压这个压缩文件，如果你不知道用什么软件，下载使用 [7-Zip](https://www.7-zip.org/download.html)。

{{< notice warning >}}

注意，解压为 `tar` 文件即可，不要继续解压 `tar` 文件。

{{< /notice >}}

此时，查看你刚刚得到的 `tar` 文件，在里面找到一个名为 `layer.tar` 的文件，单独解压它，他就是我们需要的 rootfs image。把它解压到一个容易找到的位置，比如 `Downloads` 目录。为了便于使用，你可以将它重命名为 `fedora-35-rootfs.tar`。

如果你想要一些更加官方的系统镜像，可以在 [docker-brew-fedora](https://github.com/fedora-cloud/docker-brew-fedora) 项目中找到你想要的文件。

直接在 [仓库](https://github.com/fedora-cloud/docker-brew-fedora/branches/active) 中找到对应的版本和架构后下载对应的文件即可。比如，你可能下载了 `fedora-35-x86_64.tar.xz`，下载完成后，解压这个文件，得到 `tar` 文件，这个 `tar` 文件就是 rootfs image。如果愿意，你也可以将它重命名为 `fedora-35-rootfs.tar`。

### 创建你的 wsl 存储目录

创建一个文件夹来保存你的 wsl 文件。

```ps1
mkdir $HOME\wsl\fedora
```

### 释放镜像文件

假设你想要将子系统命名为 `fedora`，想要把它保存在 `$HOME\wsl\fedora` 目录下，同时 rootfs 文件存储在 `$HOME\Downloads\fedora-35-rootfs.tar`，执行下面的指令：

```ps1
wsl --import fedora $HOME\wsl\fedora $HOME\Downloads\fedora-35-rootfs.tar
```

### 检查安装情况

```ps1
wsl -l
```

### 使用 root 启动 fedora 子系统：

```ps1
wsl -d fedora
```

### 设置 fedora 为默认发行版

```ps1
wsl -s fedora
```

## 修复问题

{{< notice info >}}

注：以下问题是否存在取决于你下载的 fedora 版本，如果你没有对应错误直接跳过即可。

{{< /notice >}}

### 挂载错误

如果你在第一次启动 fedora 时得到了以下错误：

```bash
An error occurred mounting one of your file systems. Please run 'dmesg' for more details.
```

这是由于系统缺少 mount 指令造成的，如果你不需要 mount 指令也不在意错误，完全可以忽略这个错误（虽然还是建议修一下）。

安装 `util-linux` 这个包即可。（如果你是一个极简主义者，安装 `util-linux-core` 这个包）

```bash
dnf install -y util-linux
```

安装完成后关闭 fedora 重启即可。

```ps1
wsl -t fedora
```

## 配置你的 fedora

### 升级系统

```bash
dnf update
```

### 创建用户

继续之前，先安装下面的包：

```bash
dnf install -y passwd cracklib-dicts
```

在 whell 用户组下创建名为 `myusername` 的用户

```bash
useradd -G wheel myusername
```

为用户 `myusername` 设置密码

```bash
passwd myusername
```

使用指定用户登录 wsl

```ps1
wsl -d fedora -u myusername
```

查看是否成功

```bash
whoami
```

检查是否具有 sudo 权限

```bash
sudo cat /etc/shadow
```

### 设置默认用户

首先你的系统必须是 Windows build 18980 之后的版本，只需要 [修改 wsl 配置文件](https://docs.microsoft.com/en-us/windows/wsl/wsl-config#user) 即可。

如果你没有创建过 `/etc/wsl.conf` 文件，直接执行如下指令：

```bash
printf "\n[user]\ndefault = myusername\n" | sudo tee -a /etc/wsl.conf
```

或者手动添加下面内容到 `/etc/wsl.conf`：

```toml
[user]
default = aimerneige
```

关闭 fedora 子系统。

```ps1
wsl -t fedora
```

在不指定用户的情况下启动 fedora 子系统，检查用户是否正确。

### 容器

如果你需要运行容器，重新安装 `shadow-utils` 确保修复一些 rootfs 带来的错误：

```bash
sudo dnf reinstall -y shadow-utils
```

### ping

如果你想要执行 ping 指令，执行下面的操作：

```bash
sudo dnf install -y procps-ng iputils
sudo sysctl -w net.ipv4.ping_group_range="0 2000"
```

### 常用指令

安装下面的包来启用 Linux 下常用指令：

```bash
sudo dnf -y install iproute findutils ncurses
```

### 编辑器

安装必要的编辑器，你可以按照喜好选择 `vim` `nano` 或 `micro`。

```bash
sudo dnf install -y vim
```

### man

继续之前首先要确保 `nodocs` 选项没有被开启，你可以手动编辑 `tsflags=nodocs` 这一行，也可以直接执行下面的指令：

```bash
grep -v nodocs /etc/dnf/dnf.conf | sudo tee /etc/dnf/dnf.conf
```

接下来安装 man

```bash
sudo dnf install -y man man-pages
```

安装完成之后，在这之后安装的软件就可以使用 `man` 指令查看文档了，但是之前已经安装好的软件，并不能查看文档，比如现在执行 `man dnf` 就不会得到任何结果。需要执行 `sudo dnf reinstall -y dnf` 重新安装 dnf 之后，才可以正确查看相关文档。

执行下面的指令重新安装全部的包：

{{< notice warning >}}

这一步非常费时，如果你不常用 man 可以选择跳过。

{{< /notice >}}

```bash
for pkg in $(dnf repoquery --installed --qf "%{name}"); do sudo dnf reinstall -qy $pkg; done
```

### 导出系统

为了方便之后安装，可以将系统导出。

首先清理掉缓存文件：

```bash
sudo dnf clean all
```

使用下面的指令导出 fedora 子系统到 `$HOME\Downloads\fedora-wsl.tar` 目录下。

```ps1
wsl --export fedora $HOME\Downloads\fedora-wsl.tar
```

之后要使用的时候，可以使用下面的指令导入：

```ps1
mkdir $HOME\wsl\freshfedora
wsl --import freshfedora $HOME\wsl\freshfedora $HOME\Downloads\fedora-wsl.tar
```

## wsl 常用指令

### 查看当前正在运行的子系统

```ps1
wsl --list --running
```

### 关闭指定子系统

```ps1
wsl --terminate <Distro>
```

例如关闭正在运行的 Ubuntu 子系统：

```ps1
wsl --terminate Ubuntu
```

### 关闭全部子系统

```ps1
wsl --shutdown
```

### 升级 wsl

```ps1
wsl --update
```

### 版本回滚

```ps1
wsl --update --rollback
```

## wsl 使用技巧

在文件资源管理器中输入 `\\wsl$` 即可进入 wsl 的目录。可以将它添加到文件资源管理器的网络路径里便于访问。

## 参考

> [Install Fedora 36 or earlier on Windows Subsystem for Linux (WSL)](https://dev.to/bowmanjd/install-fedora-on-windows-subsystem-for-linux-wsl-4b26)