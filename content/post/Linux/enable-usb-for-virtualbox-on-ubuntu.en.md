---
title: "Enable USB for VirtualBox on Ubuntu"
date: 2020-07-26T07:58:20+08:00
draft: false
ShowToc: true
categories: [Linux]
tags: [ubuntu,virtualbox]
---

Different from Windows, if you wants to use usb enabled to VirtualBox, you must edit a config file, which is needn't on Windows.

I can't remember it and search for web many times because when you set it, you need't to edit it twice. But sometimes, I will reinstall my ubuntu and the config will lost, so I wants to save it on my Blog in case one day I will use it.

So, let's beginning!

---

Just use this command on terminal simply.

```bash
sudo adduser $USERNAME vboxusers
```

Sometimes you will find this command for this.

```bash
sudo usermod -aG vboxusers <username>
```

If you wants to edit it with GUI, just use this:

```bash
sudo apt-get install gnome-system-tools
```

With this tool, you just to select your account and click **Manage Groups** and add the _vboxusers_

Or, you can also edit the config file manually.

The file are on `/etc/group`, just edit it with vim or other editor.

```bash
sudo vim /etc/group
```

And then add your account to vboxusers line.
