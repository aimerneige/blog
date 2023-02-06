---
title: "Ubuntu 19.10 配置 Kotlin 开发环境"
date: 2020-02-16T01:25:45+08:00
draft: false
ShowToc: true
categories: [Linux]
tags: [ubuntu,linux,kotlin]
# cover:
#     image: "images/blue_poison.jpg"
#     alt: "Blue Poison"
#     caption: "A Cute Blue Poison"
#     relative: false
---

# Ubuntu 19.10 配置 Kotlin 开发环境

## 使用工具

> VSCode

## 安装 Kotlin 编译器

```bash
sudo snap install kotlin --classic
```

如果出现错误，执行以下命令：

```bash
sudo apt install snap
```

这条指令执行后，系统安装的内容有：

- kotlinc
- kotlinc-jvm
- kotlinc-js
- kotlin-dce-js

可以通过以下指令查看版本，如果有输出证明安装成功。

俩条指令都可以，建议使用上面的。

```bash
kotlin -version
kotlinc -version
```

## 安装插件

- 这俩个貌似安装一个就可以了，也可以都安装。

  - `Kotlin`
  - `Kotlin Language`

- 安装下面这个插件后在 `文件` -> `首选项` -> `设置` -> `扩展` -> `Run Code Configuration` 中找到并勾选 `Run In Terminal`

  - `Code Runner`

# 测试

1. 建立新文件 `HelloWorld.kt`

```kotlin
fun main(args: Array<String>) {
    println("Hello, World!")
}
```

2. 通过点击右上角三角形（由 `Code Runner` 提供的快捷方式）来编译运行，查看输出。

3. 如果看到终端输出 `Hello, World!` 的内容，说明开发环境搭建成功。

## 参考内容：

- https://askubuntu.com/questions/917223/installing-kotlin-securely-with-package-signatures-auto-update-etc

---

当然你也可以直接用 `intellj-idea`
