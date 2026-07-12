---
title: "在 Fedora 上添加 Btrfs RAID0 数据池"
date: 2026-07-12T00:00:00+08:00
draft: true
ShowToc: true
description: "记录在 Fedora 中使用三块 NVMe 硬盘创建 Btrfs RAID0 数据池，并通过子卷挂载到 home 目录的过程。"
categories: [Linux]
tags: [fedora,btrfs,raid]
---

# 在 Fedora 上添加 Btrfs RAID0 数据池

这篇文章记录一次在 Fedora 上添加数据盘的过程：系统盘继续保留 Fedora，只把额外的三块 NVMe 硬盘做成一个 Btrfs 存储池，然后用不同子卷挂载到 `~/Downloads`、`~/Games`、`~/VMs` 这些目录。

这里选择的是 Btrfs 原生多设备能力，不额外套一层 mdadm 或 LVM。原因很简单：我只是想把几块高速 SSD 合成一个大容量数据池，并继续使用 Btrfs 的子卷、压缩和校验能力。

{{< notice warning >}}

本文包含会清空磁盘的命令。`mkfs.btrfs -f` 会格式化目标数据盘，执行前一定要确认设备名和备份状态。

RAID0 不提供冗余。任意一块数据盘损坏，都可能导致整个数据池中的数据不可恢复。`-m raid1` 只给元数据做镜像，并不能把数据 RAID0 变成安全阵列。

{{</ notice >}}

## 环境假设

本文中的设备名只对应这台机器，实际操作时一定以自己的 `lsblk` 输出为准。

- 系统盘：`/dev/nvme0n1`，已经安装 Fedora
- 数据盘：`/dev/nvme1n1`、`/dev/nvme2n1`、`/dev/nvme3n1`
- 数据池卷标：`FastData`
- 用户名：`aimer`
- 目标挂载点：`/home/aimer/Downloads`、`/home/aimer/Games`、`/home/aimer/VMs`

先确认工具和磁盘状态：

```bash
sudo dnf install btrfs-progs
lsblk -o NAME,SIZE,MODEL,FSTYPE,MOUNTPOINTS
```

确认三块数据盘没有被挂载，也没有需要保留的数据之后，再继续下一步。

## 创建 Btrfs 数据池

使用 `mkfs.btrfs` 直接在三块数据盘上创建一个多设备文件系统：

```bash
sudo mkfs.btrfs -L FastData -d raid0 -m raid1 -f /dev/nvme1n1 /dev/nvme2n1 /dev/nvme3n1
```

几个参数的含义：

- `-L FastData`：设置文件系统卷标，方便后面识别。
- `-d raid0`：数据使用 RAID0 条带化，容量叠加，速度优先，没有冗余。
- `-m raid1`：元数据使用 RAID1，降低元数据损坏导致文件系统直接不可用的概率。
- `-f`：强制格式化。如果目标盘上有旧文件系统，这个参数会直接覆盖。

Btrfs 多设备文件系统会共享同一个 UUID，后续挂载时使用其中任意一个成员设备或 UUID 都可以。

## 创建子卷

先临时挂载数据池的顶层，然后创建子卷：

```bash
sudo mkdir -p /mnt/fastdata
sudo mount /dev/nvme1n1 /mnt/fastdata

sudo btrfs subvolume create /mnt/fastdata/@downloads
sudo btrfs subvolume create /mnt/fastdata/@games
sudo btrfs subvolume create /mnt/fastdata/@vms

sudo btrfs subvolume list /mnt/fastdata
sudo umount /mnt/fastdata
```

子卷不需要提前分配大小，它们共享整个数据池的剩余空间。这里用 `@downloads` 这种名字只是为了在顶层列表里更好识别。

## 配置永久挂载

获取文件系统 UUID：

```bash
sudo blkid -s UUID -o value /dev/nvme1n1
```

创建挂载点：

```bash
mkdir -p /home/aimer/{Downloads,Games,VMs}
```

如果这些目录里已经有文件，先看后面的“迁移旧数据”一节。挂载新子卷不会删除原文件，但会把原目录内容遮盖起来。

编辑 `/etc/fstab`：

```bash
sudo vim /etc/fstab
```

追加下面的内容，把 `YOUR-UUID` 替换成刚才查到的 UUID：

```fstab
# FastData Btrfs pool
UUID=YOUR-UUID  /home/aimer/Downloads  btrfs  subvol=@downloads,defaults,noatime,compress=zstd:1,discard=async,x-gvfs-hide  0  0
UUID=YOUR-UUID  /home/aimer/Games      btrfs  subvol=@games,defaults,noatime,compress=zstd:1,discard=async,x-gvfs-hide      0  0
UUID=YOUR-UUID  /home/aimer/VMs        btrfs  subvol=@vms,defaults,noatime,compress=zstd:1,discard=async,x-gvfs-hide        0  0
```

这里的挂载参数：

- `subvol=@downloads`：挂载指定子卷。
- `noatime`：减少访问时间写入。
- `compress=zstd:1`：启用 zstd 透明压缩，压缩等级 1 更偏向速度。
- `discard=async`：对 SSD/NVMe 启用异步 TRIM。
- `x-gvfs-hide`：让 GNOME Files 这类基于 GVFS 的文件管理器不要在侧边栏额外显示这些挂载点。

先检查 `fstab`，再挂载：

```bash
sudo findmnt --verify --verbose
sudo mount -a
findmnt /home/aimer/Downloads
```

