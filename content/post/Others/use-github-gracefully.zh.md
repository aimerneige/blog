---
title: "优雅地使用 GitHub"
date: 2020-08-01T07:15:56+08:00
draft: false
ShowToc: false
categories: [Others]
tags: [github]
---

[官方文档](https://docs.github.com/cn/github/searching-for-information-on-github/understanding-the-search-syntax)

## 较常用的检索限制

项目名称

```
in:name <keyword>
```

项目 README

```
in:readme <keyword>
```

项目描述

```
in:description <keyword>
```

语言

```
language: java
```

star 数

```
stars:>1000
```

fork 数

```
forks:>500
```

更新时间

```
pushed:>2020-08-01
```

使用示例

```
in:name marp in:description theme stars:>5 pushed:>2020-01-01
```

> 参考链接:\
> https://www.youtube.com/watch?v=Uj6WWAqg0NY
