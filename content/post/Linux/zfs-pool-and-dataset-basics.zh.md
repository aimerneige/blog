---
title: "ZFS 存储池与 Dataset 基础操作"
date: 2026-07-26T00:00:00+08:00
draft: false
ShowToc: true
description: "在 Ubuntu 上创建 ZFS 存储池，并管理 dataset、属性、配额、加密、快照和数据同步。"
categories: [Linux]
tags: [ubuntu,zfs,storage]
---

{{< notice warning >}}

本文完全使用 codex 生成，未经过人工核验，请注意鉴别其中内容

{{</ notice >}}

# ZFS 存储池与 Dataset 基础操作

这篇文章记录在 Ubuntu 服务器上使用 ZFS 的基础操作：用普通文件创建临时存储池，在四块硬盘上创建真正的存储池，再通过 dataset 管理目录、属性、配额、加密、快照和数据同步。

{{< notice warning >}}

`zpool create` 会向选中的设备写入 ZFS 标签。设备名选错后，原有文件系统可能被破坏，数据也可能无法访问。

创建存储池前必须再次确认所有设备，并为重要数据准备独立备份。冗余只能应对一部分硬盘故障，不能替代备份。

{{</ notice >}}

## 创建基于文件的临时存储池

如果只是想熟悉 ZFS 命令，可以先用普通文件充当块设备，不需要准备一块真实硬盘。这种方式只适合测试。

创建一个 1 GiB 的镜像文件，并用它创建名为 `food` 的存储池：

```bash
dd if=/dev/zero of=/tmp/zfs.img bs=1M count=1024 status=progress
sudo zpool create food /tmp/zfs.img
zpool status food
zfs list food
```

测试结束后，先销毁存储池，再删除底层文件：

```bash
sudo zpool destroy food
rm /tmp/zfs.img
```

## 服务器磁盘布局

本文使用的服务器包含一块 32 GiB 系统盘，以及四块空的 128 GiB 数据盘：

```console
$ lsblk -o NAME,SIZE,TYPE,FSTYPE,MOUNTPOINTS
NAME    SIZE TYPE FSTYPE MOUNTPOINTS
sda      32G disk
├─sda1    1M part
└─sda2   32G part ext4   /
sdb     128G disk
sdc     128G disk
sdd     128G disk
sde     128G disk
```

通过 `blkid` 和 `fdisk -l` 可以确认，`/dev/sda2` 是系统文件系统，`/dev/sdb` 到 `/dev/sde` 没有分区和文件系统。

重新连接硬盘或调整启动顺序后，`/dev/sdb` 这样的设备名可能发生变化。在物理服务器上，最好使用 `/dev/disk/by-id/` 下的稳定路径：

```bash
ls -l /dev/disk/by-id/
```

为了与这台虚拟机的输出保持一致，后面的命令继续使用 `/dev/sdb` 到 `/dev/sde`。在真实服务器上操作时，应尽量替换为自己的稳定设备标识。

## 安装 ZFS

从 Ubuntu 软件仓库安装 ZFS 工具：

```bash
sudo apt update
sudo apt install zfsutils-linux
```

确认命令和内核模块可以正常使用：

```bash
zfs version
```

## 选择存储池布局

下面的示例统一使用 `akasha` 作为存储池名称。容量按照四块相同的 128 GiB 硬盘估算，没有扣除 ZFS 元数据和保留空间。

| 布局     | vdev 结构            | 估算可用容量 | 硬盘故障容忍能力     |
| -------- | -------------------- | -----------: | -------------------- |
| 条带     | 四个顶层单盘 vdev    |      512 GiB | 无                   |
| 两组镜像 | 两个双盘 mirror vdev |      256 GiB | 每组镜像各损坏一块盘 |
| RAIDZ1   | 一个四盘 RAIDZ1 vdev |      384 GiB | 一块盘               |
| RAIDZ2   | 一个四盘 RAIDZ2 vdev |      256 GiB | 两块盘               |

如果只写一个 `mirror`，后面跟四块硬盘，得到的是四盘镜像，可用容量大约只有一块硬盘。要创建两组双盘镜像，必须重复写出 `mirror`：

