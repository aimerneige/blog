---
title: "使用 MacBook 内置安全密钥完成远程 Git 签名"
date: 2026-07-12T18:04:00+08:00
draft: false
ShowToc: true
description: "用 macOS Secure Enclave、Touch ID 和 SSH Agent Forwarding 支撑 VS Code Remote SSH 开发"
categories: [Tool]
tags: [ssh,git,security,macos]
---

{{< notice warning >}}

本文完全使用 codex 生成，未经过人工核验，请注意鉴别其中内容

{{</ notice >}}

我的日常开发环境有点绕：MacBook 在手边，真正干活的是一台 Linux 服务器，VS Code 通过 Remote SSH 连过去。

如果 Git 签名密钥放在 YubiKey 里，本地提交还好，远程服务器上执行 `git commit` 就尴尬了。Git 命令跑在服务器上，YubiKey 插在 MacBook 上，服务器摸不到它。

解决思路是把 MacBook 自己当成安全密钥，然后通过 SSH Agent Forwarding 把签名请求转回本地。这样远程服务器负责跑 Git，本地 MacBook 负责用 Secure Enclave 和 Touch ID 完成签名。

## 这个方案适合什么情况

适合这些前提：

1. 本地机器是带 Touch ID 的 MacBook。
2. 远程开发通过 SSH 连接，例如 VS Code Remote SSH。
3. Git commit 使用 SSH signing，而不是 GPG signing。
4. 远程服务器是可信主机，因为 Agent Forwarding 本身有安全边界。

不适合把 `ForwardAgent yes` 写到所有主机上。远程主机一旦被攻破，攻击者可能临时借用转发过去的 Agent 访问你允许的目标。这个风险不会导出私钥，但足够麻烦，所以只给可信主机开。

## 在 macOS 上生成内置安全密钥

先在 macOS 上创建一个由系统安全模块保护的 SSH 身份：

```bash
sc_auth create-ctk-identity -l ssh -k p-256-ne -t bio
ssh-keygen -w /usr/lib/ssh-keychain.dylib -K -N ""
```

执行后会在当前目录生成类似下面的文件：

```text
id_ecdsa_sk_rk
id_ecdsa_sk_rk.pub
```

这里的 `id_ecdsa_sk_rk` 不是传统意义上的完整私钥。它更像是一个指向安全模块里真实密钥的句柄。真正的私钥不应该离开 Secure Enclave。

把这两个文件放进 `~/.ssh/` 后，配置本地 SSH：

```sshconfig
Host my-linux-server
    HostName <server-ip>
    User <username>
    IdentityFile ~/.ssh/id_ecdsa_sk_rk
    SecurityKeyProvider /usr/lib/ssh-keychain.dylib
    ForwardAgent yes
```

然后把公钥加入远程服务器：

```bash
ssh-copy-id -i ~/.ssh/id_ecdsa_sk_rk.pub my-linux-server
```

再次登录时，macOS 应该会弹出 Touch ID 请求。通过后就能进入远程服务器。

## 把 key 加入本地 Agent

SSH 登录可以直接使用 `SecurityKeyProvider`，但 Git signing 通过文件路径直接调用时可能会遇到 `device not found`。更稳的做法是让本地 `ssh-agent` 接管这把 resident key：

```bash
ssh-add -K -S /usr/lib/ssh-keychain.dylib
```

检查 Agent 里能否看到它：

```bash
ssh-add -L
```

如果这里能看到 `sk-ecdsa-sha2-nistp256@openssh.com` 开头的公钥，说明本地 Agent 已经准备好。

## 在远程服务器上配置 Git SSH 签名

登录远程服务器后，配置 Git 使用 SSH 格式签名：

```bash
git config --global gpg.format ssh
git config --global commit.gpgsign true
```

`user.signingkey` 可以写公钥内容。为了避免远程服务器找不到本地私钥，这里不要写本地 MacBook 上的私钥路径。更直接的方式是在远程的 `~/.gitconfig` 中写：

```ini
[user]
    signingKey = "key::sk-ecdsa-sha2-nistp256@openssh.com AAAA... ssh:"

[gpg]
    format = ssh

[commit]
    gpgsign = true
```

`key::` 后面接的是本地 `~/.ssh/id_ecdsa_sk_rk.pub` 的完整内容。也可以把公钥文件复制到远程服务器，再把 `user.signingkey` 指向那个 `.pub` 文件。

之后在远程服务器里执行：

```bash
git commit
```

签名请求会经过 SSH Agent Forwarding 回到 MacBook，本地弹出 Touch ID，通过后远程 Git commit 完成签名。

## VS Code Remote SSH 怎么处理

VS Code Remote SSH 会读取 macOS 的 `~/.ssh/config`。只要你平时就是通过同一个 `Host` 连接远程服务器，`ForwardAgent yes` 会一起生效。

如果长时间休眠或网络切换后签名失败，先断开 Remote SSH 再重连。多数时候是转发出来的 Agent socket 失效了。

## 安全边界

这个方案的好处是：私钥留在 MacBook 的安全模块里，远程服务器只能通过转发通道请求一次签名，不能把私钥文件拿走。

但这不等于可以信任任意远程主机。开启 Agent Forwarding 后，远程主机在你连接期间有机会请求 Agent 签名。OpenSSH 新版本支持 destination constraint，可以用来限制转发 key 的可用目标，但它要求本地和远程组件都配合支持。

所以最实用的规则是：

1. 只在自己的开发服务器上开启 `ForwardAgent yes`。
2. 不要写进 `Host *`。
3. 远程服务器如果失陷，立刻断开 SSH 会话，并从代码托管平台撤掉对应 signing key。

## 参考链接

- [Laptops all have built-in security tokens these days](https://ahelwer.ca/post/2026-05-08-builtin-u2f/)
- [OpenBSD ssh-add manual](https://man.openbsd.org/ssh-add)
- [Git config: gpg.format and user.signingKey](https://git-scm.com/docs/git-config)
