# 修复 Windows 上无法连接 `google.com` 的问题

平时在用 Ubuntu ，使用chrome连接谷歌服务没有问题，但是切换到 win10 下就发现了一个严重的问题，我可以正常访问 `google.com.hk` 却不能访问 `google.com` 。

这个问题是垃圾运营商导致的，运营商的 DNS 污染导致无法正确解析 `google.com`。

可以通过手动设置 DNS 或者修改 hosts 文件来解决这个问题。

使用 `8.8.8.0` 和 `8.8.4.4` 即可。
