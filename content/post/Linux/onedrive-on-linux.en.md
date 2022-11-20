---
title: "Onedrive on Linux"
date: 2022-11-20T20:10:48+08:00
draft: false
ShowToc: true
categories: [Linux]
tags: [tools,onedrive]
# cover:
#     image: "images/blue_poison.jpg"
#     alt: "Blue Poison"
#     caption: "A Cute Blue Poison"
#     relative: false
---

# Onedrive on Linux

## Install

```bash
sudo dnf install onedrive
```

## Login

```bash
[user@hostname ~]$ onedrive

Authorize this app visiting:

https://.....

Enter the response uri:
```

Copy the url from browser like this:

```bash
https://login.microsoftonline.com/common/oauth2/nativeclient?code=<redacted>
```

Paste it into terminal then press enter:

The Final result will like this:

```bash
[user@hostname ~]$ onedrive
Authorize this app visiting:

https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=22c49a0d-d21c-4792-aed1-8f163c982546&scope=Files.ReadWrite%20Files.ReadWrite.all%20Sites.ReadWrite.All%20offline_access&response_type=code&redirect_uri=https://login.microsoftonline.com/common/oauth2/nativeclient

Enter the response uri: https://login.microsoftonline.com/common/oauth2/nativeclient?code=<redacted>

Application has been successfully authorized, however no additional command switches were provided.

Please use 'onedrive --help' for further assistance in regards to running this application.
```

## Configuration

Show your configuration:

```bash
onedrive --display-config
```

Test your configuration:

```bash
onedrive --synchronize --verbose --dry-run
```

Performing a sync:

```bash
onedrive --synchronize
```

Download default config:

```bash
mkdir -p ~/.config/onedrive
wget https://raw.githubusercontent.com/abraunegg/onedrive/master/config -O ~/.config/onedrive/config
vim ~/.config/onedrive/config
```

## Service

```bash
systemctl --user enable onedrive
systemctl --user start onedrive
```

```bash
systemctl --user status onedrive.service
```

# Link

- [GitHub - abraunegg/onedrive](https://github.com/abraunegg/onedrive)
- [GitHub - USAGE.md](https://github.com/abraunegg/onedrive/blob/master/docs/USAGE.md)