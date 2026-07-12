---
title: "使用 mkcert 为本地 Homelab 签发泛域名证书"
date: 2026-07-12T00:00:00+08:00
draft: false
ShowToc: true
categories: [Web]
tags: [mkcert,https,nginx,homelab]
---

{{< notice warning >}}

本文完全使用 codex 生成，未经过人工核验，请注意鉴别其中内容

{{</ notice >}}

我的场景很简单：主机是 Fedora，NAS 是 Ubuntu Server，NAS 上跑 Nginx 做反向代理，本地还有一些 Docker 服务。访问方式希望统一成 `app.aimersoft.org` 这种子域名。

之前的方案是用 Let's Encrypt 签 `*.aimersoft.org`，但 DNS-01 验证需要等解析生效，续期和临时补证书都比较烦。对于只在内网访问的 Homelab 服务，更合适的方案是：用 `mkcert` 建一个本地 CA，然后签一张本地泛域名证书。

这个方案的核心不是让证书变成公开可信，而是让自己的设备信任自己的 CA。

## 适用范围

这套方案适合：

- 服务只在内网访问。
- 访问设备基本都是自己的电脑、手机、平板。
- 可以接受在每台设备上手动安装一次本地根证书。
- 不想为了内网服务反复折腾 Let's Encrypt 的 DNS 验证。

它不适合：

- 面向公网用户或访客设备的服务。
- 你不方便给访问设备安装根证书。
- 需要第三方客户端、移动 App、外部监控默认信任 HTTPS 的场景。

如果服务真的要开放给别人访问，继续用 Let's Encrypt，并用 DNS API 做自动续签会更合适。`mkcert` 是本地开发和内网自用工具，不是公网证书方案。

## 整体思路

最终结构是这样：

1. 在 Fedora 主机上运行 `mkcert -install`，生成并信任本地 CA。
2. 用这个 CA 签发 `aimersoft.org` 和 `*.aimersoft.org` 的证书。
3. 把证书和私钥放到 Ubuntu NAS 上，交给 Nginx 使用。
4. 在内网 DNS 中把需要的子域名解析到 NAS 的内网 IP。
5. 手机、Mac、其他电脑手动安装 `rootCA.pem`。

这里推荐在主力机 Fedora 上生成证书，而不是在 NAS 上生成。因为 `mkcert -install` 会顺手把本地 CA 安装进当前机器的系统信任库和浏览器相关信任库，主力机访问时最省事。

## 在 Fedora 上生成证书

先安装 `mkcert` 和 NSS 工具：

```bash
sudo dnf install mkcert nss-tools
```

初始化本地 CA：

```bash
mkcert -install
```

然后签发证书：

```bash
mkcert -cert-file aimersoft.org.pem -key-file aimersoft.org-key.pem "aimersoft.org" "*.aimersoft.org"
```

这里同时写了两个域名：

- `aimersoft.org`：根域名。
- `*.aimersoft.org`：一级子域名，比如 `app.aimersoft.org`、`nas.aimersoft.org`。

`*.aimersoft.org` 不覆盖 `aimersoft.org` 本身，所以如果根域名也要用同一张证书，必须单独写上。

生成后会得到两个文件：

```text
aimersoft.org.pem
aimersoft.org-key.pem
```

前者是证书，后者是这张证书的私钥。它们需要放到 NAS 上给 Nginx 使用。

## 配置 NAS 上的 Nginx

把 `aimersoft.org.pem` 和 `aimersoft.org-key.pem` 上传到 NAS，例如放在：

```text
/etc/nginx/certs/aimersoft.org.pem
/etc/nginx/certs/aimersoft.org-key.pem
```

然后在 Nginx 中为具体服务配置反代：

