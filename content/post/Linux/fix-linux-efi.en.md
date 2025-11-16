---
title: "Fix Linux EFI"
date: 2024-12-22T22:44:57+08:00
draft: false
ShowToc: true
categories: [Linux]
tags: [efi]
# cover:
#     image: "images/blue_poison.jpg"
#     alt: "Blue Poison"
#     caption: "A Cute Blue Poison"
#     relative: false
---

When you have many disks, and you install many operating system, you may faced with a problem. That is your system's EFI file will be stored in a different disk rather than your root disk. Also, you may accidentally delete system's EFI file in a different disk. Here is how you can fix it.

{{< notice warning >}}

This article is not a step-by-step guide!

All the commands in this article are very dangerous.

Think carefully and check your command before you press Enter.

Do it with your own risk!

I am not in response for your data loss.

{{</ notice >}}

## Migrate EFI file to same disk

I assume that you have two disk: `nvme0n1` and `nvme1n1`. Use `lsblk` command to know your disks.

Here is a correct sample. Fedora are on `nvme0n1` and Ubuntu on `nvme1n1`:

```bash
➜ sudo lsblk
NAME        MAJ:MIN RM   SIZE RO TYPE MOUNTPOINTS
nvme0n1     259:3    0 931.5G  0 disk
├─nvme0n1p1 259:4    0   512M  0 part
└─nvme0n1p2 259:5    0   931G  0 part
nvme1n1     259:0    0 465.8G  0 disk
├─nvme1n1p1 259:1    0   512M  0 part /boot/efi
└─nvme1n1p2 259:2    0 465.3G  0 part /

```

But sometimes, your EFI file will be stored into a different disk like this:

```bash
➜ sudo lsblk
NAME        MAJ:MIN RM   SIZE RO TYPE MOUNTPOINTS
nvme0n1     259:3    0 931.5G  0 disk
├─nvme0n1p1 259:4    0   512M  0 part /boot/efi
└─nvme0n1p2 259:5    0   931G  0 part
nvme1n1     259:0    0 465.8G  0 disk
├─nvme1n1p1 259:1    0   512M  0 part
└─nvme1n1p2 259:2    0 465.3G  0 part /
```

You EFI file is stored in `/dev/nvme0n1p1`, not `/dev/nvme1n1p1`.

If you want to migrate efi file from `/dev/nvme0n1p1` to `/dev/nvme1n1p1`, it's easy.

The basic concept is:

1. format disk rightly
2. mount both part
3. move files
4. update `/etc/fstab`

EFI partition should be in FAT32. Here is how you can format it:

```bash
sudo mkfs.fat -F32 /dev/nvme1n1p1
```

In most cases, the install software has already format it for you. It just pick a wrong disk partition. But you can still use this command to get a clear EFI partition.

After you get a right partition, mount it:

```bash
sudo mount /dev/nvme1n1p1 /mnt/boot
```

Then copy all the files from `/boot/efi/` to `/mnt/boot`:

```bash
sudo cp -r /boot/efi/* /mnt/boot
```

After you copy the efi files, you still need to edit `/etc/fstab` to mount correct disk when system reboot.

```bash
sudo vim /etc/fstab
```

The origin config will be like this:

```
UUID=9D4C-93FE  /boot/efi  vfat  umask=0077  0  1
```

Use `blkid` to get uuid:

```bash
➜ sudo blkid
/dev/nvme0n1p1: UUID="9D4C-93FE" BLOCK_SIZE="512" TYPE="vfat" PARTLABEL="EFI System Partition" PARTUUID="c5c9cac8-7a1b-47f7-a020-7e9d3d278c75"
/dev/nvme0n1p2: UUID="16461f63-c03e-4dd4-a032-9ef49ee48854" BLOCK_SIZE="4096" TYPE="ext4" PARTUUID="fb46775f-4538-4fa3-a909-7f37c5c59f1d"
/dev/nvme1n1p2: UUID="72d8bf22-bd3f-48e5-aeab-10604f83d254" BLOCK_SIZE="4096" TYPE="ext4" PARTUUID="0e2c65f1-4cb3-4121-8a81-22b5bdd8f28b"
/dev/nvme1n1p1: UUID="134D-9AFB" BLOCK_SIZE="512" TYPE="vfat" PARTLABEL="EFI System Partition" PARTUUID="b110cd31-bd24-4566-b986-6c57a97ffe73"

➜ sudo blkid /dev/nvme1n1p1
/dev/nvme1n1p1: UUID="134D-9AFB" BLOCK_SIZE="512" TYPE="vfat" PARTLABEL="EFI System Partition" PARTUUID="b110cd31-bd24-4566-b986-6c57a97ffe73"
```

The `/dev/nvme0n1p1` partition will be mounted to `/boot/efi`. Change the UUID to `/dev/nvme0n1p1`. Just like this:

```
UUID=134D-9AFB  /boot/efi  vfat  umask=0077  0  1
```

Then the system will try to mount `/dev/nvme1n1p1` into `/boot/efi`.

Reboot your system to check if system mount right partion:

```bash
sudo reboot
```

## Restore EFI files with grub

![meme](/images/windows_broken_uefi.png)

If you have already delete the entire disk which store your EFI files, here is how you can restore them.

The basic concept is:

1. Boot from live cd
2. Recreate a EFI partition
3. Mount root partition
4. Mount EFI partition
5. Mount /dev, /proc, and /sys
6. Chroot into it
7. Run `grub-install`
8. Edit `/etc/fstab`
9. Umount everything
10. Reboot your system

First you need a EFI partition, use `fdisk` to create a partition and format it:

```bash
sudo mkfs.fat -F32 /dev/sda1
```

Mount the root directory:

```bash
sudo mount /dev/sda2 /mnt
```

Mount the EFI partition:

```bash
sudo mount /dev/sda1 /mnt/boot/efi
```

Mount /dev and other necessary part:

```bash
sudo mount --bind /dev /mnt/dev/
sudo mount --bind /proc /mnt/proc/
sudo mount --bind /sys /mnt/sys/
```

Chroot into your system:

```bash
sudo chroot /mnt
```

You can use ls to check if you mount the right partition.

Then you can recreate EFI files with grub:

```bash
sudo grub-install /dev/sda
```

If this process did't give you any error, the EFI files are restored.

Then you need to update `/etc/fstab`

```bash
sudo vim /etc/fstab
```

Use `blkid` to get disk uuid and mount the correct uuid like what I say before.

Then exit back to live cd system:

```bash
exit
```

Umount everything:

```bash
sudo umount /mnt/dev
sudo umount /mnt/proc
sudo umount /mnt/sys
sudo umount /mnt/boot/efi
sudo umount /mnt
```

Reboot your system:

```bash
sudo reboot
```
