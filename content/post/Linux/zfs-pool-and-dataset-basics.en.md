---
title: "ZFS Pool and Dataset Basics"
date: 2026-07-26T00:00:00+08:00
draft: false
ShowToc: true
description: "Create a ZFS pool on Ubuntu and manage datasets, properties, quotas, encryption, snapshots, and replication."
categories: [Linux]
tags: [ubuntu,zfs,storage]
---

{{< notice warning >}}

This post was generated entirely with Codex and has not been manually verified. Please read it critically.

{{</ notice >}}

# ZFS Pool and Dataset Basics

This post records the basic ZFS operations I used on an Ubuntu server: testing ZFS with a file-backed pool, creating a real pool from four disks, organizing data with datasets, and configuring properties, quotas, encryption, snapshots, and replication.

{{< notice warning >}}

`zpool create` writes ZFS labels to the selected devices. A wrong device name can destroy an existing filesystem and make its data inaccessible.

Check every device immediately before creating the pool. Keep a separate backup of important data. Redundancy protects against some disk failures, but it is not a backup.

{{</ notice >}}

## Create a Temporary File-backed Pool

A file-backed pool is useful for learning ZFS commands without dedicating a real disk. It is only suitable for testing.

Create a 1 GiB image and use it as a pool named `food`:

```bash
dd if=/dev/zero of=/tmp/zfs.img bs=1M count=1024 status=progress
sudo zpool create food /tmp/zfs.img
zpool status food
zfs list food
```

Destroy the test pool before deleting its backing file:

```bash
sudo zpool destroy food
rm /tmp/zfs.img
```

## Server Layout

The server used for this example has one 32 GiB system disk and four empty 128 GiB data disks:

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

`blkid` and `fdisk -l` confirmed that `/dev/sda2` contained the system filesystem and that `/dev/sdb` through `/dev/sde` had no partitions or filesystems.

Linux names such as `/dev/sdb` can change when disks are reconnected or the boot order changes. On physical servers, prefer stable paths from `/dev/disk/by-id/`:

```bash
ls -l /dev/disk/by-id/
```

The commands below use `/dev/sdb` through `/dev/sde` to match this virtual machine. Replace them with the stable identifiers from your own server when possible.

## Install ZFS

Install the ZFS utilities from the Ubuntu repository:

```bash
sudo apt update
sudo apt install zfsutils-linux
```

Check that the tools and kernel module are available:

```bash
zfs version
```

## Choose a Pool Layout

In the following examples, `akasha` is the pool name. The approximate usable capacities assume four equal 128 GiB disks and do not include ZFS metadata or reserved space.

| Layout      | Command topology          | Approximate capacity | Disk failure tolerance  |
| ----------- | ------------------------- | -------------------: | ----------------------- |
| Stripe      | Four top-level disk vdevs |              512 GiB | None                    |
| Two mirrors | Two 2-disk mirror vdevs   |              256 GiB | One disk in each mirror |
| RAIDZ1      | One 4-disk RAIDZ1 vdev    |              384 GiB | One disk                |
| RAIDZ2      | One 4-disk RAIDZ2 vdev    |              256 GiB | Two disks               |

A single `mirror` keyword followed by all four disks creates one four-way mirror, with roughly one disk of usable capacity. To create two 2-disk mirrors, repeat the `mirror` keyword:

```bash
sudo zpool create -n akasha \
    mirror /dev/sdb /dev/sdc \
    mirror /dev/sdd /dev/sde
```

The `-n` option prints the proposed layout without creating it. Use it before any real `zpool create` command.

These are the corresponding dry runs for a stripe, RAIDZ1, and RAIDZ2:

```bash
# Stripe: no redundancy
sudo zpool create -n akasha /dev/sdb /dev/sdc /dev/sdd /dev/sde

# One RAIDZ1 vdev
sudo zpool create -n akasha raidz1 /dev/sdb /dev/sdc /dev/sdd /dev/sde

# One RAIDZ2 vdev
sudo zpool create -n akasha raidz2 /dev/sdb /dev/sdc /dev/sdd /dev/sde
```

Changing the redundancy layout later is not as simple as changing a property. Choose the vdev layout before storing data.

## Create the Pool

This server uses RAIDZ2:

```bash
sudo zpool create -o ashift=12 akasha raidz2 /dev/sdb /dev/sdc /dev/sdd /dev/sde
```

`ashift=12` makes ZFS use 4 KiB sectors for allocations. This is a common choice for modern disks and must be selected when the vdev is created.

