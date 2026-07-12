---
title: "解决 Rebase 地狱的优雅技巧"
date: 2026-07-12T17:58:00+08:00
draft: true
ShowToc: true
description: "用先 merge 再 reset --soft 的方式只解决一次冲突，同时保留线性历史"
categories: [Tool]
tags: [git]
---

长期没合主分支的 feature 分支，最怕遇到一个文件两边都反复改过。

直接 `rebase` 的时候，Git 会把 feature 上的 commit 一个个拿出来重放。你刚解完第一个 commit 的冲突，`git rebase --continue`，下一个 commit 又在同一个文件上炸一次。改动越琐碎，冲突次数越多。

这就是很常见的 rebase 地狱。

这里记录一个我觉得很顺手的技巧：先 merge，把冲突一次性解完；再 `reset --soft` 回主分支，把最终变更压成一个普通 commit。

它解决三个问题：

1. 直接 rebase 要反复处理同一个文件冲突。
2. 普通 merge 会留下 merge commit。
3. 手动 squash commit 时还要找当初的分支点。

## 适用场景

这个技巧适合这种分支：

1. feature 分支已经落后主分支很久。
2. feature 上有很多过程性 commit，最终只想保留一个干净 commit。
3. 团队希望提交历史线性，不想留下 merge commit。

如果 feature 上每个 commit 都有独立审计价值，不要用这个方法把它们压没。那就老老实实 rebase，或者接受 merge commit。

## 操作前先做两件事

确认工作区干净：

```bash
git status
```

给当前分支留一个备份：

```bash
git branch backup/feature-before-squash
```

复杂历史操作不要省这一步。备份分支不影响主线，但能在操作翻车时救命。

下面假设当前分支是 `feature`，目标主分支是 `origin/main`。如果你的主分支叫 `master`，把命令里的 `origin/main` 换掉。

## 第一步：先 merge 主分支

在 feature 分支上执行：

```bash
git merge origin/main
```

这一步的目的不是为了保留 merge commit，而是为了利用 merge 的冲突处理方式。

rebase 是逐个 commit 重放。merge 关注的是两个分支最终状态的合并，所以同一个文件通常只需要处理一次最终冲突。

如果出现冲突，手动解决后只 stage 你处理过的文件：

```bash
git add path/to/resolved-file
git commit -m "chore: merge main into feature before squash"
```

现在 feature 分支上会有一个临时 merge commit。它只是中间状态，后面会被拿掉。

## 第二步：soft reset 回主分支

执行：

```bash
git reset --soft origin/main
```

`--soft` 只移动 `HEAD`，不改暂存区和工作区。

所以这一步之后，分支指针回到了 `origin/main`，但你刚才 merge 后得到的最终代码状态仍然留在暂存区里。

换句话说，Git 现在看到的是：你站在最新主分支上，手里已经 staged 了一整份 feature 的最终变更。

可以检查一下：

```bash
git status
git diff --cached
```

## 第三步：提交成一个普通 commit

确认暂存区内容正确后，提交：

```bash
git commit -m "feat: implement xxx"
```

完成后，这个分支看起来就像是从最新 `origin/main` 切出来，然后只做了一个 commit。中间那个临时 merge commit 不会留下，提交历史也是线性的。

## 为什么不用 merge --squash

`git merge --squash` 也能做类似的事，但方向很重要。

如果你站在 feature 分支上执行：

```bash
git merge --squash origin/main
```

这不是“把 feature 压到 main 上”，而是把 `origin/main` 的变更 squash 到当前 feature 分支。它不会得到我们想要的线性 feature commit。

如果要用 `merge --squash`，通常应该从最新主分支新建一个分支，然后把旧 feature squash 进来：

```bash
git switch -c feature-squashed origin/main
git merge --squash feature
git commit -m "feat: implement xxx"
```

这也是一个可选方案。只是当你已经在原 feature 分支上解完一次 merge 冲突时，`reset --soft origin/main` 更顺手。

## 推送前的提醒

这个操作会生成新的 commit id。如果原 feature 分支已经推到远程，再更新远程分支就属于改写远程分支历史。

多人协作分支不要直接覆盖。至少先确认没有别人基于旧分支继续开发，再使用更保守的方式更新远程，例如 `--force-with-lease`。

## 参考链接

- [Git merge documentation](https://git-scm.com/docs/git-merge)
- [Git reset documentation](https://git-scm.com/docs/git-reset)
