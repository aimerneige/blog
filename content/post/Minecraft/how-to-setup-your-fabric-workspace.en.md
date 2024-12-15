---
title: "How to Setup Your Fabric Workspace"
date: 2024-03-17T21:16:38+08:00
draft: false
ShowToc: true
categories: [Minecraft]
tags: [java,minecraft,fabric]
---

## Prepare JDK and IDE

Just simply download [IntellJ IDEA Community][idea] is good for fabric development.

Keep in mind that you must download jdk-17 for development. You can download the jdk inside IDEA or download it manually. But don't forget to setup in IDEA.

## Download Template

You can download a template in [fabric template mod generator][template].

Setup your own Mod Name, Mod ID and Package Name. Select the newest minecraft version and download the zip file.

{{< notice note >}}

In the Advanced Option, check **Data Generation** and uncheck **Split client and common sources**

{{< /notice >}}

Unzip the zip file and open it with IDEA, wait for IDEA to load the project.

## Checkup Project JDK version

Check *File - Project Structure*, make sure that the *SDK* and *Language level* are all set to jdk version 17.

Check *File - Settings - Build, Execution, Deployment - Build Tools - Gradle*, make sure the *Gradle JVM* is set to jdk version 17.

## Add Mod Client

Add a client entrypoints inside `./src/main/resources/fabric.mod.json`

```json
{
  // ...
  "entrypoints": {
		// ...
    "client": [
          "com.example.TemplateModClient"
        ],
    // ...
	},
  // ...
}
```

Create a new class in `./src/main/java/com/example/TemplateModClient.java`

```java
package com.example;

import net.fabricmc.api.ClientModInitializer;

public class TemplateModClient implements ClientModInitializer {
    @Override
    public void onInitializeClient() {

    }
}
```

## Generate Minecraft Source Code

Open Terminal, run this command:

```bash
./gradlew genSources
```

This command needs some time to run and you can go for drinking a cup of coffee ☕.

After enjoy your hot coffee, go to `./src/main/java/com/example/mixin/ExampleMixin.java`, holding ctrl and click `MinecraftServer`:

```java
// package, importing ...

@Mixin(MinecraftServer.class) // <--- this line
public class ExampleMixin {
  // class define ...
}
```

Accept the EULA and in the top blue warning, click `Choose Sources`, select the jar file with end of `*-source.jar`

## Start Minecraft Development Client

In the right tab, click `Gradle`. Inside `Tasks - fabric`, double click the `runClient` and the minecraft client for development is going to start soon.

If the minecraft client start successfully, restart the IDEA, then the IDEA's run entry will setup correctly as `runClient` which start a development minecraft client.

## Setup Your Version Control System

In the end, don't forget to manage your source code with version control system like git, or even better, share it to GitHub.

## JetBrains Plugin

Install this [JetBrains Plugin][jbplugin] to get better development experience.

## More Information

1. [Fabric][fabric]
2. [Fabric WiKi][wiki]

[idea]: https://www.jetbrains.com/idea/
[fabric]: https://fabricmc.net/
[wiki]: https://fabricmc.net/wiki/start/
[template]: https://fabricmc.net/develop/template/
[jbplugin]: https://plugins.jetbrains.com/plugin/8327-minecraft-development