By default, the pool's root dataset is mounted at `/akasha`. Use `-m` to select a different mount point at creation time:

```bash
sudo zpool create -n -m /usr/share/pool -o ashift=12 \
    akasha raidz2 /dev/sdb /dev/sdc /dev/sdd /dev/sde
```

This second command is only a dry run. Do not run another real create command after `akasha` already exists.

## Inspect the Pool

List the pool and its root dataset:

```bash
zpool list
zfs list
df -h /akasha
```

The original RAIDZ2 test produced output similar to this:

```console
$ zpool list
NAME     SIZE  ALLOC   FREE  CKPOINT  EXPANDSZ   FRAG    CAP  DEDUP    HEALTH  ALTROOT
akasha   508G   278K   508G        -         -     0%     0%  1.00x    ONLINE  -

$ zfs list
NAME     USED  AVAIL     REFER  MOUNTPOINT
akasha   138K   245G     32.9K  /akasha
```

`zpool list` reports the raw space managed by the vdev. `zfs list` reports space available to datasets after RAIDZ parity, metadata, and ZFS allocation rules, so the two values are not expected to match.

Check the vdev topology and error counters:

```bash
sudo zpool status -v akasha
```

The RAIDZ2 layout should contain one `raidz2-0` vdev with all four disks:

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

## Destroy a Pool

Destroying a pool removes the pool and every dataset and snapshot inside it:

```bash
sudo zpool destroy akasha
```

Verify the result:

```console
$ zpool status
no pools available
```

Do not destroy the pool if the following sections are being performed on the same server. The command is included here as a cleanup reference.

## Create Datasets

Datasets share the pool's storage, but each dataset can have its own mount point, compression mode, quota, snapshots, and other properties.

Create a simple hierarchy:

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

Inspect the result:

```bash
zfs list -r akasha
tree /akasha
```

The mount hierarchy follows the dataset names by default:

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

## Manage Mount Points

Read a dataset's mount point and current mount state:

```bash
zfs get mountpoint,mounted akasha
zfs get mountpoint,mounted akasha/documents
```

Change the mount point:

```bash
sudo zfs set mountpoint=/home/aimer/Documents akasha/documents
sudo chown aimer:aimer /home/aimer/Documents
```

If the target directory already contains files, mounting the dataset hides those files until the dataset is unmounted. Move or back up existing data before changing the mount point.

## Rename a Dataset

Rename `docs` to `msdocs`:

```bash
sudo zfs rename akasha/documents/docs akasha/documents/msdocs
```

The child dataset's inherited mount point changes with its new name.

## Manage Dataset Properties

Use `zfs get` to inspect one property recursively:

```bash
zfs get -r compression akasha
```

Set compression on the parent dataset:

```bash
sudo zfs set compression=lz4 akasha/documents
zfs get -r compression akasha/documents
```

The child datasets inherit `lz4` unless they have a local value. Give the ebooks dataset its own setting:

```bash
sudo zfs set compression=gzip-9 akasha/documents/ebooks
zfs get compression akasha/documents/ebooks
```

`lz4` is a practical default for general data because it has low CPU overhead. `gzip-N` trades more CPU time for compression, where `gzip-1` favors speed and `gzip-9` favors size. Compression only applies to newly written blocks. Changing the property does not rewrite existing data.

Inspect all properties or query only the values needed:

```bash
zfs get all akasha/medias/musics
zfs get compression,used,available,mountpoint akasha/documents/ebooks
```

Remove a local property value and return to the inherited value:

```bash
sudo zfs inherit compression akasha/documents/ebooks
```

## Set Quotas

Create datasets for quota examples:

```bash
sudo zfs create akasha/home
sudo zfs create akasha/home/aimer
sudo zfs create akasha/home/john
```

`quota` limits the dataset, its descendants, and its snapshots:

```bash
sudo zfs set quota=20G akasha/home/aimer
zfs get quota,used,available akasha/home/aimer
```

`refquota` limits only the dataset's referenced data. Descendant datasets and snapshots do not count against it:

```bash
sudo zfs set refquota=10G akasha/home/aimer
zfs get quota,refquota,used,referenced,available akasha/home/aimer
```

Using both properties provides a 10 GiB limit for live data while allowing up to 20 GiB for the dataset, its descendants, and snapshots combined.

## Set Reservations

A reservation guarantees that a dataset can allocate a minimum amount of pool space. That reserved space is no longer available for unrelated datasets, even when the reserving dataset is mostly empty.

Reserve 20 GiB for the documents hierarchy:

