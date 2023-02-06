---
title: "每天一个 Python 小知识 assert"
date: 2020-05-28T23:10:07+08:00
draft: false
ShowToc: true
categories: [Python]
tags: [python]
---

首先来看下 w3schools 的解释

> ### Example
>
> Test if a condition returns True:
>
> ```python
> x = "hello"
>
> #if condition returns True, then nothing happens:
> assert x == "hello"
>
> #if condition returns False, AssertionError is raised:
> assert x == "goodbye"
> ```
>
> ## Definition and Usage
>
> The `assert` keyword is used when debugging code.
>
> The `assert` keyword lets you test if a condition in your code returns True, if not, the program will raise an AssertionError.
>
> You can write a message to be written if the code returns False, check the example below.
>
> ## More Examples
>
> ### Example
>
> Write a message if the condition is False:
>
> ```python
> x = "hello"
>
> #if condition returns False, AssertionError is raised:
> assert x == "goodbye", "x should be 'hello'"
> ```
>
> 来源： https://www.w3schools.com/python/ref_keyword_assert.asp

帮助那些英语不好的 python 学习者翻译一下

---

### 示例

测试一个条件的返回值是否为真

```python
x = "hello"

#if condition returns True, then nothing happens:
assert x == "hello"

#if condition returns False, AssertionError is raised:
assert x == "goodbye"
```

## **定义和用法：**

当调试代码的时候，会使用 `assert` 关键字。

`assert` 关键字可以允许你测试你代码中的一个条件判断的返回值是否返回 `True`，如果不是的话，程序将会抛出一个`AssertionError` 。

你可以写一条用来在条件返回假时打印的信息，测试下面的示例代码：

## 更多示例

### 示例

如果条件为假，输出一条信息

```python
x = "hello"

#if condition returns False, AssertionError is raised:
assert x == "goodbye", "x should be 'hello'"
```

---

然后我们看下菜鸟教程的解释：

> # Python3 assert（断言）
>
> Python assert（断言）用于判断一个表达式，在表达式条件为 false 的时候触发异常。
>
> 断言可以在条件不满足程序运行的情况下直接返回错误，而不必等待程序运行后出现崩溃的情况，例如我们的代码只能在 Linux 系统下运行，可以先判断当前系统是否符合条件。
>
> ![img](https://www.runoob.com/wp-content/uploads/2019/07/assert.png)
>
> 语法格式如下：
>
> ```
> assert expression
> ```
>
> 等价于：
>
> ```
> if not expression:
>     raise AssertionError
> ```
>
> assert 后面也可以紧跟参数:
>
> ```
> assert expression [, arguments]
> ```
>
> 等价于：
>
> ```
> if not expression:
>     raise AssertionError(arguments)
> ```
>
> 以下为 assert 使用实例：
>
> ```bash
> >>> assert True     # 条件为 true 正常执行
> >>> assert False    # 条件为 false 触发异常
> Traceback (most recent call last):
>   File "<stdin>", line 1, in <module>
> AssertionError
> >>> assert 1==1    # 条件为 true 正常执行
> >>> assert 1==2    # 条件为 false 触发异常
> Traceback (most recent call last):
>   File "<stdin>", line 1, in <module>
> AssertionError
>
> >>> assert 1==2, '1 不等于 2'
> Traceback (most recent call last):
>   File "<stdin>", line 1, in <module>
> AssertionError: 1 不等于 2
> >>>
> ```
>
> 以下实例判断当前系统是否为 Linux，如果不满足条件则直接触发异常，不必执行接下来的代码：
>
> > #### 实例
> >
> > ```python
> > import sys
> > assert ('linux' in sys.platform), "该代码只能在 Linux 下执行"
> >
> > # 接下来要执行的代码
> > ```
>
> 来源： https://www.runoob.com/python3/python3-assert.html

更多示例：

```python
# 检查传入的参数是否符合要求
def log(val:'str'):
    assert isinstance(val, str), 'val is not str'
    print(val）
```
