---
title: "Setup Your Own Apt Mirror"
date: 2024-12-14T23:08:17+08:00
draft: false
ShowToc: true
categories: [Linux]
tags: [apt,self-hosting]
# cover:
#     image: "images/blue_poison.jpg"
#     alt: "Blue Poison"
#     caption: "A Cute Blue Poison"
#     relative: false
---

## What you need

1. a server running ubuntu
2. enough disk space (at least 600G)
3. good internet connection
4. a domain name (optional)
5. a ssl certificate (optional)

## Prepare your server

You can buy a cloud server, or use a local machine. Here, I am using a local machine to setup a offline apt mirror which can speed up my workflow.

## Install `apt-mirror`

Just run the following command to install apt-mirror on your server:

```bash
sudo apt install apt-mirror
```

## Patch apt-mirror (optional)

Use this [repo](https://github.com/apt-mirror/apt-mirror) to patch your apt-mirror. All you need to do is download this repository and replace your `/usr/bin/apt-mirror` with this repo's binary.

You have many ways to do this. You can clone it directly on your server if your server have git. Here, I download the binary and use scp to upload it to my server.

```bash
# run this on your local machine
scp ./apt-mirror username@your-host:~

# run this on your server
sudo mv /usr/bin/apt-mirror /usr/bin/apt-mirror.origin # backup old file
sudo mv ./apt-mirror /usr/bin/
```

This process is optional. If your sync process works fine, ignore this.

## Choose your mirror source

The official source is `http://archive.ubuntu.com/ubuntu/`. You can use it of course, but it may very slow depend on your server's region.

My server is on Beijing, the nearest and fastest mirror is `http://mirrors.huaweicloud.com/ubuntu/`. You can do some speed test and choose the best source for you.

Here are some mirror source in China:

- http://cn.archive.ubuntu.com/ubuntu/
- http://mirrors.huaweicloud.com/ubuntu/
- http://mirrors.aliyun.com/ubuntu/
- http://mirrors.ustc.edu.cn/ubuntu/
- http://mirrors.tuna.tsinghua.edu.cn/ubuntu/
- http://mirrors.sohu.com/ubuntu/
- http://mirrors.163.com/ubuntu/
- http://mirrors.cloud.tencent.com/ubuntu/

## Prepare your disk

Choose a palace to store all the file. You can use the default path which is `/var/spool/apt-mirror`.

If you use a different path, copy `/var/spool/apt-mirror` to your new path:

For example, I want to save all the files under my hhd which is mounted on `/mnt/data`:

```bash
cp /var/spool/apt-mirror /mnt/data/apt-mirror -r
```

## Edit your `mirror.list`

Before start mirroring, edit `/etc/apt/mirror.list` to specify the file store path and source.

Here is a simple example if you need to mirror both noble and jammy:

```
set base_path    /mnt/data/apt-mirror
set nthreads     20
set _tilde 0

# For Ubuntu 24.04
deb http://mirrors.huaweicloud.com/ubuntu/ noble main restricted universe multiverse
deb http://mirrors.huaweicloud.com/ubuntu/ noble-updates main restricted universe multiverse
deb http://mirrors.huaweicloud.com/ubuntu/ noble-backports main restricted universe multiverse
deb http://mirrors.huaweicloud.com/ubuntu/ noble-security main restricted universe multiverse

# For Ubuntu 22.04
deb http://mirrors.huaweicloud.com/ubuntu/ jammy main restricted universe multiverse
deb http://mirrors.huaweicloud.com/ubuntu/ jammy-updates main restricted universe multiverse
deb http://mirrors.huaweicloud.com/ubuntu/ jammy-backports main restricted universe multiverse
deb http://mirrors.huaweicloud.com/ubuntu/ jammy-security main restricted universe multiverse

clean http://mirrors.huaweicloud.com/ubuntu/
```

`noble` is the code name for Ubuntu 24.04. If you need other versions, you can refer to

- noble (24.04)
- jammy (22.04)
- focal (20.04)
- bionic (18.04)
- xenial (16.04)

If you need to mirror both amd64 and i386, change your config file like this:

```
deb-amd64 http://mirrors.huaweicloud.com/ubuntu/ noble main restricted universe multiverse
deb-amd64 http://mirrors.huaweicloud.com/ubuntu/ noble-updates main restricted universe multiverse
deb-amd64 http://mirrors.huaweicloud.com/ubuntu/ noble-backports main restricted universe multiverse
deb-amd64 http://mirrors.huaweicloud.com/ubuntu/ noble-security main restricted universe multiverse

deb-i386 http://mirrors.huaweicloud.com/ubuntu/ noble main restricted universe multiverse
deb-i386 http://mirrors.huaweicloud.com/ubuntu/ noble-updates main restricted universe multiverse
deb-i386 http://mirrors.huaweicloud.com/ubuntu/ noble-backports main restricted universe multiverse
deb-i386 http://mirrors.huaweicloud.com/ubuntu/ noble-security main restricted universe multiverse
```


## Start mirroring

Just run the following command to start mirroring:

```bash
sudo apt-mirror
```

This need a long time to download all files from mirror source depend on your network bandwidth. It may cost up to 6 hours. So I highly recommend you run this under tmux.

## Configure your web server

After apt-mirror did its jobs perfectly, you can checkout the file apt-mirror just downloaded. Then, you need to setup a static web server.

There are a lot way to serve a static web server. You can choose your favorite one like caddy or nginx. Here I use nginx as an example:

```nginx
server {
    listen 80;
    server_name mirrors.aimersoft.org;

    location / {
        return 301 /ubuntu;
    }

    location /ubuntu {
        alias /mnt/data/apt-mirror/mirror/mirrors.huaweicloud.com/ubuntu;
        autoindex on;
    }
}
```

Change the server_name to your domain and change the alias to your path.

If you didn't setup a domain, it's also ok to use bare ip address.

The alias path need to be the father directory of `dists` and `pool`.

```
- ubuntu/ <-- use this path
    - dists/
        - jammy/
        - jammy-backports/
        - jammy-security
        - jammy-updates/
        - noble/
        - noble-backports/
        - noble-security
        - noble-updates/
    - pool/
        - main/
        - multiverse/
        - restricted/
        - universe/
```

## Setup https (optional)

If you want to setup https too, here is an example:

```nginx
server {
    listen 443 ssl http2;
    server_name mirrors.aimersoft.org;

    ssl_certificate /etc/nginx/ssl/fullchain.pem;
    ssl_certificate_key /etc/nginx/ssl/privkey.pem;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
    ssl_ciphers 'EECDH+AESGCM:EDH+AESGCM';

    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Referrer-Policy "no-referrer-when-downgrade";

    location / {
        return 301 /ubuntu;
    }

    location /ubuntu {
        alias /mnt/data/apt-mirror/mirror/mirrors.huaweicloud.com/ubuntu;
        autoindex on;
    }
}
```

## Setup crontab job

Add this line to `/etc/crontab` to auto mirroring every day with crontab:

```
0  3  * * *     root    /usr/bin/apt-mirror
```

## Configure your client

### For Ubuntu 24.04:

Edit this file `/etc/apt/sources.list.d/ubuntu.sources`, replace `URIs` with your sever:

```
Types: deb
# URIs: http://mirrors.huaweicloud.com/ubuntu/
URIs: http://mirrors.aimersoft.org/ubuntu/
Suites: noble noble-updates noble-backports
Components: main restricted universe multiverse
Signed-By: /usr/share/keyrings/ubuntu-archive-keyring.gpg

Types: deb
URIs: http://security.ubuntu.com/ubuntu/
Suites: noble-security
Components: main restricted universe multiverse
Signed-By: /usr/share/keyrings/ubuntu-archive-keyring.gpg
```

### For Ubuntu before 24.04:

You need to edit `/etc/apt/sources.list`. Here is an example for ubuntu 22.04:

```
deb http://mirrors.aimersoft.org/ubuntu/ jammy main restricted universe multiverse
deb http://mirrors.aimersoft.org/ubuntu/ jammy-updates main restricted universe multiverse
deb http://mirrors.aimersoft.org/ubuntu/ jammy-backports main restricted universe multiverse
deb http://mirrors.aimersoft.org/ubuntu/ jammy-security main restricted universe multiverse
```

## Links

- [Anduin - Setup a Ubuntu apt mirror server](https://anduin.aiursoft.cn/post/2024/2/8/setup-a-ubuntu-apt-mirror-server)
- [Rey Saeed - How to create an offline APT mirror (Ubuntu focused)](https://medium.com/@rsaeedbiz/how-to-create-an-offline-apt-mirror-ubuntu-focused-980e5d022337)
- [Joshua - Setting Up a Local Apt Mirror for PPAs](https://blog.lupecode.com/setting-up-a-local-apt-mirror-for-ppas/)
- [Ask Ubuntu - How to create a local repository using apt-mirror and mirrorkit?](https://askubuntu.com/questions/551064/how-to-create-a-local-repository-using-apt-mirror-and-mirrorkit)
- [Ask Ubuntu - How can I prevent apt-mirror from downloading ALL packages](https://askubuntu.com/questions/1033669/how-can-i-prevent-apt-mirror-from-downloading-all-packages)
- [Ask Ubuntu - Can a PPA be added to an Ubuntu repo mirror?](https://askubuntu.com/questions/28124/can-a-ppa-be-added-to-an-ubuntu-repo-mirror)
- [腾讯镜像源 - Ubuntu 源帮助文档](https://mirrors.tencent.com/help/ubuntu.html)
