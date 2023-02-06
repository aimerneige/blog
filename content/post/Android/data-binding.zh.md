---
title: "使用 DataBinding 精简代码"
date: 2020-02-22T00:43:15+08:00
draft: false
ShowToc: true
categories: [Android]
tags: [android]
---

在构建布局的时候，是不是感到要写很多的 `findViewById` 很浪费时间呢？尤其是布局文件变化的时候，也要在 `Activity` 中更改很多内容，极大的降低了开发效率，而谷歌在 JetPack 中提供了一种十分有效的方法来精简代码结构，提升开发效率，那就是 `DataBinding` 下面来介绍 `DataBinding` 的使用

## 用到的依赖

`implementation 'androidx.lifecycle:lifecycle-extensions:2.2.0'`

## 开启 `dataBinding`

在 `app` 的 `build.gradle` 文件中添加以下内容

```gradle
dataBinding {
    enabled true
}
```

位置参考

```gradle
android {
    compileSdkVersion 29
    buildToolsVersion "29.0.3"
    defaultConfig {
        applicationId "com.aimerneige.databindingdemo"
        minSdkVersion 24
        targetSdkVersion 29
        versionCode 1
        versionName "1.0"
        testInstrumentationRunner "androidx.test.runner.AndroidJUnitRunner"
        dataBinding {
            enabled true
        }
    }
    buildTypes {
        release {
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
}
```

## 为布局文件提供 `dataBinding` 支持

在布局文件开头点击黄色灯泡（或按`ALT + Enter`），选择以下操作将布局文件转换为 `data binding layout` ，获取 `data binding` 支持

`convert to data binding layout`

之后你的布局将会变成这样

```xml
<?xml version="1.0" encoding="utf-8"?>
<layout xmlns:android="http://schemas.android.com/apk/res/android">

    <data>

    </data>

    <!--这里是你之前的布局-->

</layout>
```

你就可以在 `<data>` 标签内填写代码了。

## 在 `MainActivity` 绑定布局

添加 `DataBinding` 之后， `setContentView` 就不能继续使用了，这里需要用到新的方法绑定布局

### 删除旧布局

删除 `onCreate` 方法中的 `setContentView` 那一行的代码

### 构建 `DataBinding` 的引用

使用 `DataBinding` 之后，系统会自动生成一个类，类名取决于你的布局名称。

比如：

- `activity_main.xml` --> `ActivityMainBinding`
- `activity_test` --> `ActivityTestBinding`
- `my_own_layout_for_test.xml` --> `MyOwnLayoutForTestBinding`

知道类名之后在添加如下字段：

```java
ActivityMainBinding activityMainBinding;
```

### 绑定布局

在 `onCreate` 方法中添加如下内容

```java
activityMainBinding = DataBindingUtil.setContentView(this, R.layout.activity_main);
```

## 搭建布局

通常情况下，一般会搭配 `ViewModel` 和 `LiveData` 使用，这里不多介绍这俩种技术（之前的文章有专门的介绍）。

这里搭建了一个很简单的布局，代码是完整的，之后解释。

`activity_main.xml`

```xml
<?xml version="1.0" encoding="utf-8"?>
<layout xmlns:android="http://schemas.android.com/apk/res/android">

    <data>
        <variable
            name="data"
            type="com.aimerneige.databindingdemo.MyViewModel" />
    </data>

    <LinearLayout
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        android:orientation="vertical">

        <TextView
            android:id="@+id/textView"
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:text="@{String.valueOf(data.number)}" />

        <Button
            android:id="@+id/add"
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:onClick="@{()->data.addValue(1)}"
            android:text="+1" />

        <Button
            android:id="@+id/minus"
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:onClick="@{()->data.addValue(-1)}"
            android:text="-1" />

    </LinearLayout>
</layout>
```

`MyViewModel.java`

```java
package com.aimerneige.databindingdemo;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;
import androidx.lifecycle.ViewModel;

public class MyViewModel extends ViewModel {
    private MutableLiveData<Integer> number;

    public MutableLiveData<Integer> getNumber() {
        if (number == null) {
            number = new MutableLiveData<>();
            number.setValue(0);
        }
        return number;
    }

    public void addValue(int n) {
        number.setValue(number.getValue() + n);
    }
}
```

`MainActivity.java`

```java
package com.aimerneige.databindingdemo;

import androidx.appcompat.app.AppCompatActivity;
import androidx.databinding.DataBindingUtil;
import androidx.lifecycle.ViewModelProvider;

import android.os.Bundle;

import com.aimerneige.databindingdemo.databinding.ActivityMainBinding;

public class MainActivity extends AppCompatActivity {

    MyViewModel myViewModel;
    ActivityMainBinding activityMainBinding;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        activityMainBinding = DataBindingUtil.setContentView(this, R.layout.activity_main);
        myViewModel = new ViewModelProvider(this).get(MyViewModel.class);
        activityMainBinding.setData(myViewModel);
        activityMainBinding.setLifecycleOwner(this);
    }
}
```

创建好 `MyViewModel` 后，需要在 `MainActivity` 和 `<data>` 标签内引用

如何在 `MainActivity` 使用就不解释了，之前的文章有说明，这里只解释如何在布局文件内使用。

找到之前生成的 `<data>` 标签，在其内部填写 `<variable />` 标签，填好之后会有自动补全，在 `name` 内填一个自定义的名称，这里使用 `data` ，然后在 `type` 内填写创建的 `ViewModel` 类。

示例如下：

```xml
    <data>
        <variable
            name="data"
            type="com.aimerneige.databindingdemo.MyViewModel" />
    </data>
```

然后就可以在布局内写一些类似 java 代码的东西

可以通过如下方法访问 `ViewModel` 中的变量或者方法

访问变量：

`@{String.valueOf(data.number)}`

访问方法：

`@{()->data.addValue(1)}`

最后在 `MainActivity` 内添加如下代码即可

```java
    activityMainBinding.setData(myViewModel);
    activityMainBinding.setLifecycleOwner(this);
```
