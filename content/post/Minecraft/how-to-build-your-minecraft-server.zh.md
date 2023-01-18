---
title: "如何搭建你自己的 Minecraft 服务器"
date: 2023-01-12T21:00:37+08:00
draft: true
ShowToc: true
# description: "description here"
# categories: [Linux]
# tags: [tools]
# cover:
#     image: "images/blue_poison.jpg"
#     alt: "Blue Poison"
#     caption: "A Cute Blue Poison"
#     relative: false
---

# 阅前须知

1. 本文章面向具有一定运维经验的用户，不面向小白
2. 本文章介绍的 Minecraft 是 Java 版本的 Minecraft
3. 本文章只介绍纯净服的搭建，不会说明如何安装 mod
4. 如非特殊说明，本文中出现的 “我的世界” 均指代 Minecraft 的中文翻译，而不是由网易代理的 “我的世界”

# 准备

1. 可供外部连接的服务器
2. 基础 Linux 知识

# 安装

## 首先要确定你的服务器是否可以被外部连接

### 有公网 IP

如果你有公网 IP，可以直接使用你的主机作为服务器，相当于你有一台私有的云服务器。

### 没有公网 IP

如果你没有公网 IP，你需要**购买一台云服务器**，这样，你就拥有了一个可供外部连接的公网 IP。

如果你对服务器配置要求较高，本地也有闲置主机可以用来跑 Minecraft 服务器，可以通过 [frp](https://github.com/fatedier/frp) 将本地的主机穿透出去，以供外部连接。这样云服务器的配置就可以很低，只负责转发网络数据。

如果你对服务器的配置要求不高，也不想本地 24 小时开着一台机器，可以直接使用云服务器来跑 Minecraft 服务器。

至于你需要多高的配置来运行 Minecraft 服务器，可以参考 [Wiki](https://minecraft.fandom.com/zh/wiki/%E6%9C%8D%E5%8A%A1%E5%99%A8/%E9%9C%80%E6%B1%82/%E4%B8%93%E7%94%A8) 的内容：

## 确保服务器可以被外部连接后，安装 Minecraft

### 下载服务器文件

在 [官网](https://www.minecraft.net/zh-hans/download/server) 下载服务器运行所需的 jar 文件。

如果你需要历史版本，使用官方启动器下载。

### 运行服务器

直接使用官网的示例指令运行 jar 文件：

```bash
java -Xmx1024M -Xms1024M -jar minecraft_server.1.19.3.jar nogui
```

如果你有更高的内存，可以修改 `-Xmx1024M -Xms1024M` 这一部分。

第一次执行后，需要同意用户协议才可以继续执行，修改 `eula.txt` 这个文件，将 `eula=false` 改为 `eula=true`。

同意用户协议之后，继续使用相同的指令运行 jar 文件，这时 jar 文件会释放很多配置文件，并自动启动服务器，这时可以尝试使用客户端连接。

客户端连接成功后，证明服务器已成功运行，如需关闭服务器，使用 `Ctrl-c` 即可。

# 配置

修改 `server.properties` 并重启即可。

下面是一些常用设置：

正版认证：
- online-mode=false 关闭
- online-mode=true 开启

种子设定
- level-seed=minecraft

地图存档设定
- level-name=world name

难度设定
- difficulty=peaceful easy normal hard

启用白名单
- enforce-whitelist=true

人数上限
- max-players=5

限制世界大小
- max-world-size=10000

服务器名称
- motd=MiraiChess Minecraft Server

限制挂机
- player-idle-timeout=30

禁止 pvp
- pvp=false

关于 `server.properties` 的更多细节，请查阅 [Wiki](https://minecraft.fandom.com/zh/wiki/Server.properties)。

# 自动备份

参考这篇文章：

- [Anduin - Auto backup for Minecraft on Linux](https://anduin.aiursoft.cn/post/2021/12/24/auto-backup-for-minecraft-on-linux)

# 升级

替换 server.jar 之后重启即可。