```bash
sudo zpool create -n akasha \
    mirror /dev/sdb /dev/sdc \
    mirror /dev/sdd /dev/sde
```

`-n` 只输出将要创建的布局，不会真正修改硬盘。执行正式的 `zpool create` 前，建议先用它检查结构。

条带、RAIDZ1 和 RAIDZ2 对应的预演命令如下：

```bash
# 条带，没有冗余
sudo zpool create -n akasha /dev/sdb /dev/sdc /dev/sdd /dev/sde

# 一个 RAIDZ1 vdev
sudo zpool create -n akasha raidz1 /dev/sdb /dev/sdc /dev/sdd /dev/sde

# 一个 RAIDZ2 vdev
sudo zpool create -n akasha raidz2 /dev/sdb /dev/sdc /dev/sdd /dev/sde
```

冗余布局不能像普通属性一样随意修改。正式保存数据前，应先确定 vdev 结构。

## 创建存储池

这台服务器最终使用 RAIDZ2：

```bash
sudo zpool create -o ashift=12 akasha raidz2 /dev/sdb /dev/sdc /dev/sdd /dev/sde
```

`ashift=12` 让 ZFS 使用 4 KiB 扇区进行分配，这是现代硬盘上常见的选择，而且需要在创建 vdev 时确定。

默认情况下，存储池的根 dataset 会挂载到 `/akasha`。创建时可以用 `-m` 指定其他挂载点：

```bash
sudo zpool create -n -m /usr/share/pool -o ashift=12 \
    akasha raidz2 /dev/sdb /dev/sdc /dev/sdd /dev/sde
```

第二条命令只做预演。`akasha` 已经存在后，不要再次执行真正的创建命令。

## 查看存储池

查看存储池、根 dataset 和挂载情况：

```bash
zpool list
zfs list
df -h /akasha
```

原来的 RAIDZ2 测试得到过类似下面的输出：

```console
$ zpool list
NAME     SIZE  ALLOC   FREE  CKPOINT  EXPANDSZ   FRAG    CAP  DEDUP    HEALTH  ALTROOT
akasha   508G   278K   508G        -         -     0%     0%  1.00x    ONLINE  -

$ zfs list
NAME     USED  AVAIL     REFER  MOUNTPOINT
akasha   138K   245G     32.9K  /akasha
```

`zpool list` 显示 vdev 管理的原始空间，`zfs list` 显示扣除 RAIDZ 校验、元数据和 ZFS 分配规则后可供 dataset 使用的空间，所以两边的数字不会相同。

查看 vdev 结构和错误计数：

```bash
sudo zpool status -v akasha
```

RAIDZ2 布局中应该只有一个 `raidz2-0` vdev，并包含全部四块硬盘：

```text
  pool: akasha
 state: ONLINE
config:

        NAME        STATE     READ WRITE CKSUM
        akasha      ONLINE       0     0     0
          raidz2-0  ONLINE       0     0     0
            sdb     ONLINE       0     0     0
            sdc     ONLINE       0     0     0
            sdd     ONLINE       0     0     0
            sde     ONLINE       0     0     0

errors: No known data errors
```

## 销毁存储池

销毁存储池会一并删除其中的所有 dataset 和快照：

```bash
sudo zpool destroy akasha
```

检查结果：

```console
$ zpool status
no pools available
```

如果还要在同一台服务器上继续后面的操作，不要销毁存储池。这里保留该命令只是为了记录清理方法。

## 创建 Dataset

所有 dataset 共享存储池空间，但每个 dataset 都可以拥有独立的挂载点、压缩方式、配额、快照和其他属性。

创建一组简单的层级：

```bash
sudo zfs create akasha/medias
sudo zfs create akasha/medias/musics
sudo zfs create akasha/medias/videos
sudo zfs create akasha/medias/pictures
sudo zfs create akasha/documents
sudo zfs create akasha/documents/codes
sudo zfs create akasha/documents/docs
sudo zfs create akasha/documents/ebooks
```

查看结果：

```bash
zfs list -r akasha
tree /akasha
```

