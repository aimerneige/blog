---
title: "ToolBar"
date: 2020-02-18T00:05:23+08:00
draft: false
ShowToc: true
categories: [Android]
tags: [android]
---

## MaterialDesign 依赖库

```xml
    implementation 'com.google.android.material:material:1.1.0'
```

## 在布局文件中加入 TooBar

```xml
<androidx.appcompat.widget.Toolbar
    android:id="@+id/toolBar"
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    <!--其他属性设置-->
    />
```

> 关于旧版的说明
>
> 旧版需要使用兼容包
>
> `compile 'com.android.support:appcompat-v7:23.1.1'`
>
> 使用以下布局方法
>
> ```xml
> <android.support.v7.widget.Toolbar
>         android:id="@+id/toolbar"
>         android:layout_width="wrap_content"
>         android:layout_height="wrap_content">
>         <TextView
>             android:layout_width="match_parent"
>             android:layout_height="wrap_content"
>             android:text="标题"
>             android:textSize="20sp"/>
>     </android.support.v7.widget.Toolbar>
> ```
>
> 很多文章都是这么写的，此处代码也是拷贝的，但是在开发中出了一些问题，博主是没有成功运行，仅供参考，挂了请自行查阅资料，不做解释。这里主要介绍新版 ToolBar 的使用

## 在 MainActivity 中引用 Toolbar

```java
    Toolbar toolbar = findViewById(R.id.toolBar);
```

## 使用 ToolBar 作为界面布局

```java
    toolbar.setTitle("AppBarLayoutTest");
    setSupportActionBar(toolbar);
```

> 导包的时候导这个，不要导错了，否则会报错
>
> `import androidx.appcompat.widget.Toolbar;`

## 添加自定义属性

按需添加自定义属性，可以修改的内容包括标题的文字、图标、颜色等。不详细介绍，官方文档里很详细。

> 官方文档：https://developer.android.com/reference/android/widget/Toolbar

## 添加菜单

### 构建菜单的布局文件

这里添加的 item 会按顺序显示在 ToolBar 上面。

showAsAction 属性：

- always:总是显示
- ifRoom:空间足够时显示
- never:永不显示（收纳在右侧的三条横线那个更多按钮里）

```xml
<?xml version="1.0" encoding="utf-8"?>
<menu xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto">

    <item
        android:id="@+id/toolbar_setting"
        android:icon="@drawable/ic_setting"
        android:title="@string/toolbar_setting"
        app:showAsAction="always" />

    <item
        android:id="@+id/toolbar_about"
        android:title="@string/toolbar_about"
        app:showAsAction="never" />

    <item
        android:id="@+id/toolbar_exit"
        android:title="@string/toolbar_exit"
        app:showAsAction="never" />

</menu>
```

### 在主菜单中引用菜单的布局文件

```java
    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.toolbar, menu);
        return true;
    }
```

### 设置菜单点击事件

```java
    @Override
    public boolean onOptionsItemSelected(@NonNull MenuItem item) {
        switch (item.getItemId()) {
            case android.R.id.home:
                drawerLayout.openDrawer(GravityCompat.START);
                break;
            case R.id.toolbar_setting:
                Toast.makeText(MainActivity.this, "Waiting for coding for setting", Toast.LENGTH_SHORT).show();
                break;
            case R.id.toolbar_about:
                Toast.makeText(MainActivity.this, "Waiting for coding for about", Toast.LENGTH_SHORT).show();
                break;
            case R.id.toolbar_exit:
                Toast.makeText(MainActivity.this, "Waiting for coding for exit", Toast.LENGTH_SHORT).show();
                break;
            default:
                break;
        }
        return true;
    }
```

## AppBarLayout

使用 AppBarLayout 可以给 ToolBar 定义更多的内容，并且 TabLayout 一般也是嵌套在其内部。

这里省略了属性，主要关注布局层次即可。

