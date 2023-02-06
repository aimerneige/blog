---
title: "How to install ffmpeg on Windows 10"
date: 2020-08-10T00:01:10+08:00
draft: false
ShowToc: true
categories: [Others]
tags: [windows,software,ffmpeg]
---

Go [this link](https://ffmpeg.zeranoe.com/builds/) and download a build package.

For the `version`, choose the newest `release` version number like `4.3.1`.

For the `Architecture`, choose the `Windows 64 bit`.

For the `Linking`, choose the `Static`.

For the `License`, it's doesn't matter if you just use it on local.

After selected, just click Download Build. You will get a zip package.

Unzip the package to any location you want. I recommend to the `C:\ffmpeg`

After that, just add the bin folder to the `System Environment PATH`.

Open Windows PowerShell and input `ffmpeg`. If you get the right output, you can enjoy ffmpeg now.

> refer link:\
> https://www.youtube.com/watch?v=qjtmgCb8NcE
