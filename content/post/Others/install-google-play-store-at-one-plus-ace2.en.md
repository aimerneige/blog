---
title: "Install Google Play Store at One Plus Ace2"
date: 2023-03-15T14:20:08+08:00
draft: false
ShowToc: true
categories: [Others]
tags: [google,android]
cover:
    image: "images/oneplus-google-play.png"
    alt: "One Plus Google Play"
    relative: false
---

Today, I buy a new phone [One Plus ACE 2][ace2]. It's a good phone and it contains GMS which can be enabled from settings. But it did not give you a google play store, which I really need to install some paid apps. So here is how you can install one.

## Enable GMS From Settings

1. Open your settings app, search `google`.
2. Click the first result `Google Mobile Services`.
3. Enable Google Mobile Services.
4. Login in your google account at `Google` if you want.

## Install Google Play Store

After you enable GMS, all you need to do next is install a google play store.

You can download a google play store app from [apkmirror][playstore]. Just download the newest version of the play store is fine. For the *Architecture*, select `arm64-v8a`.

After you download, you will get a `apkm` file, which is not a regular apk file. You need to installed it with a tool called [APKMirror Installer (Official)][apkmirror]. You need this app to install app store, so you must download this app from [apkpure][apkpure].

After install the APKMirror Installer, just open the `apkm` file with APKMirror Installer. Every thing will be installed right way.

[ace2]: https://www.oneplus.com/cn/ace-2
[playstore]: https://www.apkmirror.com/apk/google-inc/google-play-store/
[apkmirror]: https://play.google.com/store/apps/details?id=com.apkmirror.helper.prod
[apkpure]: https://apkpure.com/apkmirror-installer-official/com.apkmirror.helper.prod
