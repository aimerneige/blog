---
title: "这不是 Bug，而是语言特性"
date: 2020-11-05T14:37:41+08:00
draft: false
ShowToc: true
description: "C 语言中 goto 带来的奇怪问题"
categories: [Program]
tags: [C/C++]
---

今天遇到一个奇怪的问题：

一个 C 语言初学者写了这样的错误代码：

```c
switch (a)
{
    case1:
        // do something
        break;
    case2:
        // do something
        break;
    case3:
        // do something
        break;
    default:
        break;
}
```

错误很容易解决，但是，在编译这样的程序时，编译器居然没有报错？？！！

那么 `case1` `case2` 这些东西是哪里来的？

几番求证无果，最后在翻阅《C 专家编程》这本书的时候突然发现了原因：

首先像下面这样写是可以的：

```c
switch (i)
{
    case 5 + 3: do_again:
    case 2: printf("I loop unremittingly\n"); goto do_again;
    default: i++;
    case 3: ;
}
```

这里定义了一个标签 `do_again`，并且通过 `goto` 跳转。

原错误代码中 `case1` `case2` 等被编译器理解为了标签。

由于 `goto` 不被建议使用，博主居然已经忘记了标签和 `goto` 的用法。

不管怎么说，问题解决了。

这不是 Bug，而是 C 语言的特性。 #(滑稽)

类似地，有如下代码：

```c
#include <stdio.h>

int main() {
    https://aimerneige.com
    printf("Hello World!\n");

    return 0;
}
```

这里的代码直接贴上了一个 url，但是编译器也没有报错，是因为 `https` 被识别为标签，而后面的内容被识别为注释。
