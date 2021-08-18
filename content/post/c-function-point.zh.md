---
title: "C 函数指针"
date: 2020-11-04T21:00:39+08:00
draft: false
ShowToc: true
description: "函数指针用法"
categories: [ProgramLanguage]
tags: [C/C++,Teach]
---

函数指针在大型的 C 语言项目中十分重要，但是学校对它的介绍一带而过，国内一些介绍函数指针的文章十分粗浅甚至存在错误（这里就不点名了），因此博主写了这篇文章介绍函数指针，希望能够帮助一些 C 语言学习者。

文章部分内容翻译引用于 <https://www.geeksforgeeks.org/function-pointer-in-c/>

## 函数指针的概念

类似变量，函数也会被分配一段存储空间，这段存储空间的首地址即被称做这个函数的地址。而且函数名表示的就是这个地址。既然是地址，我们就可以定义一个指针变量来存放，这个指针变量就叫做函数指针变量，简称函数指针。

## 函数指针的定义

下面的语句定义了一个指向函数的指针变量 p。其中 `void *`表示返回值，`(*p)` 表示 p 是一个指针变量， `(int, float)` 是函数的参数列表。

```c
void *(*p) (int, float);
```

这样我们就得到了一个指针变量 p，它的类型为 `void * (*)(int, float)`

所以函数指针的定义方法为：

```
函数返回类型 (*指针变量名) (函数参数列表);
```

这里的函数参数列表类似函数声明，只需写出变量类型即可，并不需要定义变量。

即下面的俩种写法等价并且第二种写法中定义的变量并没有任何意义，建议使用第一种写法，不要使用第二种写法。

```c
void *(*p) (int, float);
```

```c
void *(*p) (int a, float b);
```

## 如何对函数指针赋值

```c
int Func(int x); // 函数的声明

int (*p) (int x); // 函数指针的定义

p = &Func; // 函数指针的赋值
p = Func; // 另一种可行的写法
```

