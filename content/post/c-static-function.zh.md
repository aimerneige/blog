---
title: "C 语言静态函数"
date: 2020-10-31T20:31:36+08:00
draft: false
ShowToc: false
categories: [Program]
tags: [C/C++,Teach]
---

在 C 语言中，函数默认是全局的。在函数前加“static”关键字可以使一个函数变成静态函数。例如，下面的函数 fun() 是静态的：

```c
static int fun(void)
{
    printf("I am a static funciton.\n");
}
```

与 C 语言中的全局函数不同，对静态函数的访问仅限于声明它们的文件。因此，当我们想要限制函数的访问时，我们可以将函数定义为静态的。另外，如果我们想要在其他文件中使用相同的函数名，我们也可以将函数定义为静态的。

例如，我们在文件 `file.c` 中存储了下面的程序：

```c
// in file `file1.c`
#include <stdio.h>

static void fun1()
{
    printf("fun1 called.\n");
}
```

然后，我们在文件 `file2.c` 中存储了这样的程序：

```c
// in file `file2.c`
#include <stdio.h>

int main(void)
{
    fun1();

    return 0;
}
```

接下来，如果我们按照如下的命令编译：

```bash
gcc file2.c file1.c
```

你会得到这样的链接错误：

```bash
undefined reference to `fun1'
```

这是因为 fun1() 函数在 file1.c 中被定义为静态，因而不能在 file2.c 中引用。