```xml
<com.google.android.material.appbar.AppBarLayout
    android:layout_width="match_parent"
    android:layout_height="wrap_content">

    <androidx.appcompat.widget.Toolbar
        android:layout_width="match_parent"
        android:layout_height="wrap_content"/>

    <com.google.android.material.tabs.TabLayout
        android:layout_width="match_parent"
        android:layout_height="46dp">

    </com.google.android.material.tabs.TabLayout>

</com.google.android.material.appbar.AppBarLayout>
```

用 AppBarLayout 套住 ToolBar 即可，内部还可以嵌套一个 TabLayout。

你也可以将整个布局放置在 CoordinatorLayout 中实现更好的效果。

## 完整代码

代码很垃圾，只是一个壳子，凑合看

```xml
<?xml version="1.0" encoding="utf-8"?>
<androidx.drawerlayout.widget.DrawerLayout
    android:id="@+id/draw_layout"
    xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    xmlns:tools="http://schemas.android.com/tools"
    android:layout_width="match_parent"
    android:layout_height="match_parent">

    <androidx.coordinatorlayout.widget.CoordinatorLayout
        android:layout_width="match_parent"
        android:layout_height="match_parent">

        <com.google.android.material.appbar.AppBarLayout
            android:id="@+id/app_bar"
            android:layout_width="match_parent"
            android:layout_height="wrap_content">

            <androidx.appcompat.widget.Toolbar
                android:id="@+id/toolBar"
                android:layout_width="match_parent"
                android:layout_height="wrap_content"
                app:titleTextColor="@color/write"
                app:layout_scrollFlags="scroll|enterAlwaysCollapsed"/>

            <com.google.android.material.tabs.TabLayout
                android:id="@+id/tabLayout"
                android:layout_width="match_parent"
                android:layout_height="46dp"
                android:minHeight="46dp"
                app:tabMode="fixed"
                app:layout_scrollFlags="scroll|exitUntilCollapsed|enterAlways">

                <com.google.android.material.tabs.TabItem
                    android:layout_width="wrap_content"
                    android:layout_height="wrap_content"
                    android:text="Test1" />

                <com.google.android.material.tabs.TabItem
                    android:layout_width="wrap_content"
                    android:layout_height="wrap_content"
                    android:text="Test2" />

                <com.google.android.material.tabs.TabItem
                    android:layout_width="wrap_content"
                    android:layout_height="wrap_content"
                    android:text="Test3" />

            </com.google.android.material.tabs.TabLayout>

        </com.google.android.material.appbar.AppBarLayout>

        <androidx.viewpager.widget.ViewPager
            android:id="@+id/view_pager"
            android:layout_width="match_parent"
            android:layout_height="match_parent"
            app:layout_behavior="@string/appbar_scrolling_view_behavior" />

        <com.google.android.material.floatingactionbutton.FloatingActionButton
            android:id="@+id/fab"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:layout_gravity="bottom|end"
            android:layout_margin="16dp"
            android:src="@drawable/ic_add"
            android:elevation="8dp" />

    </androidx.coordinatorlayout.widget.CoordinatorLayout>

    <com.google.android.material.navigation.NavigationView
        android:id="@+id/nav_view"
        android:layout_width="300dp"
        android:layout_height="match_parent"
        android:layout_gravity="start"
        app:headerLayout="@layout/nav_header"
        app:menu="@menu/nav_menu" />

</androidx.drawerlayout.widget.DrawerLayout>
```