```bash
sudo zfs set reservation=20G akasha/documents
zfs get reservation,used,available akasha/documents
```

`refreservation` applies only to the dataset itself, without its descendants:

```bash
sudo zfs set refreservation=10G akasha/documents
zfs get reservation,refreservation akasha/documents
```

Remove the reservations:

```bash
sudo zfs set reservation=none akasha/documents
sudo zfs set refreservation=none akasha/documents
```

Use reservations only when a workload truly needs guaranteed space. Over-reserving can make the rest of the pool appear full.

## Add Custom Properties

User properties store application-specific metadata. Their names must contain a colon:

```bash
sudo zfs set custom:color=red akasha/documents
zfs get custom:color akasha/documents
```

They do not change ZFS behavior by themselves.

## I/O Bandwidth Limits

OpenZFS does not provide a general per-dataset property for read or write bandwidth limits. Use `zpool iostat` to observe pool activity:

```bash
zpool iostat -v akasha 5
```

If a service needs a hard I/O limit, apply it outside ZFS with the operating system's cgroup or service manager controls. The exact configuration depends on whether the workload accesses a filesystem dataset, a zvol, a container, or a systemd service.

## Create an Encrypted Dataset

Encryption must be selected when a dataset is created. An existing unencrypted dataset cannot be converted in place by setting `encryption=on`.

Create a new encryption root protected by a passphrase:

```bash
sudo zfs create \
    -o encryption=on \
    -o keyformat=passphrase \
    -o keylocation=prompt \
    akasha/private
```

ZFS prompts for the passphrase instead of placing it in shell history. Inspect the encryption state:

```bash
zfs get encryption,encryptionroot,keyformat,keylocation,keystatus akasha/private
```

To test unloading and loading the key:

```bash
sudo zfs unmount akasha/private
sudo zfs unload-key akasha/private
sudo zfs load-key akasha/private
sudo zfs mount akasha/private
```

Losing the key or passphrase means losing access to the data. Store recovery material separately from the pool and decide how keys will be loaded after a reboot before using encryption on a server.

## Create Snapshots

Create a recursive snapshot of the documents hierarchy:

```bash
sudo zfs snapshot -r akasha/documents@before-change
zfs list -t snapshot -r akasha/documents
```

Delete it when it is no longer needed:

```bash
sudo zfs destroy -r akasha/documents@before-change
```

A snapshot is stored in the same pool as the live dataset. It helps recover deleted or changed data, but it does not protect against losing the entire pool.

## Automate Snapshots with Sanoid

[Sanoid](https://github.com/jimsalterjrs/sanoid) manages snapshot schedules and retention policies. After installing it according to the upstream documentation, configure `/etc/sanoid/sanoid.conf`:

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

Sanoid decides whether a snapshot is due, so its upstream example runs the cron command every minute:

```cron
* * * * * TZ=UTC /usr/local/bin/sanoid --cron
```

Check the installed binary path before copying the cron entry. Distribution packages may install it somewhere other than `/usr/local/bin`.

## Replicate with Syncoid

Syncoid, included with Sanoid, wraps ZFS send and receive for local or remote replication:

```bash
syncoid -r akasha backup@mybackups:akasha
```

The remote user needs SSH access and the required ZFS permissions on the destination. Run the command manually first, inspect its exit status and destination datasets, then schedule it with cron or a systemd timer. Prevent scheduled runs from overlapping when a replication can take longer than its interval.

Replication is not the same as an independent backup if accidental deletion or unwanted snapshots are immediately copied to the destination. Apply a retention policy and restrict writes on the backup server.

## Routine Checks

Check pool health regularly:

```bash
sudo zpool status -v akasha
```

Start a scrub to read and verify stored data:

```bash
sudo zpool scrub akasha
sudo zpool status akasha
```

The scrub runs in the background. `zpool status` shows its progress and final error count.

## References

- [OpenZFS: zpool manual](https://openzfs.github.io/openzfs-docs/man/master/8/zpool.8.html)
- [OpenZFS: Dataset properties](https://openzfs.github.io/openzfs-docs/man/master/7/zfsprops.7.html)
- [OpenZFS: Quotas and reservations](https://openzfs.github.io/openzfs-docs/Basic%20Concepts/Datasets/Quotas%20and%20Reservations.html)
- [OpenZFS: Send and receive](https://openzfs.github.io/openzfs-docs/Basic%20Concepts/Operations/Send%20and%20Receive.html)
- [Sanoid and Syncoid](https://github.com/jimsalterjrs/sanoid)