```nginx
server {
    listen 80;
    server_name app.aimersoft.org;

    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name app.aimersoft.org;

    ssl_certificate /etc/nginx/certs/aimersoft.org.pem;
    ssl_certificate_key /etc/nginx/certs/aimersoft.org-key.pem;

    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

如果 Docker 服务就在 NAS 上，并且端口发布到了宿主机，`127.0.0.1:8080` 通常可以工作。如果服务跑在另一台机器上，就把 `proxy_pass` 改成对应的内网 IP 和端口。

改完先检查配置，再重载 Nginx：

```bash
sudo nginx -t
sudo systemctl reload nginx
```

同一张泛域名证书可以复用给多个 `server`。也就是说，新增 `jellyfin.aimersoft.org`、`gitea.aimersoft.org` 时，不需要重新签证书，只要复用同样的 `ssl_certificate` 和 `ssl_certificate_key` 即可。

证书通用不等于 Nginx 会自动知道每个服务要反代到哪里。每个服务的 `server_name` 和 `proxy_pass` 仍然需要自己配置，或者交给 Nginx Proxy Manager 这类工具管理。

## 配置内网 DNS

证书只解决 HTTPS 信任问题，DNS 决定浏览器访问 `app.aimersoft.org` 时流量去哪里。

如果 NAS 的内网 IP 是 `192.168.1.100`，最直接的做法是在路由器、AdGuard Home、Pi-hole 或 dnsmasq 里添加内网解析：

```text
app.aimersoft.org  ->  192.168.1.100
nas.aimersoft.org  ->  192.168.1.100
```

如果你的内网 DNS 支持泛域名，可以直接把 `*.aimersoft.org` 指到 NAS：

```text
*.aimersoft.org  ->  192.168.1.100
```

dnsmasq 可以写成：

```text
address=/aimersoft.org/192.168.1.100
```

注意，这会让 `aimersoft.org` 以及它下面的子域名在内网都指向 NAS。如果这个域名还有正常公网服务，建议单独拿一个内网专用子域，比如 `*.home.aimersoft.org`，避免内网解析把公网服务一起盖掉。

`hosts` 文件也能做解析，但它不能优雅处理泛域名。服务少的时候可以手写：

```text
192.168.1.100 app.aimersoft.org
192.168.1.100 nas.aimersoft.org
```

服务多了还是交给内网 DNS 更省心。

## 让其他设备信任 mkcert

Fedora 主机上运行过 `mkcert -install` 后，本机浏览器一般已经能正常信任证书。其他设备需要安装 `mkcert` 的根证书。

在生成证书的 Fedora 上运行：

```bash
mkcert -CAROOT
```

它会输出一个目录。目录里有两个关键文件：

```text
rootCA.pem
rootCA-key.pem
```

只把 `rootCA.pem` 传给其他设备安装。不要传 `rootCA-key.pem`。

`rootCA.pem` 是根证书，安装它是为了让设备信任这套本地 CA。`rootCA-key.pem` 是根 CA 私钥，拿到它的人可以签发任意域名的证书。如果它泄漏，你应该把所有设备上旧的 mkcert CA 移除，然后重新生成一套 CA 和证书。

### macOS

如果 macOS 弹出导入钥匙串的选择，一般选 `System`。这样同一台机器上的系统服务和不同用户更容易统一信任这张 CA。

`login` 只对当前用户更方便，个人电脑上也能用。`iCloud` 没必要选，本地自签根证书不需要同步到云端。

导入后还要手动信任：

1. 打开 Keychain Access。
2. 找到刚导入的 `mkcert development CA`。
3. 双击证书，展开 Trust。
4. 将 When using this certificate 改成 Always Trust。
5. 关闭窗口并输入密码确认。

只导入不信任，浏览器仍然可能弹证书警告。

### iOS 和 iPadOS

iOS 需要两步：

1. 安装描述文件。
2. 在设置里打开根证书完全信任。

路径通常是：

```text
Settings -> General -> About -> Certificate Trust Settings
```

在 Enable full trust for root certificates 下面打开对应的 mkcert 根证书。

### Android

Android 各厂商菜单不完全一样，可以在设置里搜索：

```text
证书
CA 证书
加密与凭据
从存储设备安装
```

安装用户 CA 时系统可能提示“网络可能受到监控”，这是 Android 对用户安装根证书的正常警告。

浏览器访问通常可以正常使用用户 CA，但部分 App 默认不信任用户安装的 CA。这个限制和 mkcert 无关，是 Android App 自身的网络安全配置决定的。

## Glance monitor 不信任证书

如果 Glance 跑在 Docker 容器里，它不信任 mkcert 很正常。

原因是：Fedora、手机、Mac 信任了 `rootCA.pem`，不代表 Docker 容器里的系统也信任它。容器有自己的证书信任库，Glance 的 `monitor` 组件从容器里发起 HTTPS 请求时，仍然可能看到自签证书错误。

对于 Homelab 导航页的健康检查，最直接的处理是在对应站点上加 `allow-insecure: true`：

```yaml
- type: monitor
  title: 本地服务监控
  sites:
    - title: App
      url: https://app.aimersoft.org
      icon: si:docker
      allow-insecure: true
    - title: NAS
      url: https://nas.aimersoft.org
      allow-insecure: true
