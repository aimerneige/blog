---
title: "如何安装 Ubuntu"
date: 2020-01-24T16:11:30+08:00
draft: false
ShowToc: true
categories: [Linux]
tags: [ubuntu]
---

# 前言

之前由于感兴趣而涉足 Linux 领域，在虚拟机内尝试了 Ubuntu，可惜虚拟机内性能有限，于是以双系统的形式安装了 Ubuntu18.04。

经过一段时间的使用后，感觉 Ubuntu 完全可以作为日常系统使用，于是放弃了 bug 不断的 Windows 系统，做好备份后直接全盘安装了 Ubuntu 系统，Windows 下的软件找不到替代品就转向虚拟机使用。

个人感觉 Ubuntu 是完全可以替代 Windows 日常使用的，以下是 Ubuntu 相比于 Windows 的一些优点和不足

## 优点

1. 更加稳定
2. 更加安全
3. 不会整天提醒你更新系统
4. 配置开发环境仅需几行终端指令
5. 忘记恼人的弹窗广告和流氓软件吧

## 不足

1. 很多软件不支持 Linux，只能在 Windows 上运行
2. 几乎 90% 的游戏都不支持 Linux
3. 需要学习命令行
4. 界面丑

对策：

1. Windows 下的软件可以直接在虚拟机下运行，不想挂个虚拟机的话也可以考虑使用 Wine
2. 游戏还是不要玩了，装个 Ubuntu 学 Linux 顺带还能帮你戒游戏，实在需要玩游戏的可以使用双系统
3. 命令行也不是特别难，遇到问题谷歌一下就行了
4. 至于界面丑，我指的是 Ubuntu18.04 及 之前的版本，这些问题可以通过安装主题和图标包来解决，而最新的 Ubuntu19.10 界面还是十分惊艳的

# Ubuntu 的安装

访问 Ubuntu 官网下载最新的镜像文件

使用 Etcher 写入 U 盘作为启动盘

通过 U 盘启动系统

依照图形化安装程序进行安装

系统安装好之后就可以开始使用激动人心的 Ubuntu19.10 了！

（Emmmm，这个之后补图详细介绍吧）

# 软件配置

安装好系统之后，还需要进行软件的配置，才能作为日常的使用。

下面是博主的配置过程，仅供参考。

## 换源

俗话说的好，装好 Linux 后第一件事就是换源。

由于不同地区网络不同，我用起来很快的源你用可能会很慢，所以这里推荐大家自己百度，多试几个，选一个稳定高速的。

实际上 Ubuntu 官方源在国内也是可以直接用的，博主就没有更换，默认官方源使用。

可以通过 speedtest 工具检测网络问题是否是由于网卡驱动导致。

### 首先安装 python3

```shell
sudo apt install python3 -y
```

### 安装 pip

```shell
sudo apt install python-pip -y

```

### 安装 speedtest 工具

```shell
sudo pip install speedtest-cli
```

### 进行测速

```shell
speedtest
```

安装之后随时都可以使用 speedtest 指令测速，有关该 python 小工具的更多功能请自行谷歌

如果测速结果正常但是安装软件却很慢说明网卡没有问题，可以考虑更换国内镜像源

## 更新系统

不管有没有换源，首先更新系统

```shell
sudo apt update && sudo apt upgrade
```

## 安装开发环境

### 安装 git

```shell
sudo apt install git
```

### 安装 java 运行环境

#### jre

```shell
sudo apt install openjdk-8-jre
```

#### jdk

```shell
sudo apt install openjdk-8-jdk
```

### 安装 gcc 编译器

```shell
sudo apt install gcc
```

### 安装 g++编译器

```shell
sudo apt install g++
```

### 安装 adb 调试工具

```shell
sudo apt install adb
```

## 安装 chrome

这条终端指令安装的是开源的 chromium

```shell
sudo apt install chromium-browser
```

如果想要正式版的 chrome 可以去 chrome 官网下载 deb 包安装

## 更换 vim

系统自带的 vi 太难用了，安装 vim 替换

```shell
sudo apt install vim
```

当然你也可以使用`gedit`或者`nano`

## 安装 typora

装机必备啊，写博客什么的很舒服。

[官网](https://typora.io/#linux)有最新安装命令（以官网为主）

```shell
wget -qO - https://typora.io/linux/public-key.asc | sudo apt-key add -
sudo add-apt-repository 'deb https://typora.io/linux ./'
sudo apt-get update
sudo apt-get install typora
```

## 网络代理

自行谷歌

## 软件

在官网下载 deb 包进行安装

VSC
VirtuaBox

网易云音乐

## 等宽字体

下载 FiraCode 字体文件

将 otf 字体文件保存到一文件夹内，这里以`~/Downloads/FiraCode`为例

在`/usr/local/share/fonts/`目录下创建自定义文件夹名，这里以`FiraCode`为例

```shell
cd /usr/local/hare/fonts/
mkdir FiraCode
```

cd 到字体文件目录

```shell
cd ~/Downloads/FiraCode/
```

移动字体文件

```shell
sudo mv * /usr/local/share/fonts/FiraCode/
// 或者使用cp命令拷贝
```

切换到字体目录

```shell
cd /usr/local/share/fonts/FiraCode/
```

建立字体缓存

```shell
sudo fc-cache -fv
```

## 配置 VSC

### 调整字体

更改字体为 FiraCode

更改字体大小，粗度

### 下载必备扩展包

#### 主题美化

`One Dark Pro`
`Material Icon Theme`
`Material Theme`

#### C 语言

`C/C++`
`Code Runner`

#### Java

`Language support for Java ™ for Visual Studio Code`
`Debugger for Java`
`Java Test Runner`
`Java Extension Pack`

### 按需下载其他扩展包

## 配置 AndroidStudio

官网下载安装包

提取文件到某一目录

移动文件到/opt

```shell
mv /opt
```

cd 到安装目录

```shell
cd /opt/android-studio/bin
```

通过指令运行

```shell
run with ./studio.sh
```

不嫌烦的话可以使用指令启动软件

想添加桌面图标的编辑如下文件

```shell
gedit ~/.local/share/applications/androidstudio.desktop
```

添加以下内容

```shell
and add the lines below

[Desktop Entry]
Version=1.0
Type=Application
Name=Android Studio
Exec="/opt/android-studio/bin/studio.sh" %f
Icon=/opt/android-studio/bin/studio.png
Categories=Development;IDE;
Terminal=false
StartupNotify=true
StartupWMClass=android-studio
```

JB 全家桶均可按照此方法安装，具体配置文件建议谷歌