注：对于俩种赋值写法的详细说明见[对函数赋值和调用的一些说明](#对函数赋值和调用的一些说明)

## 函数指针的调用

```c
#include <stdio.h>

int max(int a, int b); // 函数声明

int main(int argc, char const *argv[])
{
    int a = 12;
    int b = 32;

    int (*p)(int, int); // 函数指针定义
    p = &max; // 函数指针赋值

    int c = (*p)(a, b); // 函数指针的调用
    printf("%d\n", c); // 输出 `32`

    return 0;
}

// 函数定义
int max(int a, int b)
{
    return a > b ? a : b;
}
```

另一种可行的写法

```c
#include <stdio.h>

int max(int a, int b); // 函数声明

int main(int argc, char const *argv[])
{
    int a = 12;
    int b = 32;

    int (*p)(int, int); // 函数指针定义
    p = max; // 函数指针赋值

    int c = *p(a, b); // 函数指针的调用
    printf("%d\n", c); // 输出 `32`

    return 0;
}

// 函数定义
int max(int a, int b)
{
    return a > b ? a : b;
}
```

注：对于这俩种调用的写法的详细说明见[对函数赋值和调用的一些说明](#对函数赋值和调用的一些说明)

## 函数指针中要注意的一些内容

1. 与一般的指针不同，函数指针指向代码而不是数据。通常，一个函数指针存储了可执行代码的起始位置。
2. 与普通指针不同，我们使用函数指针时不需要分配和释放内存。
3. 函数名也可以用来获取函数的地址。（详见[对函数赋值和调用的一些说明](#对函数赋值和调用的一些说明)）
4. 类似普通的指针，我们也有函数指针数组。（详见[函数指针数组示例](#函数指针数组示例)）
5. 函数指针可被用于 switch case 结构中，例如[函数指针数组示例](#函数指针数组示例)中的示例程序中，用户可以通过输入 0 ～ 2 来选择不同的操作。
6. 就像普通数据的指针一样，一个函数指针同样可以被用作函数的参数和返回值，例如[函数指针作为参数的示例](#函数指针作为参数的示例)中的程序中 `wrapper()` 函数接受 `void (*fun)()` 作为参数并且执行这个函数。这个特性有很多的应用，你可以在[函数指针作为参数的应用](#函数指针作为参数的应用)中查看更多内容。
7. C++ 中的许多面向对象特性都是使用 C 中的函数指针实现的，例如虚函数，类方法是使用函数指针实现的另一个示例。

## 对函数赋值和调用的一些说明

通常，既然是指针赋值，我们会使用取地址操作来获取地址，然后使用 `*` 运算符调用，但是，对于函数来说，直接使用函数名也可以获得地址。即如下俩种写法等价：

```c
p = &Func;
(*p)(2, 3);
```

```c
p = Func;
p(2, 3);
```

编译执行以下程序：

```c
#include <stdio.h>
#include <stdlib.h>

int max(int a, int b);

int main(int argc, char const *argv[])
{
    printf("%p\n",  (max) );
    printf("%p\n", (&max) );
    return 0;
}

int max(int a, int b)
{
    return a > b ? a : b;
}
```

你会发现 `(max)` `(&max)` 拥有相同的值，即直接使用函数名也可以获得地址。

因此，我更推荐第二种没有 `&` 和 `*` 的写法，更加直观易用。

## 函数指针数组示例

```c
#include <stdio.h>

void add(int a, int b)
{
    printf("Addition is %d\n", a + b);
}

void subtract(int a, int b)
{
    printf("Subtraction is %d\n", a - b);
}

void multiply(int a, int b)
{
    printf("Multiplication is %d\n", a * b);
}

int main()
{
    // fun_ptr_arr 是一个函数指针的数组
    void (*fun_ptr_arr[])(int, int) = {add, subtract, multiply};
    unsigned int ch, a = 15, b = 10;

    printf("Enter Choice: 0 for add, 1 for subtract and 2 for multiply\n");
    scanf("%d", &ch);

    if (ch > 2)
    {
        return 0;
    }

    (*fun_ptr_arr[ch])(a, b);

    return 0;
}
```

## 函数指针作为参数的示例

```c
// 一个简单的 C 语言程序来演示使用函数指针作为参数
#include <stdio.h>

// 俩个简单的函数
void fun1() { printf("Fun1\n"); }
void fun2() { printf("Fun2\n"); }

// 一个接受函数作为参数并在内部执行这个函数的函数
void wrapper(void (*fun)())
{
    fun();
}

int main()
{
    wrapper(fun1);
    wrapper(fun2);
    return 0;
}
```

## 函数指针作为参数的应用

我们可以使用将函数指针作为参数来避免书写重复的代码，例如较为简单的函数 `qsort()` 可以被用来排序数组或其他任何的自定义结构体。不仅这些，有了函数指针和空指针，使用 `qsort()` 函数可以对任何数据类型进行排序。

```c
// 一个关于 qsort 和比较器的定义
#include <stdio.h>
#include <stdlib.h>

// 一个比较器示例函数
// 它被用对一个整数数组进行排序
// 为了对任何其他数据类型或条件的任何数组进行排序
// 我们需要编写更多的比较函数
// 这样我们就可以使用相同的 qsort()
int compare(const void *a, const void *b)
{
    return (*(int *)a - *(int *)b);
}

int main()
{
    int arr[] = {10, 5, 15, 12, 90, 80};
    int n = sizeof(arr) / sizeof(arr[0]);

    qsort(arr, n, sizeof(int), compare);

    for (int i = 0; i < n; i++) {
        printf("%d ", arr[i]);
    }
    return 0;
}
```

类似 `qsort()` 函数，我们可以定义自己的可以用于任何数据类型的函数来处理不同的任务。下面是一个搜索函数的示例，它可以被用于任何数据类型。事实上，我们可以通过写一个专门的比较函数使用这个搜索函数来找到相近的元素（低于某阈值）。

```c
#include <stdio.h>
#include <stdbool.h>

// 一个被用来对整数数组进行搜索的比较函数
bool compare(const void *a, const void *b)
{
    return (*(int *)a == *(int *)b);
}

// 可以被用来在一个长度为 arr_size 的数组 arr[] 中
// 搜索元素 *x 的通用 search() 函数。
// 注意这里使用 void 指针，这样函数就可以在调用
// 的时候传入任何类型的参数
// ele_size 是数组元素的大小
int search(void *arr, int arr_size, int ele_size, void *x,
           bool compare(const void *, const void *))
{

    // 因为 char 占用一个字节，因此我们使用 char 指针
    // 来可以保证用于任何类型的指针运算都正确，我们
    // 需要将 index 与元素的大小 ele_size 相乘
    char *ptr = (char *)arr;

    int i;
    for (i = 0; i < arr_size; i++)
        if (compare(ptr + i * ele_size, x))
            return i;

    // 如果没有找到元素
    return -1;
}

int main()
{
    int arr[] = {2, 5, 7, 90, 70};
    int n = sizeof(arr) / sizeof(arr[0]);
    int x = 7;
    printf("Returned index is %d ", search(arr, n,
                        sizeof(int), &x, compare));
    return 0;
}
```

这个函数可以被用于任何类型的数据，只要定义一个比较函数。

## 如何使用 typedef 定义函数指针类型

与一般的定义不同，函数指针在使用 typedef 重命名时，新的变量名不是在末尾而是类似函数指针变量定义的写法。

下面是一个简单的例子：

```c
typedef int (*type_name) (const void *, double);
```

其中 `int` 为函数返回值类型， `const void *, double` 是函数接受的参数列表，`(*type_name)` 表明定义的是一个函数指针，它的类型为 `int (*)(const void *, double)`，新的类型名为 `type_name`，你可以使用 `type_name` 来定义一个类型为 `int (*)(const void *, double)` 的函数指针。

也就是说，使用定义函数指针类型的格式如下：

```
typedef 函数返回值类型 (*类型名) (函数参数列表)
```

接下来看一下 `qsort()` 函数的源代码：

首先是函数 `qsort()` 的声明：

```c
extern void qsort (void *__base, size_t __nmemb, size_t __size,
		   __compar_fn_t __compar) __nonnull ((1, 4));
```

这里有一个新的数据类型 `__compar_fn_t`，我们知道它是一个函数指针，我们找一下它的定义：

```c
typedef int (*__compar_fn_t) (const void *, const void *);
```

上例中 `search()` 函数可以这样定义：

```c
// 类型定义
typedef bool (*compare_fun)(const void *, const void *);
// 函数声明
int search(void *arr, int arr_size, int ele_size, void *x, compare_fun compare);
```

---

建议阅读： <https://www.geeksforgeeks.org/function-pointer-in-c/>
