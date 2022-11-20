---
title: "定制你的 rime 提升编程体验"
date: 2021-08-19T01:50:11+08:00
draft: false
ShowToc: true
categories: [Linux]
tags: [software,tool,rime]
cover:
    image: "images/rime.png"
    alt: "rime-logo"
    relative: false
---

> 平时在使用 Linux 写代码的时候，总有一点让我很难受，那就是当我准备写中文注释的时候，输入 `//` 的时候，输入法总是希望我手动选择是要输入 `/` 还是中文的 `、`，随之弹出来的框非常影响代码编辑，经常打断我的思路，类似的还有反引号等符号，不厌其烦的我去查找了一些资料，终于彻底解决了这个问题。

# 准备

阅读本文前，你要保证你在使用 [rime](https://rime.im/) 输入法。遇到任何问题请多查阅 rime 提供的[文档](https://github.com/rime/home/wiki/CustomizationGuide)。

本文所提到的内容在 fedora34 系统下，ibus-rime 包测试通过。

# 找到 rime 用户资料夹

不同的平台下，rime 用户资料夹的位置会有所不同

| 平台   | rime 用户资料夹位置        |
| ------ | -------------------------- |
| ibus   | ~/.config/ibus/rime        |
| fcitx  | ~/.config/fcitx/rime       |
| fcitx5 | ~/.local/share/fcitx5/rime |

# 创建你的配置文件

如果你从来没有配置过 rime，那么你可以直接在 rime 用户资料夹下创建名为 `default.custom.yaml` 的配置文件，写入如下内容:

```yml
patch:
  punctuator/full_shape:
    "`": "｀"
    "~": "～"
    "!": "！"
    "@": "＠"
    "#": "＃"
    "$": "￥"
    "%": "％"
    "^": "……"
    "&": "＆"
    "*": "×"
    "(": "（"
    ")": "）"
    "_": "——"
    "+": "＋"
    "-": "－"
    "=": "＝"
    "[": "【"
    "]": "】"
    "{": "｛"
    "}": "｝"
    "|": "｜"
    "\\": "、"
    "/": "、"
    ";": "；"
    "'": "‘"
    ",": "，"
    ".": "。"
    "<": "《"
    ">": "》"
    "?": "？"
  punctuator/half_shape:
    "`": "`"
    "~": "~"
    "!": "！"
    "@": "@"
    "#": "#"
    "$": "￥"
    "%": "%"
    "^": "……"
    "&": "&"
    "*": "×"
    "(": "（"
    ")": "）"
    "_": "——"
    "+": "+"
    "-": "-"
    "=": "="
    "[": "【"
    "]": "】"
    "{": "｛"
    "}": "｝"
    "|": "｜"
    "\\": "、"
    "/": "/"
    ";": "；"
    "'": "’"
    ",": "，"
    ".": "。"
    "<": "《"
    ">": "》"
    "?": "？"
```

以上配置的具体细节请查阅[文档](https://github.com/rime/home/wiki/CustomizationGuide#%E4%B8%80%E4%BE%8B%E5%AE%9A%E8%A3%BD%E6%A8%99%E9%BB%9E%E7%AC%A6%E8%99%9F)。

# 应用配置

保存好你的配置文件之后，切换输入法到 rime，在托盘右击你的输入法（fedora 下左键单击也是一样的效果）选择 **部署** ，稍等片刻，等待 rime 部署你的配置文件后，如果没有错误警告，那么恭喜你应用成功。之后在中文半角状态下输入 `/` 时会直接输入 `/` 而没有烦人的二级窗口提示你选择要输入的内容，可以愉快的写中文注释了。

# 其他配置

除了上面提到的内容，还可以修改其他配置，具体可以查看官方文档，这里额外介绍几个常用的配置：

## 候选词 水平/垂直 切换

在 rime 用户资料夹下 `build/ibus_rime.yaml` 这个文件中写入如下内容：

```yaml
style:
  horizontal: true
```

## 候选词数量设置

在 rime 用户资料夹下 `default.custom.yaml` 这个文件中写入如下内容：

```yaml
patch:
  menu/page_size: 7
```

{{< notice info >}}
数值范围为 1 ~ 9
{{< /notice >}}

# 实用插件

如果你正在使用 Gnome，又懒得修改配置文件，请一定要尝试一下 [IBus Tweaker](https://extensions.gnome.org/extension/2820/ibus-tweaker/) 这个插件。

{{< notice note >}}
你必须先安装 [Extensions](https://flathub.org/apps/details/org.gnome.Extensions) 才可以在 Gnome 下使用这个插件。
{{< /notice >}}

# 参考链接

- [Rime](https://rime.im/)
- [Rime 定製指南](https://github.com/rime/home/wiki/CustomizationGuide)
- [鼠须管输入法配置](https://www.hawu.me/others/2666)