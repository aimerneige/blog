---
title: "Vala Env Setup"
date: 2021-10-23T21:36:57+08:00
draft: false
ShowToc: true
categories: [Linux]
tags: [vala]
cover:
    image: "images/vala-setup.png"
    alt: "WiFi Logo"
    relative: false
---

# vala env setup

When it's talking to Linux development, there are many ways to go. But I love elementary and want to build some awesome apps with vala. So this article is about how to set up your vala develop environment on elementary os. In the future, there will more articles about vala and Linux development.

## System Info

When I write this artice (2021-7-31), elementary os 6 is still in develop, so I install it in gnome boxes. My host machine syetem is fedora 34.

```bash
# fedora system info
➜ neofetch
          /:-------------:\          aimerneige@an-xiaomipro 
       :-------------------::        ----------------------- 
     :-----------/shhOHbmp---:\      OS: Fedora 34 (Workstation Edition) x86_64 
   /-----------omMMMNNNMMD  ---:     Host: TM1701 
  :-----------sMMMMNMNMP.    ---:    Kernel: 5.13.5-200.fc34.x86_64 
 :-----------:MMMdP-------    ---\   Uptime: 3 hours, 54 mins 
,------------:MMMd--------    ---:   Packages: 2173 (rpm), 55 (flatpak) 
:------------:MMMd-------    .---:   Shell: zsh 5.8 
:----    oNMMMMMMMMMNho     .----:   Resolution: 1920x1080 
:--     .+shhhMMMmhhy++   .------/   DE: GNOME 40.3 
:-    -------:MMMd--------------:    WM: Mutter 
:-   --------/MMMd-------------;     WM Theme: Adwaita 
:-    ------/hMMMy------------:      Theme: Adwaita [GTK2/3] 
:-- :dMNdhhdNMMNo------------;       Icons: Adwaita [GTK2/3] 
:---:sdNMMMMNds:------------:        Terminal: gnome-terminal 
:------:://:-------------::          CPU: Intel i7-8550U (8) @ 4.000GHz 
:---------------------://            GPU: NVIDIA GeForce MX250 
                                     GPU: Intel UHD Graphics 620 
                                     Memory: 8165MiB / 15875MiB 
```

```bash
# elementary system info
➜ neofetch
         eeeeeeeeeeeeeeeee            aimerneige@Standard-PC-i440FX-PIIX-1996-5c9f7153 
      eeeeeeeeeeeeeeeeeeeeeee         ------------------------------------------------ 
    eeeee  eeeeeeeeeeee   eeeee       OS: elementary OS 6 Early Access x86_64 
  eeee   eeeee       eee     eeee     Host: KVM/QEMU (Standard PC (i440FX + PIIX, 1996) pc-i440fx-5.2) 
 eeee   eeee          eee     eeee    Kernel: 5.8.0-55-generic 
eee    eee            eee       eee   Uptime: 36 mins 
eee   eee            eee        eee   Packages: 1578 (dpkg), 12 (flatpak) 
ee    eee           eeee       eeee   Shell: bash 5.0.17 
ee    eee         eeeee      eeeeee   Resolution: 1920x995 
ee    eee       eeeee      eeeee ee   DE: Unity 
eee   eeee   eeeeee      eeeee  eee   WM: Mutter(Gala) 
eee    eeeeeeeeee     eeeeee    eee   Theme: io.elementary.stylesheet.grape [GTK2/3] 
 eeeeeeeeeeeeeeeeeeeeeeee    eeeee    Icons: Adwaita [GTK2/3] 
  eeeeeeee eeeeeeeeeeee      eeee     Terminal: Tabby 
    eeeee                 eeeee       CPU: Intel i7-8550U (8) @ 1.992GHz 
      eeeeeee         eeeeeee         GPU: 00:02.0 Red Hat, Inc. QXL paravirtual graphic card 
         eeeeeeeeeeeeeeeee            Memory: 965MiB / 1985MiB 
```

## Install SDK

In elementary os, simply run this:

```bash
sudo apt install elementary-sdk
```

After install, you can type `gtk3-widget-factory` in terminal. If you see a application with widget example opened, you are ready to go!

## Install text editor (or IDE)

### vscode

[vscode](https://flathub.org/apps/details/com.visualstudio.code) is good for vala develop.

Install vscode with below command:

```bash
flatpak install flathub com.visualstudio.code
```

After install vscode, you need to install some extensions. Search and install bellow extensions:

1. [vala](https://marketplace.visualstudio.com/items?itemName=prince781.vala) for **Syntax Highlighting**.
2. [uncrustify](https://github.com/LaurentTreguier/vscode-uncrustify) for **Code Formatting**.
3. [Meson](https://marketplace.visualstudio.com/items?itemName=asabil.meson) for **build**.
4. [xml](https://marketplace.visualstudio.com/items?itemName=redhat.vscode-xml)
5. [python](https://marketplace.visualstudio.com/items?itemName=ms-python.python)

Open settings.json, add vala-language-server path.

When you install the sdk, the vala-language-server is installed.

```bash
# Use this to get the vala-language-server path.
which vala-language-server
```

```json
// Add this to your settings.json
	"vls.languageServerPath": "/usr/bin/vala-language-server"
```

I will use vscode but you can still choose your favorite editor.

### elementary code

elementary code is a text editor which support vala syntax highlighting. If you like it, you can use it to develop.

### vim / neovim

You can also choose to use vim or neovim as your editor.

Install [vala.vim](https://github.com/arrufat/vala.vim) to enable syntax highlighting.

### Gnome Builder

[Gnome Builder](https://wiki.gnome.org/Apps/Builder) is a good IDE for vala development.

You can install it from [flatpak](https://flathub.org/apps/details/org.gnome.Builder) easily.

I am not familiar with this, view [Documentation](https://builder.readthedocs.io/en/latest/) for more information.

### More info

https://wiki.gnome.org/Projects/Vala/Toolsvala

## Hello World

After that, write a hello world program and test your environment.

```vala
// helloworld.vala
public class MyApp : Gtk.Application {
    public MyApp () {
        Object (
            application_id: "com.github.myteam.myapp",
            flags: ApplicationFlags.FLAGS_NONE
        );
    }

    protected override void activate () {
        var window = new Gtk.ApplicationWindow (this) {
            default_height = 768,
            default_width = 1024,
            title = "MyApp"
        };
        window.show_all ();
    }

    public static int main (string[] args) {
        return new MyApp ().run (args);
    }
}
```

Build with this command:

```bash
valac --pkg gtk+-3.0 helloworld.vala
```

If build success, you will get a `helloworld` binary file.

Run it:

```bash
./helloworld
```

If you see a empty window with title `MyApp`, you are ready to go.
