---
title: "Certbot With Nginx"
date: 2024-12-09T00:20:45+08:00
draft: true
ShowToc: true
description: "Use certbot to enable https with nginx automatically"
# categories: [Linux]
# tags: [tools]
# cover:
#     image: "images/blue_poison.jpg"
#     alt: "Blue Poison"
#     caption: "A Cute Blue Poison"
#     relative: false
---

## 1. SSH into the server

```bash
ssh app.aimersoft.org
```

## 2. Install system dependencies

```bash
sudo apt update
sudo apt install python3 python3-venv libaugeas0
```

## 3. remove

```bash
sudo apt-get remove certbot
```

## 4. Set up a Python virtual environment 

```bash
sudo python3 -m venv /opt/certbot/
sudo /opt/certbot/bin/pip install --upgrade pip
```

## 5. Install Certbot

```bash
sudo /opt/certbot/bin/pip install certbot certbot-nginx
```

## 6. Prepare the Certbot command

```bash
sudo ln -s /opt/certbot/bin/certbot /usr/bin/certbot
```

## 7. Choose how you'd like to run Certbot

setup 

```bash
sudo certbot --nginx
```

get certificate only:

```bash
sudo certbot certonly --nginx
```

## 8. Set up automatic renewal

Add this two line in `/etc/crontab`

```
0 0,12 * * * root /opt/certbot/bin/python -c 'import random; import time; time.sleep(random.random() * 3600)' && sudo certbot renew -q
1 2 3 * * root /opt/certbot/bin/pip install --upgrade certbot certbot-nginx
```

## 9. Links

- <https://certbot.eff.org/instructions?ws=nginx&os=pip>
