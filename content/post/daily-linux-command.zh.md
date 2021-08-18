---
title: "每天一个 Linux 指令"
date: 2020-11-10T10:41:51+08:00
draft: false
ShowToc: true
categories: [Linux]
tags: [cmd]
---

## ifconfig

```bash
➜  ~ ifconfig
enx2c16dba37d18: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 10.0.117.154  netmask 255.255.255.0  broadcast 10.0.117.255
        inet6 2001:250:c00:218:5bd6:795c:5b92:e787  prefixlen 64  scopeid 0x0<global>
        inet6 fe80::2224:6ee:2527:f54d  prefixlen 64  scopeid 0x20<link>
        inet6 2001:250:c00:218:44fc:ad73:aeb8:b07d  prefixlen 64  scopeid 0x0<global>
        ether 2c:16:db:a3:7d:18  txqueuelen 1000  (Ethernet)
        RX packets 110382  bytes 150904005 (150.9 MB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 30811  bytes 3569027 (3.5 MB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

lo: flags=73<UP,LOOPBACK,RUNNING>  mtu 65536
        inet 127.0.0.1  netmask 255.0.0.0
        inet6 ::1  prefixlen 128  scopeid 0x10<host>
        loop  txqueuelen 1000  (Local Loopback)
        RX packets 26251  bytes 4892192 (4.8 MB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 26251  bytes 4892192 (4.8 MB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

wlp2s0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 192.168.7.243  netmask 255.255.255.0  broadcast 192.168.7.255
        inet6 fe80::1dea:1bcb:ae17:fa3b  prefixlen 64  scopeid 0x20<link>
        ether d0:c6:37:dd:91:95  txqueuelen 1000  (Ethernet)
        RX packets 17759  bytes 19498138 (19.4 MB)
        RX errors 0  dropped 7  overruns 0  frame 0
        TX packets 6341  bytes 911629 (911.6 KB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0
```

## ping

Linux 服务器无法上网

1. ping localhost\
   侦测网卡安装或配置有问题
2. ping 网关\
   `ip route show` 查看网关\
   侦测局域网中的网关或路由器是否正常
3. ping dns server\
   在 `/etc/resolv.conf` 查看 dns 配置\
   dns 解析是否可以解析
4. ping 远程地址\
   与外部的连接是否正常

## mtr

网络侦测工具

```
                         My traceroute  [v0.93]
an-xiaomi-book-pro (10.0.117.154)              2020-11-10T10:08:42+0800
Keys:  Help   Display mode   Restart statistics   Order of fields   quit
                               Packets               Pings
 Host                        Loss%   Snt   Last   Avg  Best  Wrst StDev
 1. _gateway                  0.0%   156    1.2   1.8   0.8  16.4   2.6
 2. 10.125.255.2              0.0%   156    0.6   0.5   0.4   0.8   0.1
 3. 172.16.1.254             96.8%   156    2.5   5.7   1.7  18.3   7.1
 4. 129.210.99.202.internet.  0.0%   156    2.1   3.4   1.7  12.4   2.2
 5. 57.53.26.218.internet.sx  0.0%   156    2.7   4.1   2.1  12.9   1.9
 6. 165.151.26.218.internet.  0.0%   156   25.9  25.6  24.0  32.0   0.9
 7. 219.158.101.109           0.0%   155   17.2  14.0  10.1  18.5   2.3
 8. 219.158.5.158             0.0%   155   17.7  15.5  10.9  33.9   3.2
 9. 219.158.16.70             0.0%   155   13.1  15.7  11.7  20.8   2.4
10. 219.158.32.30            18.7%   155  121.5 165.3 108.3 226.9  34.2
11. ae-1.r31.tokyjp05.jp.bb.  0.0%   155   56.5 109.5  55.6 173.8  34.5
12. ae-3.r01.tokyjp08.jp.bb. 18.1%   155  109.4 161.9 108.5 222.7  35.2
13. ae-3.fastly.tokyjp08.jp. 20.6%   155  106.5 161.5 105.9 219.5  33.7
14. 185.199.109.153           0.6%   155  159.2 210.4 157.4 271.3  33.6

```

