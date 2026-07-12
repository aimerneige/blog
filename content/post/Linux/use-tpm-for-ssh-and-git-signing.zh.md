---
title: "使用 Linux TPM 托管 SSH 密钥和 Git 签名"
date: 2026-07-12T18:11:00+08:00
draft: true
ShowToc: true
description: "记录在 Linux 设备上使用 TPM 生成 SSH key、配置 ssh-tpm-agent，以及它和指纹识别、磁盘加密的关系"
categories: [Linux]
tags: [ssh,git,security,tpm]
---

读完“笔记本已经内置安全密钥”的思路后，很自然会想到一个问题：Linux 设备能不能也这么玩？

答案是可以，但它和 macOS Touch ID、Windows Hello 的体验不完全一样。Linux 上更现实的路线是使用 TPM 2.0 托管 SSH key，让私钥绑定在主板 TPM 里，再通过 `ssh-tpm-agent` 给 SSH 和 Git signing 使用。

## TPM 负责什么

TPM 适合托管密钥。它能让私钥在硬件里生成或被密封，日常使用时只暴露签名能力，不把私钥明文交给系统里的普通文件。

这和普通 `~/.ssh/id_ed25519` 的差别在于：普通私钥文件被拷走后，攻击者可以离线破解 passphrase。TPM 托管的 key 即使有一个 `.tpm` 文件，它也绑定在生成它的 TPM 上，不能直接拿到另一台机器使用。

`ssh-tpm-agent` 项目的 README 也明确说，`.tpm` 文件是由 TPM 创建并密封的私钥，绑定在产生它的硬件上，不能转移到其他机器使用。

## 准备条件

先确认这几件事：

1. 机器有 TPM 2.0，并且在 BIOS/UEFI 里启用。
2. 系统能访问 TPM 设备。
3. 已安装 `ssh-tpm-agent` 和 `ssh-tpm-keygen`。

安装方式按发行版决定。项目 README 给出的通用方式是通过 Go 安装，或者下载预编译二进制：

```bash
go install github.com/foxboron/ssh-tpm-agent/cmd/...@latest
```

如果发行版仓库已经打包，优先用发行版包管理器。这样 systemd unit、路径和更新都会更省心。

## 生成 TPM 托管的 SSH key

生成 key：

```bash
ssh-tpm-keygen
```

按提示选择保存路径。默认会生成类似这样的文件：

```text
~/.ssh/id_ecdsa.tpm
~/.ssh/id_ecdsa.pub
```

`.pub` 是正常公钥，可以上传到服务器或代码托管平台。`.tpm` 是密封后的 key 文件，不等于可导出的私钥明文。

生成时可以设置 passphrase，也可以留空。留空会更无感，但本机被控制时，攻击者也更容易直接调用 TPM 进行签名。设置 passphrase 会多一层确认成本，取舍看设备所处环境。

## 启动 ssh-tpm-agent

安装 user-level systemd unit：

```bash
ssh-tpm-agent --install-user-units
systemctl --user enable --now ssh-tpm-agent.socket
```

让当前 shell 使用它：

```bash
export SSH_AUTH_SOCK="$(ssh-tpm-agent --print-socket)"
```

确认 Agent 能看到 key：

```bash
ssh-add -L
```

如果 key 没有自动加载，可以按项目文档使用 `ssh-tpm-add` 添加 `.tpm` 文件。

## 用于 SSH 登录

把公钥加到目标服务器：

```bash
ssh-copy-id -i ~/.ssh/id_ecdsa.pub user@server
```

之后连接服务器时，SSH 客户端通过 `SSH_AUTH_SOCK` 找到 `ssh-tpm-agent`，再由它调用 TPM 完成签名。

如果你设置了 passphrase，第一次使用时需要输入。后续是否继续询问，取决于 agent、会话和系统配置。

## 用于 Git commit signing

Git 2.34 以后支持 SSH 格式签名。配置方式如下：

```bash
git config --global gpg.format ssh
git config --global user.signingkey ~/.ssh/id_ecdsa.pub
git config --global commit.gpgsign true
```

这里 `user.signingkey` 指向公钥文件。Git 官方文档说明，当 `gpg.format` 为 `ssh` 且使用 ssh-agent 时，`user.signingKey` 可以是公钥路径。

如果代码托管平台要显示 Verified，还需要把这把公钥作为 signing key 上传到对应平台。很多平台会把“SSH 登录用 key”和“提交签名用 key”分开管理，不要只上传一处就以为都生效了。

## 指纹模块是不是必须的

不是。

TPM 托管 SSH key 和指纹解锁不是同一个层次的问题：

1. TPM 负责让 SSH 和 Git signing 使用硬件保护的 key。
2. 指纹模块通常通过 `fprintd` 和 PAM，用于本地登录、锁屏解锁、`sudo` 提权。

如果是台式机，想买外置 USB 指纹模块，先查 [libfprint 支持设备列表](https://fprint.freedesktop.org/supported-devices.html)。很多标着“支持 Windows Hello”的小模块在 Linux 上不能直接用，盲买很容易踩坑。

另一条路是买带指纹的 FIDO2 安全密钥。它不依赖 Linux 指纹驱动，但 Git rebase 时如果要连续签几十个 commit，频繁触摸或识别失败也会很烦。

## 没有 Secure Boot 和磁盘加密还安全吗

要分威胁模型。

如果主要担心远程恶意程序把私钥文件偷走，TPM 托管比普通私钥文件强很多。攻击者最多在你的机器在线且权限足够时请求 TPM 帮它签名，不能把私钥明文复制走。

如果担心有人能物理接触机器，只开 TPM 不够。没有磁盘加密时，攻击者可以从其他系统启动，直接修改你的根文件系统，植入后门，再等你下次正常开机时借用 TPM。只开 Secure Boot 也不完整，因为合法签名的 Live USB 仍然可能读取未加密硬盘。

更完整的物理安全闭环通常是：

1. Secure Boot，降低引导链被篡改的风险。
2. LUKS 全盘加密，防止离线挂载硬盘改文件。
3. TPM 托管 key，避免私钥以普通文件形式可导出。

如果是一台很重、放在卧室里的台式机，现实物理风险可能很低。那 TPM 至少能先解决“远程偷私钥文件”的问题。是否继续折腾 Secure Boot 和 LUKS，取决于你对物理攻击的担心程度。

## 参考链接

- [Foxboron/ssh-tpm-agent](https://github.com/Foxboron/ssh-tpm-agent)
- [Git config: gpg.format and user.signingKey](https://git-scm.com/docs/git-config)
- [libfprint Supported Devices](https://fprint.freedesktop.org/supported-devices.html)
