---
title: "Auto Start Wifi Hotspot on Gnome"
date: 2021-11-07T20:54:42+08:00
draft: true
ShowToc: true
# description: "description here"
# categories: [Linux]
# tags: [tools]
# cover:
#     image: "images/blue_poison.jpg"
#     alt: "Blue Poison"
#     caption: "A Cute Blue Poison"
#     relative: false
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
