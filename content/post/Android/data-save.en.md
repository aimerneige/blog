---
title: "Android Develop Data Save"
date: 2020-08-10T00:50:41+08:00
draft: false
ShowToc: true
categories: [Android]
tags: [android]
---

## Save data to file

### save data

```kotlin
// This function will save the data of inputText into file "data" as text file
// The file "data" will be saved to /data/data/com.aimerneige.example/files/data
fun save(inputText: String) {
    try {
        // "data" is the name of the file you saved on phone storage
        // You can change it as you want
        val output = openFileOutput("data", Context.MODE_PRIVATE)
        val writer = BufferedWriter(OutputStreamWriter(output))
        writer.use {
            it.write(inputText)
        }
    } catch (e: IOException) {
        e.printStackTrace()
    }
}
```

### load data

```kotlin
// This function will try to load the data at a file named "data"
// which is on /data/data/com.aimerneige.example/files/data
fun load(): String {
    // a StringBuilder to load data
    val content = StringBuilder()
    try {
        // "data" is the name of the file you want to find on disk
        val input = openFileInput("data")
        val reader = BufferedReader(InputStreamReader(input))
        reader.use {
            reader.forEachLine {
                content.append(it)
            }
        }
    }
    catch (e: IOException) {
        e.printStackTrace()
    }
    return content.toString()
}
```

You can also use like this:

### save data with file name

```kotlin
fun save(data_input: String, file_name: String) {
    try {
        val output = openFileOutput(file_name, Context.MODE_PRIVATE)
        val writer = BufferedWriter(OutputStreamWriter(output))
        writer.use {
            it.write(data_input)
        }
    } catch (e: IOException) {
        e.printStackTrace()
    }
}
```

### read data with file name

```kotlin
fun load(file_name: String): String {
    val content = StringBuilder()
    try {
        val input = openFileInput(file_name)
        val reader = BufferedReader(InputStreamReader(input))
        reader.use {
            reader.forEachLine {
                content.append(it)
            }
        }
    }
    catch (e: IOException) {
        e.printStackTrace()
    }
    return content.toString()
}
```

In this way, all of the file will saved into the file `/data/data/{package-name}/files/{file-name}`.

## Save data with SharedPreferences

### save data

```kotlin
// This function will save much data with key-value into file "data.xml"
// The file "data.xml" will be saved to /data/data/com.aimerneige.example/shared_prefs/data.xml
button_save.setOnClickListener {
    // "data" is the name of the file you saved on phone storage
    // You can change it as you want
    val editor = getSharedPreferences("data", Context.MODE_PRIVATE).edit()
    editor.putString("name", "Tom")
    editor.putInt("age", 28)
    editor.putBoolean("married", false)
    editor.apply()
}

```

### load data

```kotlin
// This function will try to load the data at "data.xml"
// which is on /data/data/com.aimerneige.example/shared_prefs/data.xml
button_load.setOnClickListener {
    // "data" is the name of the file without the .xml
    val prefs = getSharedPreferences("data", Context.MODE_PRIVATE)
    // needless to check if the file contains the data
    // just use a val to  read it, if failed, use the default value
    val name = prefs.getString("name", "")
    val age = prefs.getInt("age", 0)
    val married = prefs.getBoolean("married", false)
    val sb = StringBuilder()
    sb.append("Name: " + name + " ")
    sb.append("Age: " + age.toString() + " ")
    sb.append("Married: " + married.toString() + ".")
    Toast.makeText(this, sb.toString(), Toast.LENGTH_SHORT).show()
}
```

In this way, all of the file will saved into the file `/data/data/{package-name}/shared_prefs/{file-name}.xml`.

Or, you can get a SharedPreferences in this way:

```kotlin
val prefs = getSharedPreferences(Context.MODE_PRIVATE)
```

This will save data into the file `/data/data/{package-name}/shared_prefs/{current-activity-class-name}.xml`