- Loss 丢包率
- Snt 发送的次数
- Last 最近一次的返回时延
- Avg 平均值
- Best 最短的一次时间
- Wrst 最长的一次时间
- StDev 标准偏差

## traceroute / tracepath

```bash
➜  ~ traceroute aimerneige.com
traceroute to aimerneige.com (185.199.109.153), 30 hops max, 60 byte packets
1  10.0.117.1 (10.0.117.1)  11.848 ms  11.768 ms  11.719 ms
2  10.125.255.2 (10.125.255.2)  0.605 ms  0.578 ms  0.544 ms
3  * * *
4  129.210.99.202.internet.sx.cn (202.99.210.129)  2.015 ms  1.965 ms  1.920 ms
5  233.124.26.218.internet.sx.cn (218.26.124.233)  1.874 ms  2.345 ms 237.124.26.218.internet.sx.cn (218.26.124.237)  2.304 ms
6  245.131.26.218.router-switch.sx.cn (218.26.131.245)  2.902 ms 209.151.26.218.internet.sx.cn (218.26.151.209)  40.287 ms 245.131.26.218.router-switch.sx.cn (218.26.131.245)  2.713 ms
7  219.158.105.93 (219.158.105.93)  10.882 ms 219.158.102.249 (219.158.102.249)  9.079 ms 219.158.101.109 (219.158.101.109)  13.673 ms
8  219.158.5.158 (219.158.5.158)  11.302 ms  11.258 ms 219.158.4.174 (219.158.4.174)  20.035 ms
9  219.158.16.70 (219.158.16.70)  11.866 ms  19.391 ms  19.316 ms
10  219.158.32.30 (219.158.32.30)  216.576 ms  220.853 ms  215.579 ms
11  ae-0.r30.tokyjp05.jp.bb.gin.ntt.net (129.250.2.11)  162.897 ms  162.880 ms ae-1.r31.tokyjp05.jp.bb.gin.ntt.net (129.250.2.153)  163.532 ms
12  ae-3.r01.tokyjp08.jp.bb.gin.ntt.net (129.250.6.133)  215.634 ms ae-3.r00.tokyjp08.jp.bb.gin.ntt.net (129.250.6.129)  213.725 ms ae-2.r00.tokyjp08.jp.bb.gin.ntt.net (129.250.6.127)  169.350 ms
13  * * *
14  * * *
15  * * *
16  * * *
17  * * *
18  * * *
19  * * *
20  * * *
21  * * *
22  * * *
23  * * *
24  * * *
25  * * *
26  * * *
27  * * *
28  * * *
29  * * *
30  * * *
```

```bash
➜  ~ tracepath aimerneige.com
 1?: [LOCALHOST]                      pmtu 1500
 1:  _gateway                                              1.048ms
 1:  _gateway                                              1.195ms
 2:  10.125.255.2                                          0.588ms
 3:  172.16.1.254                                          5.206ms
 4:  129.210.99.202.internet.sx.cn                         2.954ms
 5:  145.53.26.218.internet.sx.cn                          2.496ms
 6:  245.131.26.218.router-switch.sx.cn                    4.198ms
 7:  219.158.11.113                                       13.225ms
 8:  219.158.5.158                                        19.169ms
 9:  219.158.16.70                                        11.860ms
10:  219.158.32.30                                       226.589ms
11:  ae-1.r31.tokyjp05.jp.bb.gin.ntt.net                 165.652ms
12:  ae-3.r00.tokyjp08.jp.bb.gin.ntt.net                 200.616ms
13:  no reply
14:  no reply
15:  no reply
16:  no reply
17:  no reply
18:  no reply
19:  no reply
20:  no reply
21:  no reply
22:  no reply
23:  no reply
24:  no reply
25:  no reply
26:  no reply
27:  no reply
28:  no reply
29:  no reply
30:  no reply
     Too many hops: pmtu 1500
     Resume: pmtu 1500
```

## ip

### 查看网卡信息 `ip addr show`

