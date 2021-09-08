---
title: "配置 go 开发环境"
date: 2021-08-24T21:31:05+08:00
draft: false
ShowToc: true
description: "本篇文章简要介绍如何配置 go 的开发环境"
categories: [Program]
tags: [golang,env,teach]
cover:
    image: "images/golang.jpeg"
    alt: "Blue Poison"
    relative: false
---

> 由于某些网络原因[^GFW]，本文所提到的部分网站、下载链接可能在中国大陆地区无法访问，请自行查找解决方案，本文不再赘述。

> 如果你在阅读本文时遇到了任何问题，请查阅 **[go 语言官方网站][go]**。

# 下载预编译文件

在 [Download Go][go-dl] 选择适合你平台的最新版本文件下载。

本文不推荐使用一键安装包的方式安装 go 语言，即请不要直接下载下图所示的文件:

![download-example](/images/go-env-setup-for-beginner/featured-download.png)

我们在下面的 `Stable versions` 后找到最新版本的 go，选择适合自己电脑系统与架构的压缩包。要选择 `Archive`　而不要选择 `Installer`。

![download-instruct](/images/go-env-setup-for-beginner/download-instruct.png)

{{< notice tip >}}

当然使用 msi 等一键安装包安装也是完全可以的，如果你想要使用一键安装包的方式安装 go，请查阅其他资料。

{{< /notice >}}

> 如果你想要通过源码安装，请自行查阅 **[通过源码构建][go-src]**。

# 安装 & 配置

下面分别具体说明不同平台下安装和配置的方法。

## Linux

1. 解压压缩文件

这里我们可以直接使用 [官方安装指南][go-install] 提供的指令来解压。

```bash
rm -rf /usr/local/go && tar -C /usr/local -xzf go1.17.linux-amd64.tar.gz
```

本指令会将 go 安装在 `/usr/local/go` 路径下，因此执行命令需要 root 权限。当然，如果想要将 go 安装在其他路径也是可以的，但是还是推荐安装在官方推荐的路径下。

{{< notice info >}}

如果你使用了其他的路径来安装 go，在之后的配置过程中记得要修改 `GOROOT` 变量修改为你所安装的路径。

{{< /notice >}}

执行命令前请先切换工作目录，确保当前路径下有刚刚下载好的压缩包。

{{< notice warning >}}

压缩包名 `go1.17.linux-amd64.tar.gz` 可能有所不同，这取决于你安装的 go 版本和操作系统及处理器架构。

{{< /notice >}}

1. 配置环境变量

成功解压后，如果你尝试直接在终端执行 go 指令，你会发现系统并没有识别到你刚安装的 go 二进制文件，这是因为我们还没有对 go 的环境变量进行配置。

根据你所使用的不同的 shell，直接修改对应的配置文件，写入如下内容即可。\
例如在 bash 下要修改 `~/.bashrc`，而在 zsh 下则需要修改 `~/.zshrc`。

```bash
export GOROOT=/usr/local/go
export GOPATH=$HOME/golang
export PATH=$GOROOT/bin:$PATH
export PATH=$GOPATH/bin:$PATH
export GO111MODULE=on
# export GOPROXY=https://goproxy.cn
```

1. `export GOROOT=/usr/local/go` 为 go 的安装目录，即之前的解压路径。
2. `export GOPATH=$HOME/golang` 为 go 的工作区目录，所有的源代码、代码包等会存放在这里，可以自己定义。
3. `export PATH=$GOROOT/bin:$PATH` 与 `export PATH=$GOPATH/bin:$PATH` 将可执行文件目录添加到环境变量。不需要修改。
4. `export GO111MODULE=on` 启用 `GO111MODULE`。建议启用。
5. `export GOPROXY=https://goproxy.cn` 使用 [goproxy.cn](https://goproxy.cn/) 提供的代理服务，如果你有其他的代理服务可以注释掉它。

{{< notice tip >}}

上面的安装方式只有家目录对应的用户可以使用 go 指令，如果你想要全局注册，修改 `/etc/profile` 文件。

{{< /notice >}}

完成修改后，使用 `source` 指令应用更改，之后 go 就配置好了。

{{< notice warning >}}

使用 `source` 指令时还要指定文件，如果你在使用 `bash`，修改了 `~/.bashrc`，那么要执行 `source ~/.bashrc`，同理，可得使用 `zsh`，修改了 `~/.zshrc` 需要执行 `source ~/.zshrc`。

> ~~不会真的有 Linux 小白只执行 `source` 吧，不会吧，不会吧。~~

{{< /notice >}}

可以在终端下查看 `go env` 指令是否有输出检查 go 是否可用。

## mac OS

与 Linux 类似，下载好压缩文件后将其解压，修改配置即可。

{{< notice note >}}

在 macOS 下默认安装了 zsh，你可以直接修改 `~/.zshrc`，如果你想要全局配置，修改 `/etc/profile`。

{{< /notice >}}

## Windows

首先解压下载好的压缩文件，记住自己解压的位置。一般地，我会将 go 安装在 `C:\sdk\go` 下。

配置环境变量

{{< notice warning >}}

下文中提到的 `GOROOT` `GOPATH` 等要按照自己的需求更改，不可直接复制。

{{< /notice >}}

1. 打开“开始”并搜索“env”
2. 选择“编辑系统环境变量”
3. 点击“环境变量…”按钮
4. 在“<你的用户名> 的用户变量”章节下（上半部分）
5. **配置 GOROOT**
6. 点击“新建…”按钮
7. 选择“变量名”输入框并输入“GOROOT”
8. 选择“变量值”输入框并输入“C:\sdk\go”
9. 点击“确定”按钮
10. **配置 GOPATH**
11. 点击“新建…”按钮
12. 选择“变量名”输入框并输入“GOPATH”
13. 选择“变量值”输入框并输入“D:\Code\golang”
14. 点击“确定”按钮
15. **启用 GO111MODULE**
16. 点击“新建…”按钮
17. 选择“变量名”输入框并输入“GO111MODULE”
18. 选择“变量值”输入框并输入“on”
19. 点击“确定”按钮
20. **启用代理服务**
21. 点击“新建…”按钮
22. 选择“变量名”输入框并输入“GOPROXY”
23. 选择“变量值”输入框并输入“https://goproxy.cn”
24. 点击“确定”按钮

最后记得把 `%GOROOT%\bin` 和 `%GOPATH%\bin` 添加进环境变量。

检查 `go env` 的输出，验证安装是否成功。

# 如何更新 go

重新执行之前的解压指令即可。即先删除 `GOROOT` 路径下所有文件，然后重新解压新版的 go 压缩文件。

如果你在使用 Windows，删除后手动解压。


[go]: https://golang.org/
[go-dl]: https://golang.org/dl/
[go-src]: https://golang.org/doc/install/source
[go-install]: https://golang.org/doc/install

[^GFW]: https://en.wikipedia.org/wiki/Great_Firewall
