---
title: "使用 Nginx 搭建静态网页服务"
date: 2020-10-04T01:18:44+08:00
draft: false
ShowToc: true
categories: [DevOps]
tags: [web,nginx]
cover:
    image: "images/nginx.png"
    alt: "nginx-logo"
    relative: false
---

> 使用 Nginx 搭建静态网页服务本身是一件非常简单的事，但是我之前在 `CSDN` 找了几篇教程，弄了一下午也没弄好（不愧是屎山淘金），学了一段时间后端和 Linux 后，我大概只用了五分钟就弄好了，这里写一篇文章来帮助一下小白。

## 阅读须知

**在阅读本文章前，你需要准备以下内容**

1. **掌握基础的 `Linux` 命令行操作** （本文章将介绍如何在 `Linux` 服务器上部署静态网页，需要进行终端操作，因此你必须掌握命令行的使用。如果你打算使用 `Windows` ，请查阅其他文章。）
2. **拥有一台 `Linux 服务器`** （可以购买 `VPS` 也可以使用 `虚拟机` 本文章以 `VPS` 为例，并购置了域名 _（域名非必须）_ ）
3. **拥有一个静态网站的源码** （如果仅仅作为学习目的，你可以写一个简单的 HTML 文件，这里以使用 `hexo` 生成的静态网站为例。）
4. **知道 `Nginx` 是什么，有什么用** （不需要掌握 `Nginx`）

**不同 `Linux` 发行版下命令会有所区别，本文章以 `Ubuntu20.04` 为例**

## 准备服务器

如果你已经有了一台服务器并安装好了 `Nginx` ，你可以直接跳过这一部分，但是如果你的服务器是新的，没有经过任何配置，请参阅以下内容进行配置。

### 升级系统

```bash
sudo apt update && sudo apt upgrade
```

### 安装 `Nginx`

```bash
sudo apt install nginx
```

### 启动 `Nginx`

```bash
sudo systemctl start nginx
# 开机自动启动
sudo systemctl enable nginx
```

### 测试服务

直接在浏览器访问你服务器的 ip，如果你部署了 `DNS` 服务的话，你也可以直接使用域名。如果哦看到 `Nginx` 的欢迎界面，服务器准备成功！

## 将网站源码发送到服务器

这一步可以有很多的选择，你可以通过 `github` 来 clone，也可以直接使用一些 `ftp` 工具。这里演示使用 `tar` 打包并使用 `scp` 上传。

### 打包压缩源文件

当然，你可以使用其他指令打包压缩或者不压缩，这里使用 `xz` 压缩以节省网络流量。

```bash
tar -Jcv -f site.tar.xz public/
```

### 将压缩包上传到服务器

```bash
scp site.tar.xz root@test.aimerneige.com:~/
```

### 在服务器解压压缩包

通常，我们会将静态网站的源文件放置在 `/var/www/` 这个目录下，但是你也可以放置在家目录或其他你喜欢的位置下。

```bash
tar -Jxv -f site.tar.xz -C ./
sudo mv public/ /var/www/blog
```

## 配置 `Nginx`

> 本文章并不会介绍如何使用 `Nginx` ，并且阅读本文章并不需要掌握 `Nginx`，你只需要了解 `Nginx` 有什么用即可。因为如果只是部署一个简单的静态网页，只需要简单修改默认配置即可。如果你想了解更多关于 `Nginx` 的内容请查阅其他文章。

### 修改配置

直接使用 `vim` 修改默认的配置文件即可。 如果你没有安装 `vim` ，执行 `sudo apt install vim` 来安装它，当然你也可以使用自己喜欢的编辑器。

```bash
sudo vim /etc/nginx/sites-available/default
```

找到这一行：

```nginx
    root /var/www/html;
```

修改为源文件所在目录：

```nginx
    root /var/www/blog;
```

如果你需要配置域名，找到这一行：

```nginx
    server_name _;
```

将 `_` 修改为你的域名。

### 检查配置是否正确

```bash
sudo nginx -t
```

如果得到类似如下的输出，则证明配置文件没有错误。

```bash
nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
nginx: configuration file /etc/nginx/nginx.conf test is successful
```

如果你的配置文件出现了问题，请重新修改。

### 重启 `Nginx`

```bash
sudo nginx -s reload
```

## 检查站点

重新访问你的服务器 ip 或域名，检查服务是否成功部署。

---

## 后记

### 为什么 `Nginx` 的配置文件要这样改

`Nginx` 的默认配置文件位于 `/etc/nginx/` 目录下，主配置文件为 `nginx.conf`

我们首先看一下默认的主配置文件

```nginx
user www-data;
worker_processes auto;
pid /run/nginx.pid;
include /etc/nginx/modules-enabled/*.conf;

events {
    worker_connections 768;
    # multi_accept on;
}

http {

    ##
    # Basic Settings
    ##

    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;
    # server_tokens off;

    # server_names_hash_bucket_size 64;
    # server_name_in_redirect off;

    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    ##
    # SSL Settings
    ##

    ssl_protocols TLSv1 TLSv1.1 TLSv1.2 TLSv1.3; # Dropping SSLv3, ref: POODLE
    ssl_prefer_server_ciphers on;

    ##
    # Logging Settings
    ##

    access_log /var/log/nginx/access.log;
    error_log /var/log/nginx/error.log;

    ##
    # Gzip Settings
    ##

    gzip on;

    # gzip_vary on;
    # gzip_proxied any;
    # gzip_comp_level 6;
    # gzip_buffers 16 8k;
    # gzip_http_version 1.1;
    # gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    ##
    # Virtual Host Configs
    ##

    include /etc/nginx/conf.d/*.conf;
    include /etc/nginx/sites-enabled/*;
}


#mail {
#    # See sample authentication script at:
#    # http://wiki.nginx.org/ImapAuthenticateWithApachePhpScript
#
#    # auth_http localhost/auth.php;
#    # pop3_capabilities "TOP" "USER";
#    # imap_capabilities "IMAP4rev1" "UIDPLUS";
#
#    server {
#        listen     localhost:110;
#        protocol   pop3;
#        proxy      on;
#    }
#
#    server {
#        listen     localhost:143;
#        protocol   imap;
#        proxy      on;
#    }
#}
```