默认挂载目录会跟随 dataset 名称：

```text
/akasha
├── documents
│   ├── codes
│   ├── docs
│   └── ebooks
└── medias
    ├── musics
    ├── pictures
    └── videos
```

## 管理挂载点

查看 dataset 的挂载点和当前挂载状态：

```bash
zfs get mountpoint,mounted akasha
zfs get mountpoint,mounted akasha/documents
```

修改挂载点：

```bash
sudo zfs set mountpoint=/home/aimer/Documents akasha/documents
sudo chown aimer:aimer /home/aimer/Documents
```

如果目标目录中已经存在文件，挂载 dataset 后，这些文件会暂时被遮盖，直到 dataset 被卸载。修改挂载点前应先移动或备份原有数据。

## 重命名 Dataset

将 `docs` 改名为 `msdocs`：

```bash
sudo zfs rename akasha/documents/docs akasha/documents/msdocs
```

子 dataset 使用继承的挂载点时，路径也会跟随新名称变化。

## 管理 Dataset 属性

递归查看压缩属性：

```bash
zfs get -r compression akasha
```

在父 dataset 上启用压缩：

```bash
sudo zfs set compression=lz4 akasha/documents
zfs get -r compression akasha/documents
```

所有子 dataset 都会继承 `lz4`，除非它们自己设置了本地值。单独修改 ebooks：

```bash
sudo zfs set compression=gzip-9 akasha/documents/ebooks
zfs get compression akasha/documents/ebooks
```

`lz4` 的 CPU 开销较低，适合作为一般数据的默认选择。`gzip-N` 会用更多 CPU 时间换取压缩率，其中 `gzip-1` 偏向速度，`gzip-9` 偏向体积。压缩属性只影响新写入的数据块，修改属性不会自动重写已有数据。

查看所有属性，或者只查询需要的值：

```bash
zfs get all akasha/medias/musics
zfs get compression,used,available,mountpoint akasha/documents/ebooks
```

删除本地属性值并恢复继承：

```bash
sudo zfs inherit compression akasha/documents/ebooks
```

## 设置配额

先创建用于演示配额的 dataset：

```bash
sudo zfs create akasha/home
sudo zfs create akasha/home/aimer
sudo zfs create akasha/home/john
```

`quota` 会限制当前 dataset、子 dataset 和快照占用的总空间：

```bash
sudo zfs set quota=20G akasha/home/aimer
zfs get quota,used,available akasha/home/aimer
```

`refquota` 只限制当前 dataset 引用的数据，子 dataset 和快照不计入其中：

```bash
sudo zfs set refquota=10G akasha/home/aimer
zfs get quota,refquota,used,referenced,available akasha/home/aimer
```

同时设置这两个属性后，实时数据上限为 10 GiB，当前 dataset、子 dataset 和快照的合计上限为 20 GiB。

## 设置预留空间

Reservation 可以保证某个 dataset 至少能够分配指定大小的存储池空间。即使该 dataset 基本为空，预留部分也不会再分配给其他 dataset。

为 documents 层级预留 20 GiB：

```bash
sudo zfs set reservation=20G akasha/documents
zfs get reservation,used,available akasha/documents
```

`refreservation` 只保证当前 dataset 自己的空间，不包括子 dataset：

```bash
sudo zfs set refreservation=10G akasha/documents
zfs get reservation,refreservation akasha/documents
```

删除预留空间：

```bash
sudo zfs set reservation=none akasha/documents
sudo zfs set refreservation=none akasha/documents
```

只有确实需要保证空间的工作负载才适合设置 reservation。预留过多会让存储池的其他部分提前表现为空间不足。

## 添加自定义属性

用户属性可以保存应用自己的元数据，属性名必须包含冒号：

```bash
sudo zfs set custom:color=red akasha/documents
zfs get custom:color akasha/documents
```

自定义属性本身不会改变 ZFS 的行为。

## I/O 带宽限制

OpenZFS 没有用于限制单个 dataset 读写带宽的通用属性。可以使用 `zpool iostat` 观察存储池活动：