新建子卷的根目录通常属于 `root`，把挂载点所有者改回当前用户：

```bash
sudo chown aimer:aimer /home/aimer/Downloads /home/aimer/Games /home/aimer/VMs
```

## 迁移旧数据

如果挂载前 `~/Downloads` 里已经有数据，挂载后旧数据会被遮盖。它们还在系统盘原来的 home 子卷里，只是当前路径已经指向新的 Btrfs 子卷。

先确认 Fedora 系统盘的 home 子卷位置：

```bash
findmnt -no SOURCE,OPTIONS /home
```

下面以系统盘分区 `/dev/nvme0n1p3`，home 子卷名 `home` 为例：

```bash
sudo mkdir -p /mnt/old_home
sudo mount -o subvol=home /dev/nvme0n1p3 /mnt/old_home

sudo rsync -aHAX --info=progress2 /mnt/old_home/aimer/Downloads/ /home/aimer/Downloads/
sudo rsync -aHAX --info=progress2 /mnt/old_home/aimer/Games/ /home/aimer/Games/
sudo rsync -aHAX --info=progress2 /mnt/old_home/aimer/VMs/ /home/aimer/VMs/
```

迁移完成后先检查文件数量和大小，不要急着删除旧数据：

```bash
du -sh /mnt/old_home/aimer/Downloads /home/aimer/Downloads
du -sh /mnt/old_home/aimer/Games /home/aimer/Games
du -sh /mnt/old_home/aimer/VMs /home/aimer/VMs
```

确认新目录可读写、数据完整、备份也没问题之后，再删除系统盘上的旧数据释放空间：

```bash
# 确认无误后再取消注释执行
# sudo rm -rf /mnt/old_home/aimer/Downloads/*
# sudo rm -rf /mnt/old_home/aimer/Games/*
# sudo rm -rf /mnt/old_home/aimer/VMs/*

sudo umount /mnt/old_home
```

## 隐藏文件管理器里的多余图标

如果只是想隐藏这些挂载点，优先使用前面写进 `/etc/fstab` 的 `x-gvfs-hide`。它只影响桌面环境展示，不影响底层挂载和命令行访问。

有些方案会通过 udev 规则设置 `UDISKS_IGNORE=1` 来隐藏设备。我不建议把它作为常规做法，因为这是设备级别的隐藏提示，可能让依赖 UDisks 的图形磁盘工具也忽略这些设备。对用户数据盘来说，副作用太大。

修改 `fstab` 后，如果侧边栏还显示旧状态，可以重启文件管理器：

```bash
nautilus -q
```

如果使用的不是 GNOME Files，`x-gvfs-hide` 的表现取决于对应桌面环境和文件管理器。

## 新增子卷

后续如果需要增加新目录，比如 `Videos`，不需要重新分区。再次挂载数据池顶层，创建子卷，再补一行 `fstab` 即可：

```bash
sudo mkdir -p /mnt/fastdata
sudo mount /dev/nvme1n1 /mnt/fastdata
sudo btrfs subvolume create /mnt/fastdata/@videos
sudo umount /mnt/fastdata

mkdir -p /home/aimer/Videos
```

在 `/etc/fstab` 中追加：

```fstab
UUID=YOUR-UUID  /home/aimer/Videos  btrfs  subvol=@videos,defaults,noatime,compress=zstd:1,discard=async,x-gvfs-hide  0  0
```

然后挂载并修正挂载点权限：

```bash
sudo findmnt --verify --verbose
sudo mount -a
sudo chown aimer:aimer /home/aimer/Videos
```

## 重装系统后的恢复

重装 Fedora 时不要格式化这三块数据盘。新系统装好后，确保三块成员盘都接入，然后让 Btrfs 扫描设备：

```bash
sudo dnf install btrfs-progs
sudo btrfs device scan
sudo btrfs filesystem show
```

重新创建挂载点：

```bash
mkdir -p /home/aimer/{Downloads,Games,VMs}
```

把备份的 `fstab` 条目恢复到 `/etc/fstab`，再挂载：

```bash
sudo findmnt --verify --verbose
sudo mount -a
```

只要数据盘没有被格式化，UUID 和子卷都还在，恢复过程通常只需要重建挂载配置。

## 常用维护命令

查看整体空间和 profile：

```bash
sudo btrfs filesystem usage /home/aimer/Downloads
```

查看设备状态：

```bash
sudo btrfs filesystem show
sudo btrfs device stats /home/aimer/Downloads
```

执行 scrub：

```bash
sudo btrfs scrub start -Bd /home/aimer/Downloads
```

RAID0 下 scrub 可以发现校验错误，但数据没有冗余副本时无法自动修复损坏的数据。它仍然有价值，因为至少能尽早发现问题。

只有在新增、移除或替换设备之后，才需要考虑 balance：

```bash
sudo btrfs balance start /home/aimer/Downloads
```

不要把完整 balance 当成日常维护任务，它可能跑很久，也会产生大量 I/O。

## 参考链接

- [mkfs.btrfs(8) - BTRFS documentation](https://btrfs.readthedocs.io/en/latest/mkfs.btrfs.html)
- [btrfs(5) - BTRFS mount options](https://btrfs.readthedocs.io/en/latest/btrfs-man5.html)
- [UDisks Reference Manual](https://storaged.org/doc/udisks2-api/latest/udisks.8.html)