```java
package com.aimerneige.appbarlayoutyesy;

import androidx.annotation.NonNull;
import androidx.appcompat.app.ActionBar;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;
import androidx.core.view.GravityCompat;
import androidx.drawerlayout.widget.DrawerLayout;
import androidx.viewpager.widget.ViewPager;

import android.annotation.SuppressLint;
import android.os.Bundle;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.Toast;

import com.google.android.material.appbar.AppBarLayout;
import com.google.android.material.floatingactionbutton.FloatingActionButton;
import com.google.android.material.navigation.NavigationView;
import com.google.android.material.snackbar.Snackbar;
import com.google.android.material.tabs.TabLayout;

public class MainActivity extends AppCompatActivity {

    private DrawerLayout drawerLayout;

    @SuppressLint("ResourceAsColor")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        AppBarLayout appBarLayout = findViewById(R.id.app_bar);
        Toolbar toolbar = findViewById(R.id.toolBar);
        TabLayout tabLayout = findViewById(R.id.tabLayout);
        ViewPager viewPager = findViewById(R.id.view_pager);
        NavigationView navigationView = findViewById(R.id.nav_view);
        FloatingActionButton fab = findViewById(R.id.fab);

        drawerLayout = findViewById(R.id.draw_layout);

        // Set toolbar as ActionBar
        toolbar.setTitle("AppBarLayoutTest");
        setSupportActionBar(toolbar);

        // Set menu icon
        ActionBar actionBar = getSupportActionBar();
        if (actionBar != null) {
            actionBar.setDisplayHomeAsUpEnabled(true);
            actionBar.setHomeAsUpIndicator(R.drawable.ic_menu);
        }

        // Set TabLayout selected
        tabLayout.addOnTabSelectedListener(new TabLayout.OnTabSelectedListener() {
            @Override
            public void onTabSelected(TabLayout.Tab tab) {

            }

            @Override
            public void onTabUnselected(TabLayout.Tab tab) {

            }

            @Override
            public void onTabReselected(TabLayout.Tab tab) {

            }
        });

        // Navigation selected
        navigationView.setCheckedItem(R.id.nav_alien);
        navigationView.setNavigationItemSelectedListener(new NavigationView.OnNavigationItemSelectedListener() {
            @Override
            public boolean onNavigationItemSelected(@NonNull MenuItem item) {
                switch (item.getItemId()) {
                    case R.id.nav_alien:
                        Toast.makeText(MainActivity.this, "alien", Toast.LENGTH_SHORT).show();
                        break;
                    case R.id.nav_games:
                        Toast.makeText(MainActivity.this, "Games", Toast.LENGTH_SHORT).show();
                        break;
                    case R.id.nav_icecream:
                        Toast.makeText(MainActivity.this, "IceCream", Toast.LENGTH_SHORT).show();
                        break;
                    case R.id.nav_camping:
                        Toast.makeText(MainActivity.this, "Camping", Toast.LENGTH_SHORT).show();
                        break;
                    case R.id.nav_basketball:
                        Toast.makeText(MainActivity.this, "Basketball", Toast.LENGTH_SHORT).show();
                        break;
                    case R.id.nav_cloud:
                        Toast.makeText(MainActivity.this, "Cloud", Toast.LENGTH_SHORT).show();
                        break;
                    default:
                        break;
                }
                return true;
            }
        });

        fab.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Snackbar.make(v, "Waiting for coding", Snackbar.LENGTH_LONG)
                        .setAction("Undo", new View.OnClickListener() {
                            @Override
                            public void onClick(View v) {
                                Toast.makeText(MainActivity.this, "Undo success",
                                        Toast.LENGTH_SHORT).show();
                            }
                        }).show();
            }
        });
    }

    // Set menu for toolbar
    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.toolbar, menu);
        return true;
    }

    // ToolBar MenuOption
    @Override
    public boolean onOptionsItemSelected(@NonNull MenuItem item) {
        switch (item.getItemId()) {
            case android.R.id.home:
                drawerLayout.openDrawer(GravityCompat.START);
                break;
            case R.id.toolbar_setting:
                Toast.makeText(MainActivity.this, "Waiting for coding for setting", Toast.LENGTH_SHORT).show();
                break;
            case R.id.toolbar_about:
                Toast.makeText(MainActivity.this, "Waiting for coding for about", Toast.LENGTH_SHORT).show();
                break;
            case R.id.toolbar_exit:
                Toast.makeText(MainActivity.this, "Waiting for coding for exit", Toast.LENGTH_SHORT).show();
                break;
            default:
                break;
        }
        return true;
    }
}
```
