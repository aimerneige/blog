---
title: "设置网络图片"
date: 2020-02-16T01:24:30+08:00
draft: false
ShowToc: true
categories: [Android]
tags: [android]
---

> 通过网络连接获取图片信息，并将其设为软件的 ImageView 图片属性

---

## 介绍：

与获取 `HTML` 类似，首先需要建立网络连接并获取数据，只是这次不通过 `String` 获取保存数据，而是使用 `Bitmap` 保存。

与获取 HTML 数据类似，联网操作同样需要新建线程，要注意的是**在子线程不能操作 UI**，需要通过外部函数设置图片或者在函数返回 `Bitmap` 对象使用。

---

## 核心代码：

1. 建立网络连接，这里使用 `HttpURLConnection`

```java
URL url = new URL("https://www.example.com.img")
HttpURLConnection connection = (HttpURLConnection) url.openConnection();
connection.setRequestMethod("GET");
// ......
// 诸如超时时间等的设置
```

2. 处理返回数据

```java
InputStream is = connection.getInputStream();
Bitmap bitmap = BitmapFactory.decodeStream(is);
```

3. 设置控件，注意该操作不能在子线程中进行

```java
imageView.setImageBitmap(bitmap);
```

---

## 完整代码

> 代码很烂，有很多可以优化的地方

```java
    //设置网络图片
    public void setUrlImage(final int ImageViewId, final String address) {
        //开启一个线程用于联网
        new Thread(new Runnable() {
            @Override
            public void run() {
                try {
                    //把传过来的路径转成URL
                    URL url = new URL(address);
                    //获取连接
                    HttpURLConnection connection = (HttpURLConnection) url.openConnection();
                    //使用GET方法访问网络
                    connection.setRequestMethod("GET");
                    //超时时间为10秒
                    connection.setConnectTimeout(10000);
                    //获取返回码
                    int code = connection.getResponseCode();
                    if (code == 200) {
                        InputStream inputStream = connection.getInputStream();
                        //使用工厂把网络的输入流生产Bitmap
                        Bitmap bitmap = BitmapFactory.decodeStream(inputStream);
                        //子线程不能操作UI，通过外部函数设置图片
                        setImage(ImageViewId, bitmap);
                        inputStream.close();
                    } else {
                        //服务启发生错误，显示提示信息
                        Toast.makeText(HttpImage.this, "Can't get the image from Internet.", Toast.LENGTH_SHORT).show();
                    }

                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }).start();
    }

    public void setImage(int ImageViewId, Bitmap bitmap) {
        ImageView imageView = findViewById(ImageViewId);
        imageView.setImageBitmap(bitmap);
    }
```

## 一些废话

实际上和处理 `HTML` 是类似的，只不过不再使用 `String` 处理服务器返回的数据。
