---
title: "每天一个 Python 小知识 isinstance"
date: 2020-05-29T09:38:41+08:00
draft: false
ShowToc: true
categories: [Program]
tags: [python]
---

首先来看下 w3schools 的解释：

> ### Example
>
> Check if the number 5 is an integer:
>
> ```python
> x = isinstance(5, int)
> ```
>
> ---
>
> ## Definition and Usage
>
> The `isinstance()` function returns `True` if the specified object is of the specified type, otherwise `False`.
>
> If the type parameter is a tuple, this function will return `True` if the object is _one_ of the types in the tuple.
>
> ---
>
> ## Syntax
>
> isinstance(_object_, _type_)
>
> ## Parameter Values
>
> | Parameter | Description                                           |
> | :-------- | :---------------------------------------------------- |
> | _object_  | Required. An object.                                  |
> | _type_    | A type or a class, or a tuple of types and/or classes |
>
> ---
>
> ## More Examples
>
> ### Example
>
> Check if "Hello" is one of the types described in the type parameter:
>
> ```python
> x = isinstance("Hello", (float, int, str, list, dict, tuple))
> ```
>
> ### Example
>
> Check if y is an instance of myObj:
>
> ```python
> class myObj:
>   name = "John"
>
> y = myObj()
>
> x = isinstance(y, myObj)
> ```
>
> ---
>
> ## Related Pages
>
> The [issubclass()](https://www.w3schools.com/python/ref_func_issubclass.asp) function, to check if an object is a subclass of another object.
>
> 来源： https://www.w3schools.com/python/ref_func_isinstance.asp

帮助那些英语不好的 python 学习者翻译一下：

---

### 示例

检查数字 5 是否是一个整数。

```python
x = isinstance(5, int)
```

## 定义和用法

如果给定的对象是一个已知的对象类型，函数 `isinstance()` 返回 `True` ，否则返回`False` 。

如果参数 `type` 是元组的话，当对象是元组中的一个类型时，这个函数会返回 `True` 。

## 语法

```python
isinstance(object, type)
```

## 参数

| 参数     | 描述                                   |
| :------- | :------------------------------------- |
| _object_ | 必须。 一个示例对象。                  |
| _type_   | 基本类型或者类，或是由他们组成的元组。 |

## 更多示例

### 示例

检查 "Hello" 是否是参数表中描述的类型之一。

```python
x = isinstance("Hello", (float, int, str, list, dict, tuple))
```

### 示例

检查 `y` 是否是 `myObj` 的实例。

```python
class myObj:
name = "John"

y = myObj()

x = isinstance(y, myObj)
```

## 相关内容：

[issubclass()](https://www.w3schools.com/python/ref_func_issubclass.asp) 函数用来检查一个对象是否是另一个对象的子类。

---

接下来看一下菜鸟教程的解释

> # Python isinstance() 函数
>
> ## 描述
>
> isinstance() 函数来判断一个对象是否是一个已知的类型，类似 type()。
>
> > isinstance() 与 type() 区别：
> >
> > - type() 不会认为子类是一种父类类型，不考虑继承关系。
> > - isinstance() 会认为子类是一种父类类型，考虑继承关系。
> >
> > 如果要判断两个类型是否相同推荐使用 isinstance()。
>
> ### 语法
>
> 以下是 isinstance() 方法的语法:
>
> ```
> isinstance(object, classinfo)
> ```
>
> ### 参数
>
> - object -- 实例对象。
> - classinfo -- 可以是直接或间接类名、基本类型或者由它们组成的元组。
>
> ### 返回值
>
> 如果对象的类型与参数二的类型（classinfo）相同则返回 True，否则返回 False。。
>
> ---
>
> ## 实例
>
> 以下展示了使用 isinstance 函数的实例：
>
> ```bash
> >>> a = 2
> >>> isinstance (a,int)
> True
> >>> isinstance (a,str)
> False
> >>> isinstance (a,(str,int,list))    # 是元组中的一个返回 True
> True
> ```
>
> ## type() 与 isinstance()区别：
>
> ```bash
> class A:
>     pass
>
> class B(A):
>     pass
>
> isinstance(A(), A)    # returns True
> type(A()) == A        # returns True
> isinstance(B(), A)    # returns True
> type(B()) == A        # returns False
> ```
>
> 来源： https://aimerneige.com/2020/05/29/Daily-Python-Tips-isinstance/

更多示例：

```
# 检查传入的参数是否符合要求
def log(val:'str'):
    assert isinstance(val, str), 'val is not str'
    print(val）
```