```bash
➜  ~ ip addr show
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN group default qlen 1000
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
    inet 127.0.0.1/8 scope host lo
       valid_lft forever preferred_lft forever
    inet6 ::1/128 scope host
       valid_lft forever preferred_lft forever
2: wlp2s0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc noqueue state UP group default qlen 1000
    link/ether d0:c6:37:dd:91:95 brd ff:ff:ff:ff:ff:ff
    inet 192.168.7.243/24 brd 192.168.7.255 scope global dynamic noprefixroute wlp2s0
       valid_lft 169205sec preferred_lft 169205sec
    inet6 fe80::1dea:1bcb:ae17:fa3b/64 scope link noprefixroute
       valid_lft forever preferred_lft forever
3: enx2c16dba37d18: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc fq_codel state UP group default qlen 1000
    link/ether 2c:16:db:a3:7d:18 brd ff:ff:ff:ff:ff:ff
    inet 10.0.117.154/24 brd 10.0.117.255 scope global dynamic noprefixroute enx2c16dba37d18
       valid_lft 3601sec preferred_lft 3601sec
    inet6 2001:250:c00:218:44fc:ad73:aeb8:b07d/64 scope global temporary dynamic
       valid_lft 601397sec preferred_lft 82623sec
    inet6 2001:250:c00:218:5bd6:795c:5b92:e787/64 scope global dynamic mngtmpaddr noprefixroute
       valid_lft 2591976sec preferred_lft 604776sec
    inet6 fe80::2224:6ee:2527:f54d/64 scope link noprefixroute
       valid_lft forever preferred_lft forever
```

### 启用/禁用网卡 `sudo ip link set enp0s3 up / dowm`

### 为网卡分配地址

```
sudo ip addr add 192.168.0.50/255.255.255.0 dev enp0s3
sudo ip addr del 192.168.0.10/24 dev enp0s3
```

### ip route

查看路由

`ip route`

```bash
➜  ~ ip route
default via 10.0.117.1 dev enx2c16dba37d18 proto dhcp metric 100
default via 192.168.7.1 dev wlp2s0 proto dhcp metric 600
10.0.117.0/24 dev enx2c16dba37d18 proto kernel scope link src 10.0.117.154 metric 100
169.254.0.0/16 dev enx2c16dba37d18 scope link metric 1000
192.168.7.0/24 dev wlp2s0 proto kernel scope link src 192.168.7.243 metric 600
```

添加静态路由

`sudo ip route add 172.16.32.32 via 192.168.0.150/24 dev enp0s3`

删除路由

`sudo ip route del 192.168.0.150/24`

### arp

查看 arp 记录

`ip neigh`

```bash
➜  ~ ip neigh
192.168.7.2 dev wlp2s0 lladdr e8:39:35:1f:13:b1 STALE
192.168.7.1 dev wlp2s0 lladdr 28:d1:27:85:38:d7 REACHABLE
10.0.117.177 dev enx2c16dba37d18 lladdr e8:39:35:1f:14:fc STALE
192.168.7.38 dev wlp2s0 lladdr 2c:ff:ee:66:e2:01 STALE
10.0.117.1 dev enx2c16dba37d18 lladdr 58:69:6c:07:71:4b REACHABLE
192.168.7.160 dev wlp2s0 lladdr 3e:22:9c:ef:b8:d2 STALE
fe80::5a69:6cff:fe07:714b dev enx2c16dba37d18 lladdr 58:69:6c:07:71:4b router STALE
```

- PERM 永久有效并且只能被管理员删除
- NOARP 记录有效，过期后可被删除
- STALE 记录有效，但可能已经过期
- REACHABLE 记录有效，但超时后就失效了

增加 arp 记录

`sudo ip neigh add 192.168.0.150 lladdr 33:1g:75:37:r3:84 dev enp0s3 nud perm`

删除 arp

`sudo ip neigh del 192.168.0.106 dev enp0s3`

## curl / wget

`curl aimerneige.com`

`wget aimerneige.com`

## netstat

网络连接状态以及其相关信息的程序\
告诉用户哪些网络连接正在运作

- 列出所有端口 `netstat -a`
- 列出所有 tcp 端口 `netstat -at`
- 列出所有 udp 端口 `netstat -au`
- 显示进程 id 和名称 `netstat -p`
- 显示路由信息 `netstat -r`
- 显示所有监听的端口 `netstat -tnl`
