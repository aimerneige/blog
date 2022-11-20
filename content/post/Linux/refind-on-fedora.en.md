---
title: "rEFInd on Fedora"
date: 2022-11-20T20:10:58+08:00
draft: false
ShowToc: true
categories: [Linux]
tags: [tools,refind,boot,fedora]
# cover:
#     image: "images/blue_poison.jpg"
#     alt: "Blue Poison"
#     caption: "A Cute Blue Poison"
#     relative: false
---

# rEFInd on Fedora

# Install

Obtain an [rEFInd](https://www.rodsbooks.com/refind/) binary for RPM based system.

[direct link](http://sourceforge.net/projects/refind/files/0.13.3.1/refind-0.13.3.1-1.x86_64.rpm/download) (not the newest)

Find the newest rpm package download link from [here](https://www.rodsbooks.com/refind/getting.html).

After you download a rpm package, install it with your package manager

```bash
sudo dnf install refind-0.6.11-1.x86_64.rpm
sudo rpm -Uvh refind-0.6.11-1.x86_64.rpm
sudo yum localinstall refind-0.6.11-1.x86_64.rpm
```

At the most of the time, your are ready to use rEFInd, if it did not work on your system, run `redind-install`:

```bash
# ./refind-install
Installing rEFInd on Linux....
ESP was found at /boot/efi using vfat
Installing driver for ext4 (ext4_x64.efi)
Copied rEFInd binary files

Copying sample configuration file as refind.conf; edit this file to configure
rEFInd.


Installation has completed successfully.
```

# Theme

[GitHub - bobafetthotmail/refind-theme-regular](https://github.com/bobafetthotmail/refind-theme-regular)

```bash
sudo bash -c "$(curl -fsSL https://raw.githubusercontent.com/bobafetthotmail/refind-theme-regular/master/install.sh)"
```

# Remove

```bash
sudo rm -r /boot/efi/EFI/refind
```

# Link

- [Fedora Wiki - Refind](https://fedoraproject.org/wiki/Refind)