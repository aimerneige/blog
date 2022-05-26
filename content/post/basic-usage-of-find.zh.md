---
title: "find 指令的基本用法"
date: 2022-03-12T19:36:29+08:00
draft: false
ShowToc: true
categories: [Linux]
tags: [tool,cli]
cover:
    image: "images/find.png"
    alt: "Find Command On Cool Retro Term"
    relative: false
---

# 什么是 `find`

正如它的名字一样，`find` 指令用于查找文件。

> Linux find 命令用来在指定目录下查找文件。任何位于参数之前的字符串都将被视为欲查找的目录名。如果使用该命令时，不设置任何参数，则 find 命令将在当前目录下查找子目录与文件。并且将查找到的子目录和文件全部进行显示。
> 
> 来源: [菜鸟教程](https://www.runoob.com/linux/linux-comm-find.html)

> The find command in UNIX is a command line utility for walking a file hierarchy. It can be used to find files and directories and perform subsequent operations on them. It supports searching by file, folder, name, creation date, modification date, owner and permissions. By using the ‘-exec’ other UNIX commands can be executed on files or folders found.
> 
> From: [Geeks for Geeks](https://www.geeksforgeeks.org/find-command-in-linux-with-examples/)

# 基础语法

```bash
find [options] [path...] [expression]
```

> - The `options` attribute controls the treatment of the symbolic links, debugging options, and optimization method.
> - The `path...` attribute defines the starting directory or directories where find will search the files.
> - The `expression` attribute is made up of options, search patterns, and actions separated by operators.
> 
> From: [Linuxize](https://linuxize.com/post/how-to-find-files-in-linux-using-the-command-line/)

## [options]

`options` 属性用于控制一些额外选项。

{{< notice note >}}

如果查询 `man find`，会得到这样一份语法说明:

```bash
find [-H] [-L] [-P] [-D debugopts] [-Olevel] [starting-point...] [expression]
```

本文将 `[-H] [-L] [-P] [-D debugopts] [-Olevel]` 这一部分抽象成了 `options`

{{< /notice >}}

`-H`, `-L` and `-P` 用于控制对 [symbolic link](https://en.wikipedia.org/wiki/Symbolic_link) 的处理方法。

`[-D debugopts]` 用于控制调试功能。
 
`[-Olevel]` 用于控制优化方法。

{{< heimu >}}
具体细节查 man 吧，这块也不常用，有空补。
{{< /heimu>}}

## [path...]

`path` 即开始查找的根目录。

使用 `find` 时，这里可以是一个目录，也可以是多个目录。

{{< notice warning >}}
用户必须有对应目录的读权限才可以正常执行，否则会返回错误信息。
{{< /notice >}}

## [expression]

包含各种选项，搜索模式和操作。比如可以指定文件名，文件大小，修改日期等选项来过滤查找内容。

# 使用样例

### 搜索当前目录下全部名称为 `avatar` 的文件或文件夹

```bash
find . -name "avatar"
```

### 搜索当前目录下所有 go 源代码文件

```bash
find . -name "*.go" -type f
```

{{< notice note >}}
如果没有 `-type f`，输出结果可能包含有以 `*.go` 结尾的文件夹。
{{< /notice >}}

### 查找最近 20 天内更新过的文件

```bash
find . -ctime -20
```

### 只搜索当前目录下的文件和文件夹而不递归搜索

```bash
find . -maxdepth 1
```

{{< notice warning >}}
`-maxdepth` 作为全局选项应该位于其他选项的前面。

```bash
# 正确的做法
find . -maxdepth 1 -name "*avatar*"
# 不当的做法（会有警告）
find . -name "*avatar*" -maxdepth 1
```
{{< /notice >}}

### 删除当前目录下名为 temp 的文件

```bash
# 直接删
find . -type f -name "temp" -delete
# 打印一下删了哪些文件
find . -type f -name "temp" -delete -print
# 为了防止删错，还是确认一下吧
find . -type f -name "temp" -ok rm {} \;
```

### 查找一下七天前的旧日志，并在删除之前询问它们

```bash
find ./log -type f -mtime +7 -ok rm {} \;
```

### 查找指定目录下有哪些空文件

```bash
# 打印文件名
find /home/aimerneige /root -type f -size 0
# 调用 ls 看一下文件属性吧
find /home/aimerneige /root -type f -size 0 -exec ls -l {} \;
```

### 查找当前目录下指定大小范围内的文件

```bash
# 大于 200k
find . -type f -size +200k
# 小于200k
find . -type f -size -200k
# 在 50k 与 200k 之间
find . -type f -size +50k -200k
```

### 查找全部 ntfs 硬盘中拷贝出的文件

```bash
# 查找权限为 777 的文件，并打印详细信息
find . -type f -perm 777 -exec ls -l {} \;
# 777 太讨厌了，权限改为默认的 664
find . -type f -perm 777 -exec chmod 664 {} \;
```

### 看一下当前目录下文件占用情况

```bash
find . -type d -exec du -sh {} \;
```

### 批量添加文件后缀

```bash
find . -type f -name "*.JPG" -exec mv {} {}.jpg \;
```

### 使用 bat 查看当前目录下全部 go 源代码

```bash
find . -type f -name "*.go" -exec bat {} \;
```

# 使用技巧

### 当搜索目标路径为当前目录`.`时，可以省略不写

```bash
find -type f -name "*.go"
# 上面的指令和下面的等价
find . -type f -name "*.go"
```

### 当结果过多时，使用 `xargs` 代替 `-exec`

```bash
find ~ -type f -name "*.cpp" -exec ls -l {} \;
```
exec 的原理是将查找结果一次性发送到后面的命令当中，如果结果过多会导致数据溢出而报错。

使用管道以及 xargs 来避免这个问题：

```bash
find ~ -type f -name "*.cpp" | xargs ls -l
```

结果太多了不好看，我们把结果输出到一个文件里面。

```bash
find ~ -type f -name "*.cpp" | xargs ls -l > ./result.txt
```
