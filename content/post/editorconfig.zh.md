---
title: "利用 EditorConfig 定义代码格式，统一代码风格"
date: 2021-01-29T16:37:25+08:00
draft: false
ShowToc: true
description: "EditorConfig 的简要介绍"
categories: [Development,Others]
tags: [editor,tool]
cover:
    image: "images/editorconfig.png"
    alt: "editorconfig-logo"
    relative: false
---

在多人协作的项目中，为了同一代码格式，可以使用 editorconfig 来定义，这样不仅可以帮助协作者快速了解当前项目要求的代码风格，也可以方便使用一些格式化工具保证代码风格按照预期格式化。

## 快速了解

> ### What is EditorConfig?
>
> EditorConfig helps maintain consistent coding styles for multiple developers working on the same project across various editors and IDEs. The EditorConfig project consists of **a file format** for defining coding styles and a collection of **text editor plugins** that enable editors to read the file format and adhere to defined styles. EditorConfig files are easily readable and they work nicely with version control systems.
> _Source_: <https://editorconfig.org/>

## 简单示例

> 示例来自 <https://editorconfig.org/>

```.editorconfig
# EditorConfig is awesome: https://EditorConfig.org

# top-most EditorConfig file
root = true

# Unix-style newlines with a newline ending every file
[*]
end_of_line = lf
insert_final_newline = true

# Matches multiple files with brace expansion notation
# Set default charset
[*.{js,py}]
charset = utf-8

# 4 space indentation
[*.py]
indent_style = space
indent_size = 4

# Tab indentation (no size specified)
[Makefile]
indent_style = tab

# Indentation override for all JS under lib directory
[lib/**.js]
indent_style = space
indent_size = 2

# Matches the exact files either package.json or .travis.yml
[{package.json,.travis.yml}]
indent_style = space
indent_size = 2
```

## 使用方法

直接在项目目录下新建文件 `.editorconfig` 写入配置，安装对应插件后即可，保存文件时会按照配置文件自动格式化。

额外地，如果你在 Windows 下如果使用 **Windows Explorer** 新建 `.editorconfig` 文件，需要将文件名写为 `.editorconfig.`，Windows 会自动重命名为 `.editorconfig`。

## 特殊符号的含义

| 符号         | 含义                                                                         |
| ------------ | ---------------------------------------------------------------------------- |
| \*           | 匹配任何字符串，除了路径分割符 (/)                                           |
| \*\*         | 匹配任何字符串                                                               |
| ?            | 匹配任何单字符                                                               |
| [name]       | 匹配 name 中所包含的任一字符                                                 |
| [!name]      | 匹配不包含在 name 中的任一字符                                               |
| {s1,s2,s3}   | 匹配任何给定单字符串 (用逗号分割) (**在 EditorConfig Core 0.11.0 后受支持**) |
| {num1..num2} | 匹配任何在 num1 和 num2 之间的数字，num1 和 num2 可以是正数也可以是负数      |

## 支持的配置属性

1. indent_style 缩进样式 {tab, space}
2. indent_size 每次缩进相当于多少列 {2,4,8...} (当 indent_style 设置为 space 时使用)
3. tab_width 每次缩进相当于多少列 {2,4,8...} (当 indent_style 设置为 tab 时使用)
4. end_of_line 换行 {lf, cr, crlf}
5. charset 编码 {latin1, utf-16be, utf-16le, utf-8, utf-8-bom, unset}
6. trim_trailing_whitespace {true, false} 是否删掉结尾的空白字符
7. insert_final_newline {true, false} 是否在结尾插入新行
8. root {true, false} 是否顶级配置文件
