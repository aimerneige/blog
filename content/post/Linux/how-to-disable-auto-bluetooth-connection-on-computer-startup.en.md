---
title: "How to Disable Auto Bluetooth Connection on Computer Startup"
date: 2023-04-17T17:49:10+08:00
draft: false
ShowToc: true
categories: [Linux]
tags: [GNOME,bluetooth]
---

## Preface

As I have multiple electronic devices and paired several Bluetooth earphones, I encountered an issue where my computer automatically took over the audio signal of the earphones while I was enjoying music on my phone. This forced me to reconnect the earphones to my phone, which significantly affected my music experience. Therefore, I conducted relevant research and eventually found a way to prevent my computer from automatically connecting to Bluetooth earphones. I hope this article can be helpful to you too.

## How

Edit file `/etc/bluetooth/main.conf`:

```bash
sudo vim /etc/bluetooth/main.conf
```

Find these content:

```conf
# AutoEnable defines option to enable all controllers when they are found.
# This includes adapters present on start as well as adapters that are plugged
# in later on. Defaults to 'true'.
# AutoEnable=true
```

Edit it, disable the auto connect:

```conf
AutoEnable=false
```

Restart your computer, see if it works.
