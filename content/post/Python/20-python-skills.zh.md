---
title: "20 个 Python 进阶技巧"
date: 2020-04-13T20:27:22+08:00
draft: false
ShowToc: true
categories: [Python]
tags: [python]
---

> 本来是在查资料，无意间看到了这个[知乎文章](https://zhuanlan.zhihu.com/p/89998429)，感觉内容值得学习，但是排版实在难受，代码和注释混在一起，没有换行，同时解释也很奇怪（感觉是机翻的），当我无法忍受想关闭网页的时候，发现这篇文章是翻译自[Medium](https://medium.com/better-programming/20-python-snippets-you-should-learn-today-8328e26ff124)的文章，但是原文章是英语写的，为了帮到那些英语不太好的 Python 学习者，同时方便自己之后看，于是写了这篇博文（算是笔记吧）

> 基于 Medium 的文章 [《20 Python Snippets You Should Learn Today》](https://medium.com/better-programming/20-python-snippets-you-should-learn-today-8328e26ff124) ，除了翻译外添加了自己的解释。水平有限，如果有错误欢迎读者指正。
>
> 大部分示例代码均引用自 **Medium** [《20 Python Snippets You Should Learn Today》](https://medium.com/better-programming/20-python-snippets-you-should-learn-today-8328e26ff124)

## 1 反转字符串

下面的代码使用 Python 切片操作来反转字符串。

```python
# Reversing a string using slicing

my_string = "ABCDE"
reversed_string = my_string[::-1]

print(reversed_string)

# Output
# EDCBA
```

这里用到的是 Python[切片](https://www.liaoxuefeng.com/wiki/1016959663602400/1017269965565856)

切片某种意义上就是对如下代码的书写进行了简化（不考虑 Python 中-1 的情况）

```c
// [a:b:c]
for (int i = a, i < b; i = i + c) {
    // do something
}
```

推荐阅读： [《How to reverse a string in Python?》](https://medium.com/swlh/how-to-reverse-a-string-in-python-66fc4bbc7379)

## 2 转化为标题（首字母大写）

下面的代码把字符串转化为标题格式。这里用了字符串类的 title()方法来实现。

```python
my_string = "my name is chaitanya baweja"

# using the title() function of string class
new_string = my_string.title()

print(new_string)

# Output
# My Name Is Chaitanya Baweja
```

把字符串中单词的首字母都大写，转变为标题格式，就是调用了字符串类的 title()方法，很简单，不需要解释。

值得一提的是，虽然叫 `title`， 但是它是完全不加判断地把所有单词的首字母大写，并没有遵循英语的语法规则。

> ### 英文标题首字母大写规则
>
> 按照规则的优先级从高到底应该是：
>
> 1. 标题的第一个单词的首字母要大写；
> 2. 冠词都不需要大写；
> 3. 字母个数多于 3 个（不含 3 个）的介词、连词的首字母要大写；
> 4. 名词、动词、形容词、副词、代词、感叹词首字母应大写；
> 5. 大写所有英语中要求大写的单词。如月份、人名、地名等等。
>
> 根据优先级递减的规则，如果后面的规则与前面的规则冲突，则优先执行前面的规则。
>
> 来源： https://www.cnblogs.com/crackpotisback/p/5547249.html

```python
test_str = "the story of an magical apple and me"
title_str = test_str.title()
print(title_str)

# Output
# The Story Of An Magical Apple And Me
```

另外，函数只识别空格分割的单词

```python
my_string = "helloworld"
new_string = my_string.title()
print(new_string)

# Output
# Helloworld
```

## 3 查找字符串的唯一元素

下面的代码可以用于查找字符串中所有的唯一元素，我们利用了[集合内元素的唯一性](https://medium.com/python-pandemonium/https-medium-com-python-pandemonium-an-introduction-to-python-sets-part-i-120974a713be)。

```python
my_string = "aavvccccddddeee"

# converting the string to a set
temp_set = set(my_string)

# stitching set into a string using join
new_string = ''.join(temp_set)

print(new_string)

# Output
# ecdva
```

效果是把字符串中用到的字符都提取出来，构成一个新的字符串。

比如对 `hello` ，它内部包含 `h, e, l, o` 这几四字符，于是我们就会得到一个由这四个字符构成的新字符串，顺序通常是乱的，比如 `oelh` 就是一种可能的结果。

输出结果并没有排序，是随机的，比如你期望如下代码返回`abcdefghijklmnopqrstuvwxyz .`，但是结果却是杂乱的。

```python
my_string = "the quick brown fox jumps over the lazy dog."
temp_set = set(my_string)
new_string = ''.join(temp_set)
print(new_string)

# Output
# trzixup.efbajovcdnslywhg qmk
```

这里用到了 python 中的 [集合](https://www.runoob.com/python3/python3-set.html) 和 [join()方法](https://www.runoob.com/python/att-string-join.html)

首先利用集合的唯一性，用原始字符串构造一个集合，然后利用 join()方法把集合内的元素用空字符串进行连接，相当于将集合内的元素连接成字符串。

推荐阅读： [《An Introduction to Python Sets - Part I》](https://medium.com/python-pandemonium/https-medium-com-python-pandemonium-an-introduction-to-python-sets-part-i-120974a713be)

## 4 输出 n 次字符串或列表

你可以对字符串或列表使用乘法(\*)。这让我们可以按照我们的需求输出多次。

```python
n = 3 # number of repetitions

my_string = "abcd"
my_list = [1,2,3]

print(my_string*n)
# abcdabcdabcd

print(my_list*n)
# [1,2,3,1,2,3,1,2,3]
```

关于这个内容的一个有趣的用例是定义一个具有恒定值的列表——假设为零。

```python
n = 4
my_list = [0]*n # n denotes the length of the required list
# [0, 0, 0, 0]
```

乘法的特殊用法，没什么需要解释的。

## 5 列表解析

列表解析为创建列表提供了一种可以以其他列表为基础来创建新的列表的优雅方式。

下面的代码通过把旧列表中的每个元素都乘以 2 来创建新列表。

```python
# Multiplying each element in a list by 2

original_list = [1,2,3,4]

new_list = [2*x for x in original_list]

print(new_list)
# [2,4,6,8]
```

推荐阅读： [《List Comprehensions in Python》](https://medium.com/swlh/list-comprehensions-in-python-e8d409bb216e)

## 6 交换俩个变量的值

Python 使得交换俩个变量的值变得十分简单，并不需要使用另一个变量。

```python
a = 1
b = 2

a, b = b, a

print(a) # 2
print(b) # 1
```

很简单，不需要解释。

## 7 把字符串分解为子字符串列表

我们可以通过字符串类的 `split()` 方法来把字符串分解成子字符串列表。你同样可以传递一个参数来决定用什么字符进行分割。

```python
string_1 = "My name is Chaitanya Baweja"
string_2 = "sample/ string 2"

# default separator ' '
print(string_1.split())
# ['My', 'name', 'is', 'Chaitanya', 'Baweja']

# defining separator as '/'
print(string_2.split('/'))
# ['sample', ' string 2']
```

这里使用了 [split()方法](https://www.runoob.com/python/att-string-split.html) 不多解释了。

## 8 将字符串列表组合成单字符串

`join()`方法可以通过传入的参数作为间隔把字符串数组组合成单字符串。

在本例中。我们使用逗号作为分割符。

```python
list_of_strings = ['My', 'name', 'is', 'Chaitanya', 'Baweja']

# Using join with the comma separator
print(','.join(list_of_strings))

# Output
# My,name,is,Chaitanya,Baweja
```

使用了 [join()方法](https://www.runoob.com/python/att-string-join.html) ，不多解释了。

## 9 检查给定字符串是否为回文（Palindrome）

我们已经讨论了如何反转字符串，因此，在 Python 中，回文检查变得很简单。

```python
my_string = "abcba"

if my_string == my_string[::-1]:
    print("palindrome")
else:
    print("not palindrome")

# Output
# palindrome
```

## 10 列表中元素出现的次数

有很多的方法来做这件事，但是我最喜欢的方法是使用 Python 中的 `Counter` 类。

Python 的 [Counter](https://docs.python.org/zh-cn/3/library/collections.html#collections.Counter) 会记录容器内每个元素的出现次数。`Counter()` 返回一个字典，字典内以元素为键，出现次数为值。

同样的，我们可以使用函数 `most_common()` 来获得列表中出现次数最多的元素。

```python
# finding frequency of each element in a list
from collections import Counter

my_list = ['a','a','b','b','b','c','d','d','d','d','d']
count = Counter(my_list) # defining a counter object

print(count) # Of all elements
# Counter({'d': 5, 'b': 3, 'a': 2, 'c': 1})

print(count['b']) # of individual element
# 3

print(count.most_common(1)) # most frequent element
# [('d', 5)]
```

使用列表作为参数构建 Counter 类，返回值即为所需内容。

推荐阅读：[《An Introduction to Python Counter》](https://medium.com/datadriveninvestor/an-introduction-to-python-counter-47948fdd9c1a)

## 11 判断俩个字符串是否为易位词

Counter 的一个有趣的应用是判断易位词。

如果一个单词或者短语是由另一个单词或短语重新排序构成的，那么这个俩单词或者短语就被称为易位词。（百科词条可能会帮到你）

> **易位构词游戏**的英文词汇是 _anagram_，这个词来源于有“反向”或“再次”的含义的[希腊语](https://zh.wikipedia.org/wiki/希腊语)字根*ana-*和有“书写”、“写下”的意思的词根*gramma*。易位构词是一类[文字游戏](https://zh.wikipedia.org/wiki/文字游戏)（更准确地说是一类“词语游戏”），是将组成一个词或短句的字母重新排列顺序，原文中所有字母的每次出现都被使用一次，这样构造出另外一些新的词或短句。
>
> 来源: [中文维基 易位构词游戏](https://zh.wikipedia.org/wiki/%E6%98%93%E4%BD%8D%E6%9E%84%E8%AF%8D%E6%B8%B8%E6%88%8F)
>
> 推荐阅读：[百度百科 易位词](<[https://baike.baidu.com/item/%E5%8F%98%E4%BD%8D%E8%AF%8D/3844597](https://baike.baidu.com/item/变位词/3844597)>) [English wiki Anagram](https://en.wikipedia.org/wiki/Anagram)

如果俩个字符串的 Counter 对象是相同的，那么他们是易位词。

```python
from collections import Counter

str_1, str_2, str_3 = "acbde", "abced", "abcda"
cnt_1, cnt_2, cnt_3  = Counter(str_1), Counter(str_2), Counter(str_3)

if cnt_1 == cnt_2:
    print('1 and 2 anagram')
if cnt_1 == cnt_3:
    print('1 and 3 anagram')

# Output
# 1 and 2 anagram
```

## 12 使用 try-except-else

在 python 中，通过使用 try/except 代码块可以简单地处理错误。在这个代码块中添加 else 可能是有用的。

如果没有错误发生的话，else 后的代码就会被执行。

如果你有一些不管错误是否发生都需要执行的代码，使用 finally。

```python
a, b = 1,0

try:
    print(a/b)
    # exception raised when b is 0
except ZeroDivisionError:
    print("division by zero")
else:
    print("no exceptions raised")
finally:
    print("Run this always")

# Output
# division by zero
# Run this always
```

```python
try:
   some_dangerous_operation()
   # something may cause exception
except:
   exception_handle()
   # something run when the exception happens
else:
   no_exception()
   # something run when no exception happens
finally:
   something_must_to_been_done()
   # something run weather the exception happens or not
```

## 13 使用 Enumerate 来取得 索引-值 对

下面的脚本使用了 Enumerate 来迭代列表中的值及其索引。

```python
my_list = ['a', 'b', 'c', 'd', 'e']

for index, value in enumerate(my_list):
    print('{0}: {1}'.format(index, value))

# 0: a
# 1: b
# 2: c
# 3: d
# 4: e
```

推荐阅读： [菜鸟教程 enumerate() 函数](https://www.runoob.com/python/python-func-enumerate.html)

## 14 检查对象的内存使用

下面的脚本可以用于检查对象的内存使用。

在这里阅读更多： [这里](https://code.tutsplus.com/tutorials/understand-how-much-memory-your-python-objects-use--cms-25609)

```python
import sys

num = 21

print(sys.getsizeof(num))

# In Python 2, 24
# In Python 3, 28
```

## 15 合并俩个字典

在 Python 2，我们使用 `update()` 方法来合并俩个字典。

Python 3.5 简化了这个过程。

在下面的脚本中，俩个字典被合并。为了防止交叉的情况，使用第二个字典的值。

```python
dict_1 = {'apple': 9, 'banana': 6}
dict_2 = {'banana': 4, 'orange': 8}

combined_dict = {**dict_1, **dict_2}

print(combined_dict)
# Output
# {'apple': 9, 'banana': 4, 'orange': 8}
```

## 16 执行一段代码所需时间

下面的代码使用 time 库计算运行一段代码所需要的时间。

```python
import time

start_time = time.time()
# Code to check follows
a, b = 1,2
c = a+ b
# Code to check ends
end_time = time.time()
time_taken_in_micro = (end_time- start_time)*(10**6)

print(" Time taken in micro_seconds: {0} ms").format(time_taken_in_micro)
```

## 17 嵌套列表扁平化

有时，你并不清楚你的列表的嵌套深度，并且你仅仅只是想要让所有元素变成一个扁平的列表。

这个代码告诉你如何实现！

```python
from iteration_utilities import deepflatten

# if you only have one depth nested_list, use this
def flatten(l):
  return [item for sublist in l for item in sublist]

l = [[1,2,3],[3]]
print(flatten(l))
# [1, 2, 3, 3]

# if you don't know how deep the list is nested
l = [[1,2,3],[4,[5],[6,7]],[8,[9,[10]]]]

print(list(deepflatten(l, depth=3)))
# [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
```

如果你有一个正确格式化的数组， [Numpy flatten](https://docs.scipy.org/doc/numpy/reference/generated/numpy.ndarray.flatten.html) 可能是一个更好的选择。

## 18 列表取样

下面的代码生使用 `random` 库从给定的列表中生成了 n 个随机的样本。

```python
import random

my_list = ['a', 'b', 'c', 'd', 'e']
num_samples = 2

samples = random.sample(my_list,num_samples)
print(samples)
# [ 'a', 'e'] this will have any 2 random values
```

我十分推荐使用 [secrets](https://docs.python.org/3/library/secrets.html) 库来生成用于加密的随机样本。

下面的代码只能在 python 3 运行。

```python
import secrets                              # imports secure module.
secure_random = secrets.SystemRandom()      # creates a secure random object.

my_list = ['a','b','c','d','e']
num_samples = 2

samples = secure_random.sample(my_list, num_samples)

print(samples)
# [ 'e', 'd'] this will have any 2 random values
```

## 19 数字化

下面的代码将会把一个整数转化成数字的列表。

```python
num = 123456

# using map
list_of_digits = list(map(int, str(num)))

print(list_of_digits)
# [1, 2, 3, 4, 5, 6]

# using list comprehension
list_of_digits = [int(x) for x in str(num)]

print(list_of_digits)
# [1, 2, 3, 4, 5, 6]
```

## 20 检查唯一性

下面的函数会检查一个列表内的所有元素是否是唯一的。

```python
def unique(l):
    if len(l)==len(set(l)):
        print("All elements are unique")
    else:
        print("List has duplicates")

unique([1,2,3,4])
# All elements are unique

unique([1,1,2,3])
# List has duplicates
```

这里利用了集合的唯一性。

## 总结

不得不说对于计算机学习来说，英语还是很重要的，很多资料都是英语的。

推荐阅读： https://www.30secondsofcode.org/python/p/1
