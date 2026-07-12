---
title: "SSH Key 密码和 SSH Agent 的基本用法"
date: 2026-07-12T18:01:00+08:00
draft: true
ShowToc: true
description: "记录 SSH 私钥密码、SSH Agent、macOS Keychain 和 Agent Socket 泄露风险"
categories: [Tool]
tags: [ssh,security]
---

SSH key 不设置密码能不能用？能用。

安不安全？要看你愿不愿意接受一个前提：只要本地私钥文件被别人读走，对方就能直接拿它登录所有信任这把 key 的服务器。

所以我的结论很简单：普通文件形式的 SSH 私钥应该设置 passphrase，然后用 SSH Agent 把日常输入成本降下来。

## Passphrase 保护的是什么

SSH 公钥可以到处放，服务器上的 `~/.ssh/authorized_keys`、GitHub、GitLab 里放的都是公钥。真正需要保护的是本地的私钥文件，例如：

```text
~/.ssh/id_ed25519
~/.ssh/id_rsa
```

如果私钥没有 passphrase，恶意程序、泄露的备份、临时离座时被打开的终端，都可能直接把它拿去用。

如果私钥有足够强的 passphrase，对方即使拿到文件，也还要先破解 passphrase。它不是万能保护，但至少把“拷走文件就能用”变成了“拷走文件后还要破解”。

## Passphrase 应该怎么设

不要设成短密码。`123456`、`password`、生日、常用单词，这类 passphrase 和没有差不多。

更好的方式是使用一段容易记住但足够长的短语。它不一定要像密码管理器生成的随机字符串那样折磨自己，但长度要够，词之间最好有一些不容易被猜到的组合。

如果已经有一把没有 passphrase 的 key，可以直接修改，不需要重新上传公钥：

```bash
ssh-keygen -p -f ~/.ssh/id_ed25519
```

如果你的 key 不是 `id_ed25519`，把路径换成实际文件名。

执行后按提示输入旧 passphrase，再输入新的 passphrase。旧 passphrase 为空时直接回车即可。

## SSH Agent 解决的是便利性

SSH Agent 的作用是把已经解锁的私钥放在当前登录会话里。你输入一次 passphrase，后续 `ssh`、`git fetch`、`git push` 就可以直接让 Agent 代签，不需要每次重复输入。

先看 Agent 里当前有哪些 key：

```bash
ssh-add -l
```

如果提示找不到身份，添加自己的私钥：

```bash
ssh-add ~/.ssh/id_ed25519
```

Linux 桌面环境通常已经有自己的 Agent 或 keyring。如果你的环境没有自动启动 Agent，可以手动启动：

```bash
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519
```

不要急着把这两行塞进 shell 配置文件。很多桌面环境已经会管理 Agent，重复启动反而容易让 `SSH_AUTH_SOCK` 指到旧 socket。先确认自己的发行版和桌面环境怎么做，再决定是否需要手动配置。

## macOS 上配合 Keychain

macOS 的 OpenSSH 可以和系统 Keychain 配合。添加私钥时使用：

```bash
ssh-add --apple-use-keychain ~/.ssh/id_ed25519
```

然后在 `~/.ssh/config` 里写：

```sshconfig
Host *
    AddKeysToAgent yes
    UseKeychain yes
    IdentityFile ~/.ssh/id_ed25519
```

这样第一次使用时输入 passphrase，之后由 Keychain 帮你保存。重启之后 Agent 本身还是空的，但 SSH 客户端可以从 Keychain 取回 passphrase，再把 key 加回 Agent。

注意：`UseKeychain` 是 macOS 的扩展配置。Linux 或 Windows 的 OpenSSH 不认识这个选项，复用同一份配置文件时要删掉或拆成不同配置。

## 针对具体主机写配置

如果有几台常用机器，可以把通用配置放在 `Host *`，主机信息单独写：

```sshconfig
Host *
    AddKeysToAgent yes
    UseKeychain yes
    IdentityFile ~/.ssh/id_ed25519

Host proart
    HostName 192.168.2.142
    User aimer

Host nahida
    HostName 192.168.2.141
    User aimer
```

`Host proart` 和 `Host nahida` 不必重复写 `IdentityFile`，因为它们会继承 `Host *` 里的默认 key。如果某台机器要用不同 key，再在那一段单独覆盖。

## Agent Socket 泄露会怎样

SSH Agent 不会在 socket 文件里存私钥明文。`SSH_AUTH_SOCK` 指向的是一个 Unix socket，本质上是客户端和 Agent 进程通信的入口。

所以 socket 路径泄露不等于私钥文件泄露，但它有临时风险：如果同一台机器上的恶意进程拿到了访问这个 socket 的权限，它可能在当前会话里借用你的 Agent 发起签名请求。

这个风险有几个边界：

1. 对方不能从 socket 里导出你的私钥。
2. Agent 进程退出、用户登出或机器重启后，这条通道会失效。
3. 正常情况下，socket 权限只允许当前用户访问。

这也是为什么本机被拿到 root 权限后，Agent 只能降低损失，不能提供绝对安全。安全模型要从系统账户、磁盘加密、锁屏习惯一起看。

## 小结

普通 SSH 私钥建议加 passphrase。passphrase 负责兜住私钥文件泄露，SSH Agent 负责把日常使用变得不烦。

最舒服的配置不是“把密码设短一点”，而是“密码设强一点，然后让 Agent 和系统钥匙串替你记住一次”。

## 参考链接

- [OpenBSD ssh-add manual](https://man.openbsd.org/ssh-add)
- [OpenBSD ssh-keygen manual](https://man.openbsd.org/ssh-keygen)
