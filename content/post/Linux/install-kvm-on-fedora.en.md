---
title: "Install kvm on Fedora"
date: 2023-02-25T15:36:58+08:00
draft: false
ShowToc: true
categories: [Linux]
tags: [tools, kvm]
cover:
    image: "images/kvm-banner-logo.png"
    alt: "KVM Logo"
    relative: false
---

**KVM**: Kernel-Based Virtual Machine

| Products   | Company   |
| ---------- | --------- |
| VirtualBox | Oracle    |
| VMWare     | VMWare    |
| Hyper-V    | Microsoft |

First, use x86 laptop or pc.

```bash
# check if kvm avaiable (output should bigger than 0)
egrep -c '(vmx|svm)' /proc/cpuinfo
```

if output is 0, enable vt on BIOS.

Install KVM on fedora36

```bash
# Install required virtualization packages
sudo dnf -y install bridge-utils libvirt virt-install qemu-kvm
```

```bash
# Also install useful tools for virtual machine management
sudo dnf -y install libvirt-devel virt-top libguestfs-tools guestfs-tools
```

1. qemu-kvm: the emulator itself
2. libvirt-daemon: runs virtualization in background
3. birdge-utils: important networking dependencies
4. virt-manager: the graphical program we'll use to work with our VMs

```bash
sudo usermod -aG libvirt aimer
sudo usermod -aG kvm aimer
```

```bash
sudo systemctl start libvirtd
sudo systemctl enable libvirtd
```

Virtual Machine Manager (or "virt-manager")

```bash
# Install Virtual machine Manager GUI
sudo dnf -y install virt-manager
```

- <https://www.youtube.com/watch?v=BgZHbCDFODk>
- <https://computingforgeeks.com/how-to-install-kvm-on-fedora/>