去掉全部的注释

```nginx
user www-data;
worker_processes auto;
pid /run/nginx.pid;
include /etc/nginx/modules-enabled/*.conf;

events {
    worker_connections 768;
}

http {

    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;

    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    ssl_protocols TLSv1 TLSv1.1 TLSv1.2 TLSv1.3; # Dropping SSLv3, ref: POODLE
    ssl_prefer_server_ciphers on;

    access_log /var/log/nginx/access.log;
    error_log /var/log/nginx/error.log;

    gzip on;

    xml application/xml application/xml+rss text/javascript;

    include /etc/nginx/conf.d/*.conf;
    include /etc/nginx/sites-enabled/*;
}
```

默认的服务为什么可以跑呢？注意这一行：

```nginx
    include /etc/nginx/sites-enabled/*;
```

切换到 `/etc/nginx/sites-enabled/` 目录下，并查看文件

```bash
cd /etc/nginx/sites-enabled/
ls
```

我们会发现只有一个 `default` 文件

查看它的内容：

```nginx
##
# You should look at the following URL's in order to grasp a solid understanding
# of Nginx configuration files in order to fully unleash the power of Nginx.
# https://www.nginx.com/resources/wiki/start/
# https://www.nginx.com/resources/wiki/start/topics/tutorials/config_pitfalls/
# https://wiki.debian.org/Nginx/DirectoryStructure
#
# In most cases, administrators will remove this file from sites-enabled/ and
# leave it as reference inside of sites-available where it will continue to be
# updated by the nginx packaging team.
#
# This file will automatically load configuration files provided by other
# applications, such as Drupal or Wordpress. These applications will be made
# available underneath a path with that package name, such as /drupal8.
#
# Please see /usr/share/doc/nginx-doc/examples/ for more detailed examples.
##

# Default server configuration
#
server {
    listen 80 default_server;
    listen [::]:80 default_server;

    # SSL configuration
    #
    # listen 443 ssl default_server;
    # listen [::]:443 ssl default_server;
    #
    # Note: You should disable gzip for SSL traffic.
    # See: https://bugs.debian.org/773332
    #
    # Read up on ssl_ciphers to ensure a secure configuration.
    # See: https://bugs.debian.org/765782
    #
    # Self signed certs generated by the ssl-cert package
    # Don't use them in a production server!
    #
    # include snippets/snakeoil.conf;

    root /var/www/html;

    # Add index.php to the list if you are using PHP
    index index.html index.htm index.nginx-debian.html;
    # index test.json;

    server_name _;

    location / {
        # First attempt to serve request as file, then
        # as directory, then fall back to displaying a 404.
        try_files $uri $uri/ =404;
    }

    # pass PHP scripts to FastCGI server
    #
    #location ~ \.php$ {
    #    include snippets/fastcgi-php.conf;
    #
    #    # With php-fpm (or other unix sockets):
    #    fastcgi_pass unix:/var/run/php/php7.4-fpm.sock;
    #    # With php-cgi (or other tcp sockets):
    #    fastcgi_pass 127.0.0.1:9000;
    #}

    # deny access to .htaccess files, if Apache's document root
    # concurs with nginx's one
    #
    #location ~ /\.ht {
    #    deny all;
    #}
}


# Virtual Host configuration for example.com
#
# You can move that to a different file under sites-available/ and symlink that
# to sites-enabled/ to enable it.
#
#server {
#    listen 80;
#    listen [::]:80;
#
#    server_name example.com;
#
#    root /var/www/example.com;
#    index index.html;
#
#    location / {
#        try_files $uri $uri/ =404;
#    }
#}
```

去掉注释：

```nginx
server {
    listen 80 default_server;
    listen [::]:80 default_server;

    root /var/www/html;

    index index.html index.htm index.nginx-debian.html;

    server_name _;

    location / {
        try_files $uri $uri/ =404;
    }
}
```

我相信哪怕没有学习过 `Nginx` 应该也能理解部分含义。

接下来我们看一下 `/var/www/html` 这个目录

```bash
cd /var/www/html
ls
```

只有一个 `index.nginx-debian.html` 文件，正是欢迎界面的源代码。

```html
<!DOCTYPE html>
<html>
<head>
<title>Welcome to nginx!</title>
<style>
    body {
        width: 48em;
        margin: 0 auto;
        font-family: Tahoma, Verdana, Arial, sans-serif;
    }
</style>
</head>
<body>
<h1>Welcome to Nginx!</h1>
<p>If you see this page, the nginx web server is successfully installed and
working. Further configuration is required.</p>

<p>For online documentation and support please refer to
<a href="http://nginx.org/">nginx.org</a>.<br/>
Commercial support is available at
<a href="http://nginx.com/">nginx.com</a>.</p>

<p><em>Thank you for using nginx.</em></p>
</body>
</html>
```

回到 `/etc/nginx/sites-enabled/` 目录下，我想你应该明白应该修改什么了吧。

<!-- ```nginx
server {
    listen 80;

    server_name example.com;

    location / {
        proxy_pass http://localhost:3000/;
    }
}
``` -->