```bash
zpool iostat -v akasha 5
```

如果某个服务需要强制限制 I/O，应通过操作系统的 cgroup 或服务管理器在 ZFS 外部实现。具体配置取决于工作负载使用的是文件系统 dataset、zvol、容器还是 systemd 服务。

## 创建加密 Dataset

加密必须在创建 dataset 时指定。已有的未加密 dataset 不能通过设置 `encryption=on` 直接原地转换。

创建一个使用 passphrase 的新加密根：

```bash
sudo zfs create \
    -o encryption=on \
    -o keyformat=passphrase \
    -o keylocation=prompt \
    akasha/private
```

ZFS 会交互式询问 passphrase，不会把它写进 shell 历史。查看加密状态：

```bash
zfs get encryption,encryptionroot,keyformat,keylocation,keystatus akasha/private
```

测试卸载和重新加载密钥：

```bash
sudo zfs unmount akasha/private
sudo zfs unload-key akasha/private
sudo zfs load-key akasha/private
sudo zfs mount akasha/private
```

丢失密钥或 passphrase 就意味着失去数据。正式使用加密前，应把恢复材料保存在存储池之外，并提前决定服务器重启后如何加载密钥。

## 创建快照

为 documents 层级创建递归快照：

```bash
sudo zfs snapshot -r akasha/documents@before-change
zfs list -t snapshot -r akasha/documents
```

不再需要时删除快照：

```bash
sudo zfs destroy -r akasha/documents@before-change
```

快照与实时 dataset 位于同一个存储池中。它可以恢复误删或修改的数据，但无法应对整个存储池丢失。

## 使用 Sanoid 自动管理快照

[Sanoid](https://github.com/jimsalterjrs/sanoid) 可以管理快照计划和保留策略。按照上游文档完成安装后，编辑 `/etc/sanoid/sanoid.conf`：

```ini
[akasha]
    use_template = production
    recursive = yes

[template_production]
    frequently = 0
    hourly = 12
    daily = 7
    weekly = 4
    monthly = 6
    yearly = 1
    autosnap = yes
    autoprune = yes
```

Sanoid 会自己判断快照是否到期，因此上游示例每分钟调用一次 cron 命令：

```cron
* * * * * TZ=UTC /usr/local/bin/sanoid --cron
```

复制 cron 配置前先检查本机的程序路径。通过发行版软件包装好后，Sanoid 不一定安装在 `/usr/local/bin`。

## 使用 Syncoid 同步

Sanoid 附带的 Syncoid 对 ZFS send 和 receive 进行了封装，可以在本机或远程主机之间同步：

```bash
syncoid -r akasha backup@mybackups:akasha
```

远程用户必须能够通过 SSH 登录，并拥有目标端所需的 ZFS 权限。先手动运行命令，检查退出状态和目标 dataset，再使用 cron 或 systemd timer 定时执行。如果一次同步可能超过调度间隔，还需要避免多个任务重叠。

如果误删除或错误快照会立刻同步到目标端，复制数据本身也不等于独立备份。备份服务器仍然需要单独的保留策略和写入限制。

## 日常检查

定期检查存储池健康状态：

```bash
sudo zpool status -v akasha
```

启动 scrub，读取并校验已经保存的数据：

```bash
sudo zpool scrub akasha
sudo zpool status akasha
```

Scrub 会在后台运行，`zpool status` 会显示进度和最终错误数量。

## 参考链接

- [OpenZFS：zpool 手册](https://openzfs.github.io/openzfs-docs/man/master/8/zpool.8.html)
- [OpenZFS：Dataset 属性](https://openzfs.github.io/openzfs-docs/man/master/7/zfsprops.7.html)
- [OpenZFS：Quotas and Reservations](https://openzfs.github.io/openzfs-docs/Basic%20Concepts/Datasets/Quotas%20and%20Reservations.html)
- [OpenZFS：Send and Receive](https://openzfs.github.io/openzfs-docs/Basic%20Concepts/Operations/Send%20and%20Receive.html)
- [Sanoid 与 Syncoid](https://github.com/jimsalterjrs/sanoid)
