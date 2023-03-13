---
title: "Install qBittorrent-nox Inside Docker"
date: 2023-03-13T20:27:07+08:00
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

```bash
docker create \
  --name=qbittorrent-nox \
  -e TZ=Europe/Zurich \
  -e UMASK_SET=022 \
  -p 8080:8080 `#webui port` \
  -p 8999:8999 `#bittorrent port` \
  -v /home/user/config:/config \
  -v /media/ExtDrive/MediaRoot:/media \
  --restart always `#or: unless-stopped` \
  --user 1000:1000 \
  tsubus/qbittorrent-nox
```
