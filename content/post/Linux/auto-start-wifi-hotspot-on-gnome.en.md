---
title: "Auto Start Wifi Hotspot on Gnome"
date: 2021-11-07T20:54:42+08:00
draft: false
ShowToc: true
categories: [Linux]
tags: [tools,wifi]
cover:
    image: "images/wifi-auto-start.png"
    alt: "WiFi Logo"
    relative: false
---

Edit and save file `nmcli-hotspot.desktop` on path `/home/aimerneige/.config/autostart`

```desktop
[Desktop Entry]
Name=nmcli-hotspot
Comment=Open HotSport With nmcli
Exec=nmcli connection up Hotspot
Terminal=true
Type=Application
```
