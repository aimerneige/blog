---
title: "使用 ViewModel 管理布局上的数据"
date: 2020-02-20T22:21:25+08:00
draft: false
ShowToc: true
categories: [Android]
tags: [android]
---

如果不进行处理的话，布局上的临时数据可能会因为屏幕反转，切换系统语言等而消失，但是处理过程略微繁琐，较为麻烦，但是谷歌为我们提供了一种更加简洁的方式来管理界面数据，那就是 ViewModel。

## 构建自己的 `ViewModel` 类

新建 Java 类，继承至`ViewModel`，名字自定义，这里以`MyViewModel`为例。

```java
package com.aimerneige.viewmoudeltest;

import androidx.lifecycle.ViewModel;

public class MyViewMoude extends ViewModel {
}
```

新建好类之后，直接将需要用到的数据填写在内部，可以直接使用 public 的数据类型（不推荐），或者使用 private 数据加 get 方法。

```java
package com.aimerneige.viewmoudletest;

import androidx.lifecycle.ViewModel;

public class MyViewMoude extends ViewModel {
    public int number = 0;
    public String test = "Test for 100";

    private int age = 0;

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }
}
```

然后把`ViewModel`当成一个智能地存储数据的结构体使用即可。

## 在 Activity 中使用 ViewModel

在`MainActivity`内构建`MyViewMoude`的引用

```java
    MyViewMoude myViewMoude;
```

在 onCreate 方法内获得 MyViewMoude 的实体

```java
    myViewMoude = ViewModelProviders.of(this).get(MyViewMoude.class);
```

直接使用即可，操作类似结构体

```java
    textView.setText(String.valueOf(myViewMoude.number));

    textView.setText(myViewMoude.test);

    textView.setText(String.valueOf(myViewMoude.getAge()));
```

## 额外的说明

ViewModelProviders.of()目前已被官方弃用[官方文档](https://developer.android.com/jetpack/androidx/releases/lifecycle#2.2.0-alpha03)

以下是解决方案， [参考资料](https://stackoverflow.com/questions/57534730/as-viewmodelproviders-of-is-deprecated-how-should-i-create-object-of-viewmode)

> 将
>
> ```java
>     boardViewModel = ViewModelProviders.of(this).get(BoardViewModel::class.java)
> ```
>
> 替换为：
>
> ```java
>     boardViewModel = ViewModelProvider(this).get(BoardViewModel::class.java)
> ```

本例中，使用如下代码：

```java
    myViewMoude = new ViewModelProvider(this).get(MyViewMoude.class);
```
