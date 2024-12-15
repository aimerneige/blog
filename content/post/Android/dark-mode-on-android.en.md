---
title: "Dark Mode on Android"
date: 2020-09-05T17:43:46+08:00
draft: false
ShowToc: true
categories: [Android]
tags: [android]
---

> In this example, I am using Material Design. But you can also use the `Theme.AppCompat.DayNight`.
>
> This is a simple way to adapt a dark mode, if you wants more, check for GitHub or Internet.

## Change the style

First you should use the `DayNight` style by [Google](https://developer.android.com/guide/topics/ui/look-and-feel/darktheme).

```xml
<style name="AppTheme" parent="Theme.MaterialComponents.DayNight">
```

If you want to let things easily, that's enough. But you can also provide more adaptation.

## Adapt colors

Make a new folder at `project/app/src/main/res/values-night` then make a new resource file `colors.xml`. Edit the color you want to set on dark mode.

For example, you want to let the color of colorPrimary black on dark mode which is green on default.

On your `values/colors.xml`, you have this lien to mak the colorPrimary green.

```xml
<!-- on file values/colors.xml -->
<color name="colorPrimary">#3DDC84</color>
```

You just add a new line on `values-night/colors.xml` like this.

```xml
<!-- on file values-night/colors.xml -->
<color name="colorPrimary">#000000</color>
```

Then the AndroidStudio will understand what you have done and usr the `#000000` when on night mode and use `#3DDC84` on default.

But if you have these color resource on `values/colors.xml` which is not used for theme, just let them in, you need to add them to `values-night/colors.xml`.

```xml
<!-- Common -->
<color name="white">#FFFFFF</color>
<color name="black">#000000</color>
<color name="red">#FF0000</color>
<color name="green">#008000</color>
<color name="blue">#0000FF</color>
<color name="yellow">#FFFF00</color>
<color name="teal">#008080</color>
<color name="Orange">#FFA500</color>
```

So, If you want to change the color on night mode, just add it on `values-night/colors.xml`. AndroidStudio will use colors in `values/colors.xml` on default and use colors in `values-night/colors.xml` when in dark mode.

## Adapt themes

Like what I write on `Adapt colors`, just add a `themes.xml` on folder `project/app/src/main/res/values-night`.

## Adapt Pictures

Most simplest way: **You can just use the transparent picture**.
