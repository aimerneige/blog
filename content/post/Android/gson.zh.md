---
title: "使用 Gson 解析 Json 数据"
date: 2020-02-17T00:26:02+08:00
draft: false
ShowToc: true
categories: [Android]
tags: [android]
---

## 新建项目

导入 Gson 依赖

```gradle
    implementation 'com.google.code.gson:gson:2.8.5'
```

## 设计布局

这里设计俩个 `TextView` 和一个 `Button`，点击 `Button` 后发送 `Http` 请求获取 `Json` 数据，并且通过 `Gson` 进行解析，将解析结果显示在 `TextView` 上，以此验证解析成功。

```xml
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout
    xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:orientation="vertical">

    <TextView
        android:id="@+id/text1"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="nodata"/>

    <TextView
        android:id="@+id/text2"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="nodata"/>

    <Button
        android:id="@+id/button"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:text="test"/>

</LinearLayout>
```

代码很简单就不多解释了。另外 **在 Activity 中注册控件** 的内容也省略。

## 发送 Http 请求并获取数据

操作同一般的 HTML 源码获取，这里不多解释。由于保存在网络上的 Json 数据其源码就是合法的 Json 字符串，因此通过解析网页源码的方法获取的内容就是 Json 数据。这里有一个网页保存了 Json 数据，可用于测试。

    https://user.moecraft.net:8443/API/Mc/authlib/

获取源码之后将其保存在一个字符串内即可继续进行下一步操作。此处命名为 `jsonData`。

## 利用 GsonFormat 插件生成映射对象

具体操作方法不解释了，具体看之前发布的博客文章。这里新建的类命名为 `ApiTest` 。

以下代码为 `GsonFormat` 自动生成。

```java
import java.util.List;

public class ApiTest {

    /**
     * meta : {"serverName":"MoeCraft","implementationName":"MoeCraft Account Center: Minecraft Yggdrasil API (Completely Implemented by Kenvix) for Authlib-Injector 1.1.23","implementationVersion":"5.0"}
     * skinDomains : [".moecraft.net",".kenvix.com","accounts.moecraft.net","user.moecraft.net","user.moecraft.net:8443","localhost"]
     * signaturePublickey : -----BEGIN PUBLIC KEY-----
     MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDYM0MxKIv4ybovs4XlwMk4g/0r
     O4+HDK+ltpFDkFjiBY5pDHK4J5Z2tdtkliK7DC2mwIAK5wOeTXYb9uHO8VAVxuE9
     enMSOiVl9uvSVPelDU/t/JH3gSE6yYT7aNHT6xpvqnSQrCUGDvTbsqXvjxEr3F/H
     zORoqhiGR+F27XfOhQIDAQAB
     -----END PUBLIC KEY-----
     * status : 0
     * info :
     */

    private MetaBean meta;
    private String signaturePublickey;
    private int status;
    private String info;
    private List<String> skinDomains;

    public MetaBean getMeta() {
        return meta;
    }

    public void setMeta(MetaBean meta) {
        this.meta = meta;
    }

    public String getSignaturePublickey() {
        return signaturePublickey;
    }

    public void setSignaturePublickey(String signaturePublickey) {
        this.signaturePublickey = signaturePublickey;
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public String getInfo() {
        return info;
    }

    public void setInfo(String info) {
        this.info = info;
    }

    public List<String> getSkinDomains() {
        return skinDomains;
    }

    public void setSkinDomains(List<String> skinDomains) {
        this.skinDomains = skinDomains;
    }

    public static class MetaBean {
        /**
         * serverName : MoeCraft
         * implementationName : MoeCraft Account Center: Minecraft Yggdrasil API (Completely Implemented by Kenvix) for Authlib-Injector 1.1.23
         * implementationVersion : 5.0
         */

        private String serverName;
        private String implementationName;
        private String implementationVersion;

        public String getServerName() {
            return serverName;
        }

        public void setServerName(String serverName) {
            this.serverName = serverName;
        }

        public String getImplementationName() {
            return implementationName;
        }

        public void setImplementationName(String implementationName) {
            this.implementationName = implementationName;
        }

        public String getImplementationVersion() {
            return implementationVersion;
        }

        public void setImplementationVersion(String implementationVersion) {
            this.implementationVersion = implementationVersion;
        }
    }
}
```

源 Json 数据中内容较多，这里我们只挑选部分内容基础进行测试。

此处我们选择解析的对象（目标）是 `MetaBean` 下的 `serverName` 和 `implementationName` 字段。

## 通过 Gson 解析对应内容

1. 构建 Gson 对象

```java
Gson gson = new Gson();
```

2. 通过 `Gson` 解析来构建 `ApiTest` 实体类

```java
ApiTest apiTest = gson.fromJson(jsonData, ApiTest.class);
```

3. 直接通过 `get` 方法访问 `apiTest` 实体类中的内容即可

```java
text1.setText(apiTest.getMeta().getServerName());
text2.setText(apiTest.getMeta().getImplementationName());
```

## 结束

其实很简单，利用谷歌提供的 `Gson` 配合 `GsonFormat` 简直不要太爽。
