---
title: "Swiperefreshlayout"
date: 2020-02-01T01:45:42+08:00
draft: false
ShowToc: true
categories: [Android]
tags: [android]
---

[GoogleDoc](https://developer.android.google.cn/jetpack/androidx/releases/swiperefreshlayout?hl=zh-cn)

[GoogleGithub](https://github.com/googlearchive/android-SwipeRefreshLayoutBasic#readme)

## 声明依赖项

直接复制官方文档，不多解释了（懒

> 在应用或模块的 `build.gradle` 文件中添加所需工件的依赖项：
>
> ```groovy
>  dependencies {
>      implementation "androidx.swiperefreshlayout:swiperefreshlayout:1.0.0"
>  }
>
> ```
>
> 如需详细了解依赖项，请参阅[添加编译依赖项](https://developer.android.google.cn/studio/build/dependencies.html?hl=zh-cn)。

## 添加布局

在 xml 布局文件中添加 SwipeRefreshLayout，并将 WebView 内嵌在 SwipeRefreshLayout 中。

> 布局这里拷贝了别人的代码，结果软件闪退，搞了半天找不到原因，重开了一个项目，根据代码提示写了一份居然可以运行，分明代码一样的，好迷啊。。。。。

```xml
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout
    xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    xmlns:tools="http://schemas.android.com/tools"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    tools:context=".MainActivity">

    <androidx.swiperefreshlayout.widget.SwipeRefreshLayout
        android:id="@+id/swipe_refresh"
        android:layout_width="match_parent"
        android:layout_height="match_parent">

        <WebView
            android:id="@+id/web_view"
            android:layout_width="match_parent"
            android:layout_height="match_parent" />

    </androidx.swiperefreshlayout.widget.SwipeRefreshLayout>

</LinearLayout>
```

SwipeRefreshLayout 类似 ScrollView，内部只能有一个部件，但是你可以这样玩、（手动滑稽

```xml
<?xml version="1.0" encoding="utf-8"?>
<ScrollView
    xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent">

    <LinearLayout
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        android:orientation="vertical">

        <Button
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:text="test_scroll"
            android:textSize="16sp" />
        <Button
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:text="test_scroll"
            android:textSize="16sp" />
        <Button
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:text="test_scroll"
            android:textSize="16sp" />
        <Button
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:text="test_scroll"
            android:textSize="16sp" />
        <Button
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:text="test_scroll"
            android:textSize="16sp" />
        <Button
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:text="test_scroll"
            android:textSize="16sp" />
        <Button
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:text="test_scroll"
            android:textSize="16sp" />
        <Button
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:text="test_scroll"
            android:textSize="16sp" />
        <Button
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:text="test_scroll"
            android:textSize="16sp" />
        <Button
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:text="test_scroll"
            android:textSize="16sp" />
        <Button
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:text="test_scroll"
            android:textSize="16sp" />
        <Button
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:text="test_scroll"
            android:textSize="16sp" />
        <Button
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:text="test_scroll"
            android:textSize="16sp" />
        <Button
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:text="test_scroll"
            android:textSize="16sp" />
        <Button
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:text="test_scroll"
            android:textSize="16sp" />
        <Button
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:text="test_scroll"
            android:textSize="16sp" />
        <Button
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:text="test_scroll"
            android:textSize="16sp" />
        <Button
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:text="test_scroll"
            android:textSize="16sp" />
        <Button
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:text="test_scroll"
            android:textSize="16sp" />
        <Button
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:text="test_scroll"
            android:textSize="16sp" />
        <Button
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:text="test_scroll"
            android:textSize="16sp" />
        <Button
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:text="test_scroll"
            android:textSize="16sp" />
        <Button
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:text="test_scroll"
            android:textSize="16sp" />
        <Button
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:text="test_scroll"
            android:textSize="16sp" />
        <Button
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:text="test_scroll"
            android:textSize="16sp" />

    </LinearLayout>


</ScrollView>
```

## 编写代码部分

先放一个完整的源码，看不懂直接跳过，下面介绍关于 Swiperefreshlayout 的核心代码

```java
package com.aimerneige.bingsearchlite;

import androidx.appcompat.app.AppCompatActivity;
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout;

import android.annotation.SuppressLint;
import android.os.Bundle;
import android.view.KeyEvent;
import android.webkit.WebView;
import android.webkit.WebViewClient;

public class MainActivity extends AppCompatActivity {

    WebView webView;
    SwipeRefreshLayout swipe_refresh;

    @SuppressLint("SetJavaScriptEnabled")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        webView = findViewById(R.id.web_view);
        webView.getSettings().setJavaScriptEnabled(true); // 启用JavaScript脚本支持
        webView.loadUrl("https://www.bing.com/");
        webView.setWebViewClient(new MyWebViewClient());

        swipe_refresh = findViewById(R.id.swipe_refresh);
        swipe_refresh.setOnRefreshListener(new SwipeRefreshLayout.OnRefreshListener() {
            @Override
            public void onRefresh() {
                webView.reload();
                swipe_refresh.setRefreshing(false);
            }
        });
    }

    // 解决点击返回直接退出的问题
    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        if(keyCode==KeyEvent.KEYCODE_BACK && webView.canGoBack()){
            // 如果点击了返回建且当前网页可以后退时，调用后退
            webView.goBack();
            return true;
        }
        else {
            // 否则调用原有功能
            return super.onKeyDown(keyCode, event);
        }
    }

    public class MyWebViewClient extends WebViewClient {
        @Override
        public void onPageFinished(WebView view, String url) {
            // 插入JavaScript脚本，去除底部烦人的下载手机必应的提示
            String js = "javascript:var m = document.getElementById(\"BottomAppPro\");" +
                    "m.parentNode.removeChild(m);";
            view.loadUrl(js);
        }
    }
}
```

### 定义引用变量

```java
SwipeRefreshLayout swipe_refresh;
```

### 引用对应控件

```java
swipe_refresh = findViewById(R.id.swipe_refresh);
```

### 设置刷新监听器

```java
swipe_refresh.setOnRefreshListener(new SwipeRefreshLayout.OnRefreshListener() {
            @Override
            public void onRefresh() {
                webView.reload();
                swipe_refresh.setRefreshing(false);
            }
        });
```

其中：

`webView.reload();`进行网页的刷新（没有的话是假刷新，只显示刷新动画而不刷新内容）

`swipe_refresh.setRefreshing(false);`关闭刷新动画（没有的话网页会一直刷新）

### 其他部分

注释里有，就不解释了（懒
