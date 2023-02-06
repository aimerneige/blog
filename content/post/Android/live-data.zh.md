---
title: "使用 LiveData 优雅地管理布局显示的数据"
date: 2020-02-20T22:22:21+08:00
draft: false
ShowToc: true
categories: [Android]
tags: [android]
---

`ViewModel` 提供了一个可以管理数据的优雅的容器，但是它也只是存储数据而已，并不能对数据进行处理，只是存储数据而已，但是如果使用 `LiveData` 来辅助， `ViewModel` 不再只是存储数据，它本身也能处理界面内容，就像它的名字一样，能让数据活起来。

## 在 `ViewModel` 中构建 `LiveData` 对象

与 `ViewModel` 不同， `LiveData` 不需要构建类，直接在 `ViewModel` 中创建对象即可。

首先创建 `ViewModel` 对象，然后在 ViewModel 对象中创建 `LiveData` 字段

```java
package com.aimerneige.livedatatest;

import androidx.lifecycle.MutableLiveData;
import androidx.lifecycle.ViewModel;

public class ViewModelWithLiveData extends ViewModel {
    private MutableLiveData<Integer> LikedNumber;
}
```

然后为 `LiveData` 对象构建 get 方法

```java
    // May Cause Error
    public MutableLiveData<Integer> getLikedNumber() {
        return LikedNumber;
    }
```

要注意的是构建的对象如果没有构建的话是为空的，直接返回会有空指针错误，所以要对空指针进行处理。

1. 在构造方法中解决

```java
    // One possible wey to make the LikedNumber not null
   ViewModelWithLiveData () {
       LikedNumber = new MutableLiveData<>();
       LikedNumber.setValue(0);
   }
```

2. 在 get 方法中解决(推荐)

```java
    public MutableLiveData<Integer> getLikedNumber() {
        if (LikedNumber == null) {
            LikedNumber = new MutableLiveData<>();
            LikedNumber.setValue(0);
        }
        return LikedNumber;
    }
```

接下来为数据提供操作方法，要注意的是这里非常不建议直接提供 set 方法对数据进行修改。这里以增加（减少）数据大小为例：

```java
    public void addLikedNumber(int n) {
        LikedNumber.setValue(LikedNumber.getValue() + n);
    }
```

需要增加（减少）数据大小的时候通过这个方法传入正数（负数）即可。

要注意的是经过 `LiveData` 包装后 int 数据不能进行直接的加减操作，只能通过 `setValue` 、 `getValue` 等对数据进行处理（当然这并不是难事）

## 在 Activity 中使用 LiveData

首先在 `Activity` 中构建 `ViewModel` 的引用

````java
    ViewModelWithLiveData viewModelWithLiveData;
```

在 `onCreate` 方法内获得 `ViewModel` 的实体

```java
    viewModelWithLiveData = ViewModelProviders.of(this).get(ViewModelWithLiveData.class);
```

对 `LiveData` 数据创建观察者

```java
    viewModelWithLiveData.getLikedNumber().observe(this, new Observer<Integer>() {
        @Override
        public void onChanged(Integer integer) {
            textView.setText(String.valueOf(integer));
        }
    });
```

添加观察后，当数据发生变化后，会自动更改组件上的内容，当然这个行为完全可以自己改。

别忘了使用数据操作方法

```java
    liked.setOnClickListener(new View.OnClickListener() {
        @Override
        public void onClick(View v) {
            viewModelWithLiveData.addLikedNumber(1);
        }
    });

    disliked.setOnClickListener(new View.OnClickListener() {
        @Override
        public void onClick(View v) {
            viewModelWithLiveData.addLikedNumber(-1);
        }
    });
```
````
