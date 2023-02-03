---
title: "如何搭建 Minecraft Mod 服务器"
date: 2023-01-26T16:24:34+08:00
draft: false
ShowToc: true
categories: [Minecraft]
tags: [game,minecraft,server,mod]
cover:
    image: "images/Minecraft_Java_Edtion.svg"
    alt: "Minecraft Java Edtion"
    relative: false
---

## 使用 PaperMC

### 安装 PaperMC

下载 [PaperMC](https://papermc.io/downloads) 提供的 jar 包，存储在恰当位置即可。

### 启动 PaperMC

```bash
java -Xms2G -Xmx2G -jar paper.jar --nogui
```

下面是[官方提供的](https://docs.papermc.io/paper/aikars-flags)优化后的启动脚本：

```bash
java -Xms10G -Xmx10G -XX:+UseG1GC -XX:+ParallelRefProcEnabled -XX:MaxGCPauseMillis=200 -XX:+UnlockExperimentalVMOptions -XX:+DisableExplicitGC -XX:+AlwaysPreTouch -XX:G1NewSizePercent=30 -XX:G1MaxNewSizePercent=40 -XX:G1HeapRegionSize=8M -XX:G1ReservePercent=20 -XX:G1HeapWastePercent=5 -XX:G1MixedGCCountTarget=4 -XX:InitiatingHeapOccupancyPercent=15 -XX:G1MixedGCLiveThresholdPercent=90 -XX:G1RSetUpdatingPauseTimePercent=5 -XX:SurvivorRatio=32 -XX:+PerfDisableSharedMem -XX:MaxTenuringThreshold=1 -Dusing.aikars.flags=https://mcflags.emc.gs -Daikars.new.flags=true -jar paper.jar --nogui
```

### 安装 datapack

关掉已启动的服务器，将 datapack 存储在 `papermc/world/datapacks` 文件夹下，重启服务器即可。（如果不存在就新建一个）

### 安装插件

关掉已启动的服务器，将下载好的插件存储在 `papermc/plugins` 文件夹下，重启服务器即可。（如果不存在就新建一个）

### 配置服务器

PaperMC 提供了非常多的服务器修改配置，具体请查阅 [官方文档](https://docs.papermc.io/paper/configuration)。

### 对于 mod 的说明

PaperMC 并不兼容 Fabric 的 mod。如果需要使用 Fabric 的 mod，请参考下面的内容使用 Fabric 服务器。

## 使用 Fabric

### 安装 Fabric

```bash
# 安装依赖
sudo apt install openjdk-17-jre-headless curl
 
# 创建存储数据的文件夹
mkdir fabric
cd fabric
 
# 下载安装器
# 在 https://fabricmc.net/use/installer/ 获取下载链接
curl -o installer.jar <installer jar url>
 
# 运行安装器
java -jar installer.jar server -mcversion 1.19.3 -downloadMinecraft
 
# 安装完成厚可以删除安装器
rm installer.jar
 
# 重命名 jar 文件
mv server.jar vanilla.jar
mv fabric-server-launch.jar server.jar
echo "serverJar=vanilla.jar" > fabric-server-launcher.properties
 
# 启动服务器
java -jar server.jar
```

### 安装 mod

关掉已启动的服务器，将 mod 存储在 `fabric/mods` 文件夹下，重启服务器即可。（如果不存在就新建一个）

### 安装 datapack

关掉已启动的服务器，将 datapack 存储在 `fabric/world/datapacks` 文件夹下，重启服务器即可。（如果不存在就新建一个）

{{< notice warning >}}

如果你的 datapack 用于生成地形，请先删除已经创建好的地图文件，即删除整个 world 文件夹，否则 datapack 和已有存档会发生冲突。

{{< /notice >}}

## 参考链接

- [PaperMC](https://papermc.io/)
- [PaperMC - Download](https://papermc.io/downloads)
- [PaperMC - Configuration](https://docs.papermc.io/paper/configuration)
- [Fabric](https://fabricmc.net/)
- [Fabric - Installing a Fabric Server without a GUI](https://fabricmc.net/wiki/player:tutorials:install_server)
