---
title: "Build Better Apps Faster With Jetpack Compose"
date: 2021-10-25T16:54:52+08:00
draft: true
ShowToc: true
description: "Beginner With Jetpack Compose"
categories: [Android]
tags: [jetpack,android]
cover:
    image: "images/jetpack-compose.png"
    alt: "jetpack-compose-logo"
    relative: false
---

> Please visit [Jetpack Compose Official Website](https://developer.android.com/jetpack/compose) for more information.

## What can you do with jetpack compose?

- You can build android native apps more quickly and more simply.
- You can do all of the work with kotlin and needless to write any xml code.
- You can write many compose which is more reusable.

## How to get started with jetpack compose?

1. Download or upgrade your Android Studio to [Android Studio Arctic Fox](https://developer.android.com/studio).
2. Try Jetpack Compose sample apps.
   1. If you’re in the **Welcome to Android Studio** window, select **Import an Android code sample**. If you already have an Android Studio project open, select **File > New > Import Sample** from the menu bar.
   2. In the search bar near the top of the **Browse Samples** wizard, type "compose".
   3. Select one of the Jetpack Compose sample apps from the search results and click **Next**.
   4. Either change the **Application name** and **Project location** or keep the default values.
   5. Click **Finish**.
3. Create a new app with support for Jetpack Compose.
   1. If you’re in the **Welcome to Android Studio** window, click **Start a new Android Studio project**. If you already have an Android Studio project open, select **File > New > New Project** from the menu bar.
   2. In the **Select a Project Template** window, select **Empty Compose Activity** and click **Next**.
   3. In the **Configure your project** window, do the following:
      1. Set the **Name**, **Package name**, and **Save location** as you normally would.
      2. Note that, in the **Language** dropdown menu, **Kotlin** is the only available option because Jetpack Compose works only with classes written in Kotlin.
      3. In the **Minimum API level** dropdown menu, select API level 21 or higher.
   4. Click **Finish**.
   5. Verify that the project's build.gradle file is configured correctly, as described in [Add Jetpack Compose toolkit dependencies](https://developer.android.com/jetpack/compose/setup#compose-compiler).

## Tutorial

### Composable functions

Add a text element

```kotlin
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            Text("Hello world!")
        }
    }
}
```

Define a composable function

```kotlin
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            MessageCard("Android")
        }
    }
}

@Composable
fun MessageCard(name: String) {
    Text(text = "Hello $name!")
}
```

Preview in Android Studio

```kotlin
@Composable
fun MessageCard(name: String) {
    Text(text = "Hello $name!")
}

@Preview
@Composable
fun PreviewMessageCard() {
    MessageCard("Android")
}
```

### Layouts

Add multiple texts

```kotlin
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            MessageCard(Message("Android", "Jetpack Compose"))
        }
    }
}

data class Message(
    val author: String,
    val body: String,
)

@Composable
fun MessageCard(msg: Message) {
    Text(text = msg.author)
    Text(text = msg.body)
}

@Preview
@Composable
fun PreviewMessageCard() {
    MessageCard(
        msg = Message(
            "Colleague",
            "Hey, take a look at Jetpack Compose, it's great!",
        )
    )
}
```

Using a Column

```kotlin
@Composable
fun MessageCard(msg: Message) {
    Column {
        Text(text = msg.author)
        Text(text = msg.body)
    }
}
```

Add an image element

```kotlin
@Composable
fun MessageCard(msg: Message) {
    Row {
        Image(
            painter = painterResource(R.drawable.profile_picture),
            contentDescription = "Contact profile picture",
        )
        Column {
            Text(text = msg.author)
            Text(text = msg.body)
        }
    } 
}
```

Configure your layout

```kotlin
@Composable
fun MessageCard(msg: Message) {
    // Add padding around our message
    Row(modifier = Modifier.padding(all = 8.dp)) {
        Image(
            painter = painterResource(R.drawable.profile_picture),
            contentDescription = "Contact profile picture",
            modifier = Modifier
                // Set image size to 40 dp
                .size(40.dp)
                // Clip image to be shaped as a circle
                .clip(CircleShape)
        )

        // Add a horizontal space between the image and the column
        Spacer(modifier = Modifier.width(8.dp))

        Column {
            Text(text = msg.author)
            // Add a vertical space between the author and message texts
            Spacer(modifier = Modifier.height(4.dp))
            Text(text = msg.body)
        }
    }
}
```

### Material design

Use Material Design

```kotlin

```