```

这只影响 Glance 自己做探活请求时是否接受自签证书，不会改变你的浏览器访问这些服务时的 HTTPS 校验。

如果你想让容器真正信任这张 CA，也可以把 `rootCA.pem` 放进容器的系统证书库并更新信任。但这和镜像基础系统、入口命令有关，维护成本更高。对一个内网导航页的 monitor 来说，优先用 Glance 官方支持的 `allow-insecure` 更稳。

## Chrome 仍然显示旧证书

如果证书换了但 Chrome 还在弹旧警告，不一定是证书文件没生效，可能是连接缓存和 TLS 会话复用。

先确认 Nginx 确实已经重新加载：

```bash
sudo nginx -t
sudo systemctl reload nginx
```

再用 OpenSSL 直接看服务端发出来的证书：

```bash
openssl s_client -connect app.aimersoft.org:443 -servername app.aimersoft.org </dev/null 2>/dev/null | openssl x509 -noout -subject -issuer -dates
```

如果 issuer 已经是 mkcert，说明服务端证书基本没问题，继续处理 Chrome 缓存：

1. 打开 `chrome://net-internals/#sockets`，点击 Flush socket pools。
2. 打开 `chrome://net-internals/#dns`，点击 Clear host cache。
3. 关闭相关标签页，重新打开访问。

如果 Chrome 后台进程一直没退出，可以完全退出 Chrome 后再打开。Linux 上也可以用下面的命令强制结束 Chrome 进程，但它会关闭所有 Chrome 窗口：

```bash
pkill -f chrome
```

如果之前给这个域名开过 HSTS，可以再检查：

```text
chrome://net-internals/#hsts
```

在 Delete domain security policies 里删除对应域名后再试。

## rootCA.pem 要不要公开

`rootCA.pem` 本身不是私钥，单独公开通常不会让别人直接伪造证书。但我仍然不建议把它公开到 GitHub 或网盘。

原因很现实：证书和私钥经常放在相邻目录里，公开 `rootCA.pem` 的时候很容易把 `rootCA-key.pem` 一起带出去。真正不能泄漏的是 `rootCA-key.pem`。

建议：

- 只在内网或可信设备之间传 `rootCA.pem`。
- 不要把 mkcert 的 CA 目录加入配置备份仓库。
- 不要把 `*-key.pem`、`rootCA-key.pem` 上传到任何公开位置。
- 如果根 CA 私钥泄漏，废弃旧 CA，重新生成并让所有设备重新信任。

## 什么时候继续用 Let's Encrypt

mkcert 的优点是内网自用省事，缺点是每台设备都要手动信任本地 CA。

如果有下面这些需求，还是用 Let's Encrypt：

- 服务要给朋友、访客、陌生设备访问。
- 不想在每台设备上导入根证书。
- 第三方客户端必须默认信任 HTTPS。
- 服务本身就暴露在公网。

之前觉得 Let's Encrypt 麻烦，通常是因为手动做 DNS-01。更舒服的做法是用 DNS API 自动化，比如 `acme.sh`、Certbot DNS 插件，或者 Nginx Proxy Manager 的 DNS Challenge。配置好 API Token 后，续签就不需要手动等 DNS 解析了。

内网自用选 mkcert，公网访问选 Let's Encrypt。不要把这两个场景混在一起。

## 参考链接

- [mkcert README](https://github.com/FiloSottile/mkcert)
- [Glance Monitor 配置](https://github.com/glanceapp/glance/blob/main/docs/configuration.md#monitor)
- [Apple: Trust manually installed certificate profiles](https://support.apple.com/en-us/102390)
