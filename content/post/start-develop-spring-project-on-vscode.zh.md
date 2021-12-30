---
title: "使用 vscode 开发 Spring 项目"
date: 2021-12-28T15:37:39+08:00
draft: true
ShowToc: true
categories: [Development]
tags: [vscode,java,spring,tools]
cover:
    image: "images/spring_vscode.svg"
    alt: "Spring VSCode"
    relative: false
---

# 前言

毫无疑问，idea 是最好的 Java IDE 之一，它对 Spring 也有很好的支持，但是由于某高校的 JetBrains 授权被拉入黑名单，导致我无法继续使用正版授权，虽然可以通过给 JetBrains 写邮件，证明自己高校学生的身份后继续获取授权，但是实在是懒，而且我也不是很喜欢使用 IDE，于是就就打算使用 vscode 进行开发。

Visual Studio Code 作为一款优秀的代码编辑器，有非常多的插件，经过配置后完全可以胜任大部分 IDE 的功能，本文章简要介绍如何构建 spring 的开发环境。

# 配置

## 安装配置 Java 和 Maven

{{< notice tip >}}

正常流程配置 Java 和 Maven，如果你已经配置过可以直接跳过

{{< /notice >}}

1. 下载所需的 JDK 并解压。
2. 在环境变量中配置 `JAVA_HOME`
3. 在系统环境变量 PATH 中添加 `JAVA_HOME/bin`
4. 下载 Maven 并解压
5. 在环境变量中配置 `MAVEN_HOME`
6. 在系统环境变量 PATH 中添加 `MAVEN_HOME/bin`

## 安装必要插件

1. [Extension Pack For Java](https://marketplace.visualstudio.com/items?itemName=vscjava.vscode-java-pack)
2. [Gradle Extension Pack](https://marketplace.visualstudio.com/items?itemName=richardwillis.vscode-gradle-extension-pack)
3. [Spring Boot Extension Pack](https://marketplace.visualstudio.com/items?itemName=Pivotal.vscode-boot-dev-pack)
4. [SonarLint](https://marketplace.visualstudio.com/items?itemName=SonarSource.sonarlint-vscode)
5. [Java Code Generators](https://marketplace.visualstudio.com/items?itemName=sohibe.java-generate-setters-getters)

## 在 `settings.json` 中简单配置

```json
{
    "sonarlint.ls.javaHome": "/home/aimerneige/.jdks/openjdk-17.0.1",
    "java.configuration.runtimes": [
        {
            "name": "JavaSE-17",
            "path": "/home/aimerneige/.jdks/openjdk-17.0.1",
            "default": true
        },
        {
            "name": "JavaSE-11",
            "path": "/home/aimerneige/.jdks/corretto-11.0.13"
        },
        {
            "name": "JavaSE-1.8",
            "path": "/home/aimerneige/.jdks/corretto-1.8.0_312"
        }
    ],
    "spring.initializr.defaultLanguage": "Java",
    "spring.initializr.defaultJavaVersion": "8",
    "spring.initializr.defaultArtifactId": "demo",
    "spring.initializr.defaultGroupId": "com.aimerneige",
    "spring.initializr.serviceUrl": [
        "https://start.spring.io"
    ],
    "spring.initializr.defaultPackaging": "JAR",
    "spring.initializr.defaultOpenProjectMethod": "Open"
}
```

以上配置的具体功能可以自行查看插件的官方文档

## 创建新项目

通过 `Ctrl + Shift + P` 快捷键，输入指令 `Spring Initializr` 后选择创建 Gradle 或 Maven 项目，按照指引完成新项目的创建。 
